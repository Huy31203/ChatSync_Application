import { redirect } from 'next/navigation';

import { ChatHeader } from '@/components/chat/ChatHeader';
import { API_URL } from '@/constants/endpoint';
import { getProfileFromCookie } from '@/lib/action';
import http from '@/lib/http';
import { ApiResponse, IConversation } from '@/types';

const ConversationIdPage = async ({ params }: { params: { serverId: string; memberId: string } }) => {
  const { serverId, memberId } = await params;
  const profile = await getProfileFromCookie();

  if (!profile?.id) {
    return redirect('/login');
  }

  const getRes = await http.get<IConversation>(`${API_URL.SERVERS}/${serverId}/conversations/${memberId}`);
  const getPayload = getRes.payload as ApiResponse<IConversation>;

  // If the conversation does not exist, create a new one
  const conversation =
    getPayload.result ??
    (await (async () => {
      const data = { receiverId: memberId };
      const postRes = await http.post<IConversation>(`${API_URL.SERVERS}/${serverId}/conversations`, data);
      const postPayload = postRes.payload as ApiResponse<IConversation>;
      return postPayload.result;
    })());

  if (!conversation) {
    return redirect(`/servers/${serverId}`);
  }

  console.log('conversation', conversation);

  const { sender, receiver } = conversation;

  const otherMember = sender.profile.id === profile.id ? receiver : sender;

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        type="conversation"
        serverId={serverId}
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.avatarUrl}
      />
    </div>
  );
};

export default ConversationIdPage;
