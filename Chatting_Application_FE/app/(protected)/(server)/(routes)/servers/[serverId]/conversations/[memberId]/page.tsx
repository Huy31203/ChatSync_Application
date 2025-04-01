import { redirect } from 'next/navigation';

import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { API_URL } from '@/constants/endpoint';
import { getProfileFromCookie } from '@/lib/action';
import http from '@/lib/http';
import { ApiResponse, IConversation } from '@/types';

const ConversationIdPage = async ({ params }: { params: { serverId: string; memberId: string } }) => {
  const { serverId, memberId: receiverId } = await params;
  const profile = await getProfileFromCookie();

  if (!profile?.id) {
    return redirect('/login');
  }

  const senderId = profile.members.find((m) => m.server.id === serverId).id;

  const getRes = await http.get<IConversation>(
    `${API_URL.SERVERS}/${serverId}/conversations/sender/${senderId}/receiver/${receiverId}`
  );
  const getPayLoad = getRes.payload as ApiResponse<IConversation>;

  // If the conversation does not exist, create a new conversation
  const conversation =
    getPayLoad.result ??
    (await (async () => {
      const data = { senderId: senderId, receiverId: receiverId };
      const postRes = await http.post<IConversation>(`${API_URL.SERVERS}/${serverId}/conversations`, data);
      const postPayload = postRes.payload as ApiResponse<IConversation>;
      return postPayload.result;
    })());

  const { sender, receiver } = conversation;

  const otherMember = sender.profile.id === profile.id ? receiver : sender;

  return (
    <div className="flex flex-col h-full">
      <ChatHeader type="conversation" name={otherMember.profile.name} imageUrl={otherMember.profile.avatarUrl} />
      <ChatMessages serverId={serverId} conversation={conversation} name={receiver.profile.name} type="conversation" />
      <ChatInput name={otherMember.profile.name} type="conversation" conversation={conversation} />
    </div>
  );
};

export default ConversationIdPage;
