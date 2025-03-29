import { redirect } from 'next/navigation';

import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
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

  const getMeOtherRes = await http.get<IConversation>(
    `${API_URL.SERVERS}/${serverId}/conversations/sender/${senderId}/receiver/${receiverId}`
  );
  const getMeOtherPayload = getMeOtherRes.payload as ApiResponse<IConversation>;

  const getOtherMeRes = await http.get<IConversation>(
    `${API_URL.SERVERS}/${serverId}/conversations/sender/${receiverId}/receiver/${senderId}`
  );
  const getOtherMePayload = getOtherMeRes.payload as ApiResponse<IConversation>;

  console.log('getMeOtherPayload', getMeOtherPayload);
  console.log('getOtherMePayload', getOtherMePayload);

  // If the conversation does not exist, create a new both sided conversation
  const conversationMeOther =
    getMeOtherPayload.result ??
    (await (async () => {
      const data = { senderId: senderId, receiverId: receiverId };
      const postRes = await http.post<IConversation>(`${API_URL.SERVERS}/${serverId}/conversations`, data);
      const postPayload = postRes.payload as ApiResponse<IConversation>;
      return postPayload.result;
    })());

  const conversationOtherMe =
    getOtherMePayload.result ??
    (await (async () => {
      const data = { senderId: receiverId, receiverId: senderId };
      const postRes = await http.post<IConversation>(`${API_URL.SERVERS}/${serverId}/conversations`, data);
      const postPayload = postRes.payload as ApiResponse<IConversation>;
      return postPayload.result;
    })());

  if (!conversationMeOther || !conversationOtherMe) {
    return redirect(`/servers/${serverId}`);
  }

  console.log('conversations', [conversationMeOther, conversationOtherMe]);

  const { sender, receiver } = conversationMeOther;

  const otherMember = sender.profile.id === profile.id ? receiver : sender;

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        type="conversation"
        serverId={serverId}
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.avatarUrl}
      />
      <div className="flex-1">Messages</div>
      <ChatInput
        name={otherMember.profile.name}
        type="conversation"
        conversationMeOther={conversationMeOther}
        conversationOtherMe={conversationOtherMe}
      />
    </div>
  );
};

export default ConversationIdPage;
