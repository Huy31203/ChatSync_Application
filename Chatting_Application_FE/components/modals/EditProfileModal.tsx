'use client';

import { ChangePasswordForm } from '@/components/forms/ChangePasswordForm';
import { ProfileDetailsForm } from '@/components/forms/ProfileDetailForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useModal } from '@/hooks/useModalStore';
import { IProfile } from '@/types';

export function EditProfileModal() {
  const { onOpen, isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === 'editProfile';

  const { profile } = data as { profile: IProfile };

  if (!isModalOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full max-w-md dark:bg-gray-900 grid-cols-2">
            <TabsTrigger value="details">Profile Details</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <ProfileDetailsForm profile={profile} />
          </TabsContent>

          <TabsContent value="password" className="mt-6">
            <ChangePasswordForm havePassword={profile.havePassword} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
