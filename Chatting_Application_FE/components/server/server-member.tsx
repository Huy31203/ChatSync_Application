'use client';

import { useParams } from 'next/navigation';

import { UserAvatar } from '@/components/user-avatar';
import { roleIconMap } from '@/constants/icon-map';
import { useRouter } from '@/hooks/use-router';
import { cn } from '@/libs/utils';
import { IMember, IServer } from '@/types';

interface ServerMemberProps {
  member: IMember;
  server: IServer;
}

export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.memberRole];

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'group px-2 py-2 rounded-md flex items-center w-full',
        'hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.memberId === member.id && 'bg-zinc-700/20 dark:hover:bg-zinc-700'
      )}
    >
      <UserAvatar src={member.profile.avatarUrl} className="h-8 w-8 md:h-8 md:w-8" />
      <p
        className={cn(
          'font-semibold text-sm pl-2 whitespace-nowrap overflow-hidden text-ellipsis',
          'text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 text-left dark:group-hover:text-zinc-300 transition',
          params?.memberId === member.id && 'text-primary dark:text-zinc-200 dark:group-hover:text-white',
          icon !== null ? 'w-32' : 'w-40'
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};
