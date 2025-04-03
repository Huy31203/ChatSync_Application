'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from '@/hooks/useRouter';
import { authService } from '@/services/authService';
import logError from '@/utils';

// Password validation regex patterns
const hasUpperCase = /[A-Z]/;
const hasLowerCase = /[a-z]/;
const hasNumber = /[0-9]/;
const hasSpecialChar = /[^A-Za-z0-9]/;

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(100, { message: 'Password cannot exceed 100 characters' })
        .regex(hasUpperCase, { message: 'Password must contain at least one uppercase letter' })
        .regex(hasLowerCase, { message: 'Password must contain at least one lowercase letter' })
        .regex(hasNumber, { message: 'Password must contain at least one number' })
        .regex(hasSpecialChar, { message: 'Password must contain at least one special character' }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  if (token === '' || email === '') {
    router.push('/login');
    return null;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('values', values);
      const data = {
        email: email,
        token: token,
        newPassword: values.password,
      };

      await authService.resetPassword(data);

      toast.success('Reset Password successfully');
      toast.info('Redirecting to login page in 3s...');

      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      logError(error);
    }
  };

  return (
    <div className="w-full space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-300">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      className="pl-10 dark:bg-gray-900/60  dark:text-white 
                      placeholder:text-gray-500 focus:border-sky-500 focus:ring-sky-500/30"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription className="text-xs text-gray-500 mt-1.5">
                  Password must contain at least 8 characters, including uppercase, lowercase, number, and special
                  character.
                </FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-300">Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="pl-10 dark:bg-gray-900/60  dark:text-white 
                      placeholder:text-gray-500 focus:border-sky-500 focus:ring-sky-500/30"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full !mt-8 bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 transition-all duration-200 shadow-lg shadow-sky-500/25"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Reseting...' : 'Reset password'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
