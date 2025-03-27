'use client';

import { useParams } from 'next/navigation';
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
import { channelService } from '@/services/channelService';
import { IChannel, IServer } from '@/types';

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data, setData } = useModal();
  const params = useParams();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'deleteChannel';

  const [isLoading, setIsLoading] = useState(false);

  const { server, channel } = data as {
    server: IServer;
    channel: IChannel;
  };

  const deleteChannel = async () => {
    try {
      setIsLoading(true);

      if (!server || !channel) return;

      await channelService.deleteChannel(server.id, channel.id);

      toast.success(`#${channel?.name} has been deleted successfully.`);

      const { channels, ...rest } = server;
      const newServer = {
        ...rest,
        channels: channels.filter((c) => c.id !== channel.id),
      };

      setData({ server: newServer });

      if (params?.channelId === channel.id) {
        router.push(`/servers/${server.id}`);
      }

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Delete Channel</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            <span className="font-semibold text-indigo-500">#{channel?.name}</span> will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="cancel">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={deleteChannel} variant="primary">
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
