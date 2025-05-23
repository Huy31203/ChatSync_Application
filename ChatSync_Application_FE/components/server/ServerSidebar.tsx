'use client';

import { useContext } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { channelIconMap, roleIconMap } from '@/constants/IconMap';
import { ServerContext } from '@/contexts/ServerContext';
import { ServersContext } from '@/contexts/ServersContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/hooks/useRouter';
import { ChannelTypeEnum } from '@/types';

import { ServerChannel } from './ServerChannel';
import { ServerHeader } from './ServerHeader';
import { ServerMember } from './ServerMember';
import { ServerSearch } from './ServerSearch';
import { ServerSection } from './ServerSection';

export const ServerSidebar = () => {
  const router = useRouter();

  const { server, setServer, loading: serverLoading } = useContext(ServerContext);
  const { servers, setServers, loading: serversLoading } = useContext(ServersContext);

  const { profile, loading: authLoading } = useAuth();

  if (!authLoading && !profile) {
    router.push('/login');
    return null;
  }

  if (!serverLoading && server?.id === undefined) {
    router.push('/');
    return null;
  }

  const textChannels =
    server?.channels
      .filter((channel) => channel.type === ChannelTypeEnum.TEXT)
      .sort((a, b) => {
        if (a.name.toLowerCase() === 'general') return -1;
        if (b.name.toLowerCase() === 'general') return 1;
        return a.name.localeCompare(b.name);
      }) || [];
  const members = server?.members.filter((member) => member.profile.id !== profile?.id) || [];

  const role = server?.members.find((member) => member.profile.id === profile?.id)?.memberRole;

  return (
    <div
      className="flex flex-col h-full text-primary w-full
    dark:bg-gradient-to-b from-gray-800 to-gray-700 bg-[#F2F3F5]"
    >
      {!authLoading && !serversLoading && profile && server && (
        <>
          <ServerHeader servers={servers} setServers={setServers} server={server} setServer={setServer} role={role} />
          <ScrollArea className="flex-1 px-3">
            <div className="mt-2">
              <ServerSearch
                data={[
                  {
                    label: 'Text Channels',
                    type: 'channel',
                    data: textChannels.map((channel) => ({
                      id: channel.id,
                      name: channel.name,
                      icon: channelIconMap[channel.type],
                    })),
                  },
                  {
                    label: 'Members',
                    type: 'member',
                    data: members.map((member) => ({
                      id: member.id,
                      name: member.profile.name,
                      icon: roleIconMap[member.memberRole],
                    })),
                  },
                ]}
              />
            </div>
            <Separator className="bg-gray-200 dark:bg-gray-700 roundedmd my-2" />
            <div className="h-full">
              {!!textChannels?.length && (
                <div className="mb-2">
                  <ServerSection
                    sectionType="channels"
                    channelType={ChannelTypeEnum.TEXT}
                    role={role}
                    label="Channels"
                    server={server}
                  />
                  <div className="space-y-[2px]">
                    {textChannels.map((channel) => (
                      <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                    ))}
                  </div>
                </div>
              )}
              {!!members?.length && (
                <div className="mb-2">
                  <ServerSection sectionType="members" role={role} label="Members" server={server} />
                  <div className="space-y-[2px]">
                    {members.map((member) => (
                      <ServerMember key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
};
