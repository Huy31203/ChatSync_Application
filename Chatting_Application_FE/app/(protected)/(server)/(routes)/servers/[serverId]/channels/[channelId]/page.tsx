import { redirect } from 'next/navigation';

import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { API_URL } from '@/constants/endpoint';
import { getProfileFromCookie } from '@/lib/action';
import http from '@/lib/http';
import { ApiResponse, IChannel } from '@/types';

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const { serverId, channelId } = await params;
  const { id } = await getProfileFromCookie();

  const res = await http.get<IChannel>(`${API_URL.SERVERS}/${serverId}/channels/${channelId}`);
  const payload = res.payload as ApiResponse<IChannel>;

  const channel = payload.result;

  console.log('channel', channel);

  if (!channel) {
    redirect(`/servers/${serverId}`);
  }

  return (
    <div className="flex flex-col h-full min-h-screen">
      <ChatHeader type="channel" name={channel.name} />
      <ChatMessages serverId={serverId} channel={channel} name={channel.name} type="channel" />
      <ChatInput name={channel.name} type="channel" channel={channel} />
    </div>
  );
};

export default ChannelIdPage;
