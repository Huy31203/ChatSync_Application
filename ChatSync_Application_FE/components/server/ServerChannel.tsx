'use client';

import { Edit, Hash, Lock, Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

import { ActionTooltip } from '@/components/ActionTooltip';
import { ModalType, useModal } from '@/hooks/useModalStore';
import { useRouter } from '@/hooks/useRouter';
import { cn } from '@/lib/utils';
import { ChannelTypeEnum, IChannel, IServer, MemberRoleEnum } from '@/types';

interface ServerChannelProps {
  channel: IChannel;
  server: IServer;
  role?: MemberRoleEnum;
}

const iconMap = {
  [ChannelTypeEnum.TEXT]: Hash,
};

export const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const { onOpen } = useModal();

  const params = useParams();
  const router = useRouter();

  const Icon = iconMap[channel.type];

  const goToChannel = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { server, channel });
  };

  return (
    <button
      onClick={goToChannel}
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full',
        'hover:bg-gray-700/10 dark:hover:bg-gray-700/50 transition mb-1',
        params?.channelId === channel.id && 'bg-gray-700/20 dark:bg-gray-700'
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-gray-300" />
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600',
          'dark:text-gray-300 dark:group-hover:text-gray-200 transition',
          params?.channelId === channel.id && 'text-primary dark:text-gray-200 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRoleEnum.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e, 'editChannel')}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600
              dark:text-gray-400 dark:hover:text-gray-300 transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => onAction(e, 'deleteChannel')}
              className="hidden group-hover:block w-4 h-4 text-rose-500 hover:text-rose-600
              dark:text-rose-400 dark:hover:text-rose-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock className="hidden group-hover:block ml-auto w-[0.8rem] h-[0.8rem] text-zinc-500 dark:text-gray-300" />
      )}
    </button>
  );
};
