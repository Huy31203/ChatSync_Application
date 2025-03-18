'use client';

import { useEffect, useState } from 'react';

import { CreateChannelModal } from '@/components/modals/create-channel-modal';

import { CreateServerModal } from '../modals/create-server-modal';
import { DeleteChannelModal } from '../modals/delete-channel-modal';
import { EditServerModal } from '../modals/edit-server-modal';
import { InviteModal } from '../modals/invite-modal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      {/* <MemberModal /> */}
      <CreateChannelModal />
      {/* <LeaveServerModal /> */}
      {/* <DeleteServerModal /> */}
      {/* <EditChannelModal /> */}
      <DeleteChannelModal />
    </>
  );
};
