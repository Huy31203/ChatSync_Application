'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { ActionTooltip } from '@/components/ActionTooltip';
import { useCookies } from '@/contexts/CookieContext';
import { createImageLoader } from '@/lib/imageLoader';
import { cn } from '@/lib/utils';

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

export const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
  const params = useParams();
  const { cookie } = useCookies();

  const customImageLoader = createImageLoader(cookie);

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <Link href={`/servers/${id}`} className="group relative flex items-center">
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
            <Image sizes="75" loader={customImageLoader} fill src={imageUrl} alt="Server" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary font-semibold text-xl">
              {name[0].toUpperCase()}
            </div>
          )}
        </div>
      </Link>
    </ActionTooltip>
  );
};
