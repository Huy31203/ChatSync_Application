'use client';

import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { ChannelTypeEnum, IServer, MemberRoleEnum } from '@/types';

import { ServerChannel } from './server-channel';
import { ServerHeader } from './server-header';
import { ServerMember } from './server-member';
import { ServerSearch } from './server-search';
import { ServerSection } from './server-section';

const iconMap = {
  [ChannelTypeEnum.TEXT]: <Hash className="h-4 w-4 mr-2" />,
  [ChannelTypeEnum.AUDIO]: <Mic className="h-4 w-4 mr-2" />,
  [ChannelTypeEnum.VIDEO]: <Video className="h-4 w-4 mr-2" />,
};

const roleIconMap = {
  [MemberRoleEnum.GUEST]: null,
  [MemberRoleEnum.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  [MemberRoleEnum.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

export const ServerSidebar = ({ server }: { server: IServer }) => {
  const router = useRouter();

  const { profile, loading } = useAuth();

  if (!loading && !profile) {
    // router.push('/login');
    return null;
  }

  if (!server) {
    // router.push('/');
    return null;
  }

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelTypeEnum.TEXT);
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelTypeEnum.AUDIO);
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelTypeEnum.VIDEO);
  const members = server?.members.filter((member) => member.profile.id !== profile?.id);

  const role = server?.members.find((member) => member.profile.id === profile?.id)?.memberRole;

  return (
    <div
      className="flex flex-col h-full text-primary w-full
    dark:bg-[#2B2D31] bg-[#F2F3F5]"
    >
      <ServerHeader server={server} role={role} />
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
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
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
        <Separator className="bg-zinc-200 dark:bg-zinc-700 roundedmd my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelTypeEnum.TEXT}
              role={role}
              label="Text Channels"
              server={server}
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelTypeEnum.AUDIO}
              role={role}
              label="Voice Channels"
              server={server}
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelTypeEnum.VIDEO}
              role={role}
              label="Video Channels"
              server={server}
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
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
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
