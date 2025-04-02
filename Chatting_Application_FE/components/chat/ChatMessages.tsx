'use client';

import { format } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { channelService } from '@/services/channelService';
import { conversationService } from '@/services/conversationService';
import { IChannel, IConversation, IDirectMessage, IMessage } from '@/types';
import logError from '@/utils';

import { ChatItem } from './ChatItem';
import { ChatWelcome } from './ChatWelcome';

const BATCH_SIZE = 20;
const DATE_FORMAT = 'd/MM/yyyy, HH:mm';

interface ChatMessagesProps {
  name: string;
  serverId: string;
  channel?: IChannel;
  conversation?: IConversation;
  type: 'channel' | 'conversation';
}

export const ChatMessages = ({ name, serverId, channel, conversation, type }: ChatMessagesProps) => {
  const { profile } = useAuth();

  const [messages, setMessages] = useState<IDirectMessage[] | IMessage[]>([]);
  const [messagesPage, setMessagesPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const currentMember =
    type === 'channel'
      ? profile?.members.find((m) => m.server.id === channel?.server.id)
      : profile?.members.find((m) => m.server.id === conversation?.sender.server.id);

  console.log(channel);

  const innerRef = useRef<HTMLDivElement>(null);

  const handleConnect = useCallback(() => {}, []);

  const handleError = useCallback((error) => {
    logError(error);
  }, []);

  const { isConnected, subscribe, send } = useSocket({
    onConnect: handleConnect,
    onError: handleError,
  });

  // Helper function to update messages
  const updateMessages = (prevMessages: any, newMessage: any) => {
    return prevMessages.map((msg) => (msg.id === newMessage.id ? newMessage : msg));
  };

  // Socket connection for real-time messages
  useEffect(() => {
    if (!isConnected) return;

    const subscriptionUrl =
      type === 'channel' ? `/topic/channels/${channel.id}` : `/topic/conversations/${conversation.id}`;

    const subscriptionOtherUrl =
      type === 'channel'
        ? `/topic/channels/${channel.id}`
        : `/topic/conversations/${conversation.relatedConversation.id}`;

    // Subscribe to the conversation topic
    const subscription = subscribe(subscriptionUrl, (message) => {
      console.log('received message', message);

      // Handle received message
      // message is already parsed from JSON
      setMessages((prevMessages) => {
        // Check if message exists within the state updater function
        if (!prevMessages.find((m) => m.id === message.id)) {
          return [message, ...prevMessages];
        } else {
          return updateMessages(prevMessages, message);
        }
      });
    });

    // Subscribe to the other conversation topic
    const subscriptionOther = subscribe(subscriptionOtherUrl, (message) => {
      console.log('received message', message);
      // Handle received message
      // message is already parsed from JSON
      setMessages((prevMessages) => {
        // Check if message exists within the state updater function
        if (!prevMessages.find((m) => m.id === message.id)) {
          return [message, ...prevMessages];
        } else {
          return updateMessages(prevMessages, message);
        }
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
    const fetchChannelMessages = async () => {
      const res = await channelService.getAllMessagesByChannelId(serverId, channel.id, messagesPage, BATCH_SIZE);

      setMessages(res.result.data);
      setHasMoreMessages(res.result.meta.totalPages > 1);

      setIsLoading(false);
    };

    const fetchConversationMessages = async () => {
      const res = await conversationService.getAllMessagesByConversationId(
        serverId,
        conversation.id,
        messagesPage,
        BATCH_SIZE
      );

      setMessages(res.result.data);
      setHasMoreMessages(res.result.meta.totalPages > 1);

      setIsLoading(false);
    };

    (async () => {
      try {
        if (type === 'channel') {
          await fetchChannelMessages();
        } else if (type === 'conversation') {
          await fetchConversationMessages();
        }
      } catch (error) {
        logError(error);
      }
    })();
  }, []);

  // Load more messages when scrolling up
  const loadMoreMessages = async () => {
    if (loadingMore || !hasMoreMessages) return;

    setLoadingMore(true);
    try {
      if (type === 'channel' && channel && hasMoreMessages) {
        const nextPage = messagesPage + 1;
        const res = await channelService.getAllMessagesByChannelId(serverId, channel.id, nextPage, BATCH_SIZE);
        if (res.result.data.length > 0) {
          setMessages((prev) => [...(prev as IMessage[]), ...res.result.data]);
          setMessagesPage(nextPage);
        }
        setHasMoreMessages(res.result.data.length === BATCH_SIZE);
      } else if (type === 'conversation' && conversation) {
        const nextPage = messagesPage + 1;
        const res = await conversationService.getAllMessagesByConversationId(
          serverId,
          conversation.id,
          nextPage,
          BATCH_SIZE
        );
        if (res.result.data.length > 0) {
          const updatedMessages: IDirectMessage[] = res.result.data;
          setMessages((prev) => [...(prev as IDirectMessage[]), ...updatedMessages]);
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
              next={loadMoreMessages}
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
                  type={type}
                  sender={type === 'channel' ? message.sender : message.conversation.sender}
                  currentMember={currentMember}
                  messageId={message.id}
                  chatId={type === 'channel' ? message.channel.id : message.conversation.id}
                  serverId={serverId}
                  timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                  deleted={message.deleted}
                  isUpdated={message.updatedAt !== null}
                  send={send}
                />
              ))}
            </InfiniteScroll>
          )}
        </>
      )}
    </div>
  );
};
