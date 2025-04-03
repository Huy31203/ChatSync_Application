'use client';

import { Plus, Settings } from 'lucide-react';

import { ActionTooltip } from '@/components/ActionTooltip';
import { useModal } from '@/hooks/useModalStore';
import { ChannelTypeEnum, IServer, MemberRoleEnum } from '@/types';

interface ServerSectionProps {
  label: string;
  role?: MemberRoleEnum;
  sectionType: 'channels' | 'members';
  channelType?: ChannelTypeEnum;
  server?: IServer;
}

export const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSectionProps) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-gray-300">{label}</p>
      {role !== MemberRoleEnum.GUEST && sectionType === 'channels' && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen('createChannel', { server, channelType })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-gray-300 dark:hover:text-zinc-200 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRoleEnum.ADMIN && sectionType === 'members' && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen('members', { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-gray-300 dark:hover:text-zinc-200 transition"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
