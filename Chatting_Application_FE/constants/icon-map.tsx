import { ChannelTypeEnum, MemberRoleEnum } from '@/types';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

export const channelIconMap = {
  [ChannelTypeEnum.TEXT]: <Hash className="h-4 w-4 mr-2" />,
  [ChannelTypeEnum.AUDIO]: <Mic className="h-4 w-4 mr-2" />,
  [ChannelTypeEnum.VIDEO]: <Video className="h-4 w-4 mr-2" />,
};

export const roleIconMap = {
  [MemberRoleEnum.GUEST]: null,
  [MemberRoleEnum.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  [MemberRoleEnum.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};
