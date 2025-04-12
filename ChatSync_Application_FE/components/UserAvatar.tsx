import { AvatarFallback } from '@radix-ui/react-avatar';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  src?: string;
  name?: string;
  className?: string;
}

export const UserAvatar = ({ src, name, className }: UserAvatarProps) => {
  return (
    <Avatar
      className={cn(
        'h-10 w-10 border border-primary/10 cursor-pointer text-white bg-slate-500 flex justify-center items-center',
        className
      )}
    >
      <AvatarImage src={src} alt="User avatar" />
      <AvatarFallback>{name ? name[0].toUpperCase() : 'P'}</AvatarFallback>
    </Avatar>
  );
};
