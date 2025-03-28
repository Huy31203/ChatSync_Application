'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/useModalStore';
import { useRouter } from '@/hooks/useRouter';
import { serverService } from '@/services/serverService';
import { IServer } from '@/types';

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data, setData } = useModal();

  const isModalOpen = isOpen && type === 'leaveServer';

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { server, servers } = data as {
    server: IServer;
    servers: IServer[];
  };

  const leaveServer = async () => {
    try {
      if (!server) return;

      setIsLoading(true);
      await serverService.leaveServerById(server.id);

      setData({ servers: servers.filter((s) => s.id !== server?.id) });
      toast.success(`You have left server ${server.name} successfully.`);

      onClose();
      router.push('/');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Leave Server</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to leave <span className="font-semibold text-indigo-500">{server?.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="p-6">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="cancel">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={leaveServer} variant="primary">
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
