'use client';

import { useEffect, useState } from 'react';

import { CreateChannelModal } from '@/components/modals/CreateChannelModal';

import { CreateServerModal } from '../modals/CreateServerModal';
import { DeleteChannelModal } from '../modals/DeleteChannelModal';
import { DeleteServerModal } from '../modals/DeleteServerModal';
import { EditChannelModal } from '../modals/EditChannelModal';
import { EditServerModal } from '../modals/EditServerModal';
import { InviteModal } from '../modals/InviteModal';
import { MemberListModal } from '../modals/MemberListModal';

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
      <MemberListModal />
      <CreateChannelModal />
      {/* <LeaveServerModal /> */}
      <DeleteServerModal />
      <EditChannelModal />
      <DeleteChannelModal />
    </>
  );
};
