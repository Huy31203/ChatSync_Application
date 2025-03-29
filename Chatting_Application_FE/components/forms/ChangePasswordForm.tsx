'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import logError from '@/utils';

// Password validation regex patterns
const hasUpperCase = /[A-Z]/;
const hasLowerCase = /[a-z]/;
const hasNumber = /[0-9]/;
const hasSpecialChar = /[^A-Za-z0-9]/;

export function ChangePasswordForm({ havePassword }: { havePassword: boolean }) {
  const { renewProfile } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  // Define the password form schema with validation
  const passwordFormSchema = z
    .object({
      oldPassword: havePassword ? z.string().min(1, { message: 'Old password is required.' }) : z.string().optional(),
      newPassword: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(100, { message: 'Password cannot exceed 100 characters' })
        .regex(hasUpperCase, { message: 'Password must contain at least one uppercase letter' })
        .regex(hasLowerCase, { message: 'Password must contain at least one lowercase letter' })
        .regex(hasNumber, { message: 'Password must contain at least one number' })
        .regex(hasSpecialChar, { message: 'Password must contain at least one special character' }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match.',
      path: ['confirmPassword'],
    });

  type PasswordFormValues = z.infer<typeof passwordFormSchema>;

  // Initialize the form
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Handle form submission
  async function onSubmit(values: PasswordFormValues) {
    try {
      console.log('Password updated:', values);

      const data = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };

      await authService.changePassword(data);

      toast.success('Password updated successfully!');

      await renewProfile();
    } catch (error) {
      logError(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {havePassword && (
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="dark:bg-zinc-700 focus-visible:ring-0 focus-visible:ring-offset-0"
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      tabIndex={1000}
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="dark:bg-zinc-700 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    tabIndex={1000}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </FormControl>
              <FormDescription className="text-xs">
                Password must contain at least 8 characters, including uppercase, lowercase, number, and special
                character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="dark:bg-zinc-700 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    tabIndex={1000}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 !mt-10">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Update Password</Button>
        </div>
      </form>
    </Form>
  );
}
