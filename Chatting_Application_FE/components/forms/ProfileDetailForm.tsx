'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MailIcon, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services/profileService';
import uploadService from '@/services/uploadService';
import { IProfile } from '@/types';
import logError from '@/utils';

import { ProfileAvatarUpload } from '../upload/ProfileAvatarUpload';

// Define the form schema with validation
const profileDetailsSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string(),
  avatar: z.any().optional(),
});

type ProfileDetailsFormValues = z.infer<typeof profileDetailsSchema>;

interface ProfileDetailsFormProps {
  profile: IProfile;
}

export function ProfileDetailsForm({ profile }: ProfileDetailsFormProps) {
  const router = useRouter();
  const { renewProfile } = useAuth();

  // Initialize the form with default values from the profile
  const form = useForm<ProfileDetailsFormValues>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      avatar: profile.avatarUrl,
    },
  });

  // Handle form submission
  async function onSubmit(values: ProfileDetailsFormValues) {
    try {
      console.log('Profile details updated:', values);
      const data = {
        name: values.name,
        email: values.email,
        avatarUrl: profile.avatarUrl,
      };

      if (typeof values.avatar !== 'string') {
        const { fileUrl } = await uploadService.uploadImage(values.avatar);
        data.avatarUrl = fileUrl;
      }

      await profileService.updateProfile(profile.id, data);

      await renewProfile();

      toast.success('Profile updated successfully');

      router.refresh();
    } catch (error) {
      logError(error);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <ProfileAvatarUpload avatarUrl={field.value} name={profile.name} onImageChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input
                      className="pl-10 dark:bg-gray-900/60  dark:text-white 
                      placeholder:text-gray-500 focus:border-sky-500 focus:ring-sky-500/30"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MailIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input
                      className="pl-10 dark:bg-gray-900/60  dark:text-white 
                    placeholder:text-gray-500"
                      type="email"
                      readOnly
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 !mt-10">
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 transition-all duration-200 shadow-lg shadow-sky-500/25"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
