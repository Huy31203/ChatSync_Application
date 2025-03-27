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
import logError from '@/utils';

export const DeleteServerModal = () => {
  const { isOpen, onClose, type, data, setData } = useModal();

  const isModalOpen = isOpen && type === 'deleteServer';

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { server, servers } = data as {
    server: IServer;
    servers: IServer[];
  };

  const deleteServer = async () => {
    try {
      setIsLoading(true);

      await serverService.deleteServer(server?.id ?? '');

      toast.success(`Server ${server?.name} has been deleted successfully.`);

      setData({ servers: servers.filter((s) => s.id !== server?.id) });

      onClose();
      router.push('/');
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-4 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Delete Server</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            <span className="font-semibold text-indigo-500">{server?.name}</span> will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="cancel">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={deleteServer} variant="primary">
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
