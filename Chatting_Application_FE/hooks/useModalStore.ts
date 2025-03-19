import { create } from 'zustand';

import { ChannelTypeEnum, IChannel, IServer } from '@/types';

export type ModalType =
  | 'createServer'
  | 'invite'
  | 'editServer'
  | 'members'
  | 'createChannel'
  | 'deleteServer'
  | 'leaveServer'
  | 'editChannel'
  | 'deleteChannel';

interface ModalData {
  server?: IServer;
  channel?: IChannel;
  channelType?: ChannelTypeEnum;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
