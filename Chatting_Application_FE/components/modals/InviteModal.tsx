'use client';

import { Check, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useModal } from '@/hooks/useModalStore';
import { useOrigin } from '@/hooks/useOrigin';
import { serverService } from '@/services/serverService';
import logError from '@/utils';

export const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === 'invite';

  const { server } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const res = await serverService.updateInviteCode(server?.id ?? '');

      onOpen('invite', { server: res.result });
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Invite Your Friends</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-semibold">Server invite link</Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="dark:bg-zinc-700
              focus-visible:ring-0
              focus-visible:ring-offset-0"
              value={inviteUrl}
              readOnly
            />
            <Button disabled={isLoading} onClick={onCopy} size="icon">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <Button disabled={isLoading} onClick={onNew} variant="link" size="sm" className="text-xs mt-4">
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
