import { redirect } from 'next/navigation';

import { ChatHeader } from '@/components/chat/ChatHeader';
import { API_URL } from '@/constants/endpoint';
import { getProfileFromCookie } from '@/lib/action';
import http from '@/lib/http';
import { ApiResponse, IServer } from '@/types';

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await getProfileFromCookie();

  const { serverId, channelId } = await params;
  const res = await http.get<IServer>(`${API_URL.SERVERS}/${serverId}`);
  const payload = res.payload as ApiResponse<IServer>;

  const server = payload.result;

  const channel = server.channels.find((channel) => channel.id === channelId);

  if (!channel) {
    redirect(`/servers/${serverId}`);
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader serverId={serverId} name={channel.name} type="channel" />
    </div>
  );
};

export default ChannelIdPage;
