'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import { ActionTooltip } from '@/components/action-tooltip';
import { useRouter } from '@/hooks/use-router';
import { cn } from '@/libs/utils';

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

export const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
            params?.serverId !== id && 'group-hover:h-[15px]',
            params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
          )}
        />
        <div
          className={cn(
            'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px]',
            'group-hover:rounded-[16px] transition-all overflow-hidden',
            params?.serverId === id && 'bg-primary/10 text-primary rounded-[16px]'
          )}
        >
          {imageUrl ? (
            <Image fill src={imageUrl} alt="Server" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary font-semibold text-xl">
              {name[0].toUpperCase()}
            </div>
          )}
        </div>
      </button>
    </ActionTooltip>
  );
};
