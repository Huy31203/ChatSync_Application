import { Hash, ShieldAlert, ShieldCheck } from 'lucide-react';

import { ChannelTypeEnum, MemberRoleEnum } from '@/types';

export const channelIconMap = {
  [ChannelTypeEnum.TEXT]: <Hash className="h-4 w-4 mr-2" />,
};

export const roleIconMap = {
  [MemberRoleEnum.GUEST]: null,
  [MemberRoleEnum.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  [MemberRoleEnum.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};
