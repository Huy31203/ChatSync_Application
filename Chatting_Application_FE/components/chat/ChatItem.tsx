'use client';

import { useState } from 'react';

import { ActionTooltip } from '@/components/ActionTooltip';
import { UserAvatar } from '@/components/UserAvatar';
import { roleIconMap } from '@/constants/IconMap';
import { IMember } from '@/types';

import { FilePreview } from '../upload/FilePreview';

interface ChatItemProps {
  content: string;
  fileUrls?: string[];
  sender: IMember;
  currentMember: IMember;
  timestamp: string;
  deleted?: boolean;
  isUpdated?: boolean;
}

export const ChatItem = ({
  content,
  fileUrls,
  sender,
  currentMember,
  timestamp,
  deleted = false,
  isUpdated = false,
}: ChatItemProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const icon = roleIconMap[sender.memberRole];

  const isAdmin = sender.memberRole === 'ADMIN';
  const isModerator = sender.memberRole === 'MODERATOR';
  const isOwner = sender.id === currentMember.id;

  const canDelete = !deleted && (isAdmin || isModerator || isOwner);
  const canEdit = !deleted && isOwner && fileUrls?.length === 0;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={sender.profile.avatarUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="text-sm font-semibold hover:underline cursor-pointer text-zinc-900 dark:text-zinc-100">
                {sender.profile.name}
              </p>
              <ActionTooltip label={sender.memberRole} side="top">
                {icon}
              </ActionTooltip>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{timestamp}</p>
          </div>
          <div className="flex flex-col gap-y-2 mt-1">
            <p className={`text-sm text-zinc-800 dark:text-zinc-200 ${deleted ? 'line-through' : ''}`}>
              {deleted ? 'This message was deleted' : content}
            </p>
            {fileUrls && fileUrls.length > 0 && (
              <div className="flex gap-x-2">
                {fileUrls.map((url, index) => (
                  <FilePreview key={url || index.toString()} url={url} removeable={false} onRemove={() => {}} />
                ))}
              </div>
            )}
            {isUpdated && <p className="text-xs text-zinc-500 dark:text-zinc-400">Edited</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
