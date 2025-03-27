import { API_URL } from '@/constants/endpoint';
import http from '@/lib/http';
import { ApiResponse, IConversation } from '@/types';

const ConversationIdPage = async ({ params }: { params: { serverId: string; memberId: string } }) => {
  const { serverId, memberId } = await params;

  const getRes = await http.get<IConversation>(`${API_URL.SERVERS}/${serverId}/conversations/${memberId}`);
  const getPayload = getRes.payload as ApiResponse<IConversation>;

  const conversation = getPayload.result;
  if (!conversation?.id) {
    const data = {
      receiverId: memberId,
    };
    const postRes = await http.post<IConversation>(`${API_URL.SERVERS}/${serverId}/conversations`, data);
    const postPayload = postRes.payload as ApiResponse<IConversation>;
    const newConversation = postPayload.result;

    console.log('new conversation', newConversation);
  }

  console.log('conversation', conversation);

  return <div>Conversation Id Page</div>;
};

export default ConversationIdPage;
