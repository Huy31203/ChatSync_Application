'use client';

import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/UserAvatar';
import { roleIconMap } from '@/constants/IconMap';
import { useModal } from '@/hooks/useModalStore';
import { useRouter } from '@/hooks/useRouter';
import { memberService } from '@/services/memberService';
import { IMember, IServer, MemberRoleEnum } from '@/types';
import logError from '@/utils';
import { toast } from 'react-toastify';

export const MemberListModal = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState('');

  const isModalOpen = isOpen && type === 'members';

  const { server } = data as { server: IServer };

  // sort members by role
  server?.members.sort((a, b) => {
    if (a.memberRole === MemberRoleEnum.ADMIN) return -1;
    if (b.memberRole === MemberRoleEnum.ADMIN) return 1;
    if (a.memberRole === MemberRoleEnum.MODERATOR) return -1;
    if (b.memberRole === MemberRoleEnum.MODERATOR) return 1;
    return 0;
  });

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      const res = await memberService.deleteMember(server.id, memberId);

      router.refresh();
      onOpen('members', { server: res.result });
    } catch (error) {
      logError(error);
    } finally {
      setLoadingId('');
    }
  };

  const onRoleChange = async (member: IMember, memberRole: MemberRoleEnum) => {
    try {
      setLoadingId(member.id);

      const data = {
        memberRole,
      };

      const res = await memberService.updateMember(server.id, member.id, data);
      toast.success(`Member: ${member.profile.name} role has been updated successfully`);

      router.refresh();
      onOpen('members', { server: res.result });
    } catch (error) {
      logError(error);
    } finally {
      setLoadingId('');
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-4 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Manage Members</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">{server?.members?.length} Members</DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.avatarUrl} name={member.profile.name} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleIconMap[member.memberRole]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {member.memberRole !== MemberRoleEnum.ADMIN && loadingId !== member.id && (
                <div className="ml-auto cursor-pointer">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="mr-2">
                      <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center cursor-pointer">
                          <ShieldQuestion className="w-4 h-4 mr-2" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member, MemberRoleEnum.GUEST)}
                              className="cursor-pointer"
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              <span className="mr-3">Guest</span>
                              {member.memberRole === MemberRoleEnum.GUEST && <Check className="h-4 w-4 ml-auto" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member, MemberRoleEnum.MODERATOR)}
                              className="cursor-pointer"
                            >
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              <span className="mr-3">Moderator</span>
                              {member.memberRole === MemberRoleEnum.MODERATOR && <Check className="h-4 w-4 ml-auto" />}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onKick(member.id)} className="cursor-pointer">
                        <Gavel className="h-4 w-4 mr-2 text-rose-400" />
                        <span className="text-rose-400">Kick</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
