import { create } from 'zustand';

import { ChannelTypeEnum, IChannel, IProfile, IServer } from '@/types';

export type ModalType =
  | 'createServer'
  | 'invite'
  | 'editServer'
  | 'members'
  | 'createChannel'
  | 'deleteServer'
  | 'leaveServer'
  | 'editChannel'
  | 'deleteChannel'
  | 'editProfile';

interface ModalData {
  server?: IServer;
  servers?: IServer[];
  channel?: IChannel;
  channels?: IChannel[];
  channelType?: ChannelTypeEnum;
  profile?: IProfile;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  setData: (data: ModalData) => void;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  setData: (data) => set({ data }),
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
