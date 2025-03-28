'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
                  <Input
                    className="dark:bg-zinc-700 focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
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
                  <Input
                    className="dark:bg-zinc-700 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="email"
                    readOnly
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 !mt-10">
            <Button disabled={form.formState.isSubmitting} type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
