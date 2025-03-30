'use client';

import { format } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { conversationService } from '@/services/conversationService';
import { IChannel, IConversation, IDirectMessage } from '@/types';
import logError from '@/utils';

import { ChatItem } from './ChatItem';
import { ChatWelcome } from './ChatWelcome';

const BATCH_SIZE = 10;
const DATE_FORMAT = 'd MMM yyyy, HH:mm';

interface ChatMessagesProps {
  name: string;
  channel?: IChannel;
  conversation?: IConversation;
  type: 'channel' | 'conversation';
}

export const ChatMessages = ({ name, channel, conversation, type }: ChatMessagesProps) => {
  const { profile, loading } = useAuth();

  const [messages, setMessages] = useState<IDirectMessage[]>([]);
  const [messagesPage, setMessagesPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const currentMember = profile?.members.find((m) => m.server.id === conversation?.sender.server.id);

  const innerRef = useRef<HTMLDivElement>(null);

  const handleConnect = useCallback(() => {}, []);

  const handleError = useCallback((error) => {
    logError(error);
  }, []);

  const { isConnected, subscribe } = useSocket({
    onConnect: handleConnect,
    onError: handleError,
  });

  // Socket connection for real-time messages
  useEffect(() => {
    if (!isConnected) return;

    const subscriptionUrl = type === 'channel' ? '' : `/topic/conversations/${conversation.id}`;

    const subscriptionOtherUrl =
      type === 'channel'
        ? `/topic/channels/${channel.id}`
        : `/topic/conversations/${conversation.relatedConversation.id}`;

    // Subscribe to the conversation topic
    const subscription = subscribe(subscriptionUrl, (message) => {
      // Handle received message
      // message is already parsed from JSON
      setMessages((prevMessages) => {
        const newMessages = [message, ...prevMessages];
        return newMessages;
      });
    });

    // Subscribe to the other conversation topic
    const subscriptionOther = subscribe(subscriptionOtherUrl, (message) => {
      // Handle received message
      // message is already parsed from JSON
      setMessages((prevMessages) => {
        const newMessages = [message, ...prevMessages];
        return newMessages;
      });
    });

    // Clean up subscription when component unmounts
    return () => {
      subscription.unsubscribe();
      subscriptionOther.unsubscribe();
    };
  }, [conversation, isConnected, type]);

  // Initial message loading
  useEffect(() => {
    const fetchConversationMessages = async () => {
      const res = await conversationService.getAllMessagesByConversationId(conversation.id, messagesPage, BATCH_SIZE);

      setMessages(res.result.data);

      setIsLoading(false);
    };

    try {
      if (type === 'channel') {
        // setMessages(channel.messages);
      } else if (type === 'conversation') {
        fetchConversationMessages();
      }
    } catch (error) {
      logError(error);
    }
  }, []);

  // Load more messages when scrolling up
  const loadMoreMessages = async () => {
    console.log('loadMoreMessages', loadingMore, hasMoreMessages);

    if (loadingMore || !hasMoreMessages) return;

    setLoadingMore(true);
    try {
      if (type === 'channel' && channel && hasMoreMessages) {
        // const nextPage = messagesPage + 1
        // const res = await conversationService.getChannelMessages(channel.id, nextPage, BATCH_SIZE)
        // if (res.result.data.length > 0) {
        //   setMessages((prev) => [...res.result.data, ...prev])
        //   setMessagesPage(nextPage)
        // }
        // setHasMoreMessages(res.result.data.length === BATCH_SIZE)
      } else if (type === 'conversation' && conversation) {
        const nextPage = messagesPage + 1;
        const res = await conversationService.getAllMessagesByConversationId(conversation.id, nextPage, BATCH_SIZE);

        if (res.result.data.length > 0) {
          setMessages((prev) => [...prev, ...res.result.data]);
          setMessagesPage(nextPage);
        }
        setHasMoreMessages(res.result.data.length === BATCH_SIZE);
      }
    } catch (error) {
      logError(error);
    } finally {
      setLoadingMore(false);
    }
  };

  console.log(!isLoading && messages.length === 0);

  return (
    <div id="divRef" ref={innerRef} className="h-full flex flex-1 flex-col-reverse py-4 overflow-y-auto">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {' '}
          {messages.length === 0 ? (
            <ChatWelcome name={name} type={type} />
          ) : (
            <InfiniteScroll
              dataLength={messages.length}
              next={() => {
                if (innerRef.current) {
                  innerRef.current.scrollIntoView({ behavior: 'instant' });
                }
                loadMoreMessages();
              }}
              hasMore={hasMoreMessages}
              loader={<></>}
              style={{ display: 'flex', flexDirection: 'column-reverse' }}
              inverse={true}
              scrollableTarget="divRef"
              initialScrollY={100}
            >
              {messages.map((message, idx) => (
                <ChatItem
                  key={`${message.id}-${idx}`}
                  content={message.content}
                  fileUrls={message.fileUrls}
                  sender={message.conversation.sender}
                  currentMember={currentMember}
                  timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                  deleted={message.deleted}
                  isUpdated={message.updatedAt !== null}
                />
              ))}
            </InfiniteScroll>
          )}
        </>
      )}
    </div>
  );
};
