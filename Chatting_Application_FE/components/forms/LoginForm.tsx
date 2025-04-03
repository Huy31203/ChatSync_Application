/* eslint-disable max-len */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useRouter } from '@/hooks/useRouter';
import { cn } from '@/lib/utils';
import { authService } from '@/services/authService';
import logError from '@/utils';

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        email: values.email,
        password: values.password,
      };
      await authService.login(data);
      toast.success('Logged in successfully');

      router.push('/');
    } catch (error) {
      logError(error);
    }
  };

  const getProviderLoginUrl = (provider: 'google') => {
    return process.env.NEXT_PUBLIC_API_URL + `/oauth2/authorization/${provider}`;
  };

  return (
    <div className="w-full space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-300">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MailIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 dark:bg-gray-900/60  dark:text-white 
                      placeholder:text-gray-500 focus:border-sky-500 focus:ring-sky-500/30"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="dark:text-gray-300">Password</FormLabel>
                </div>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      placeholder="Enter your password"
                      className="pl-10 dark:bg-gray-900/60  dark:text-white 
                      placeholder:text-gray-500 focus:border-sky-500 focus:ring-sky-500/30"
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
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-sky-400 transition-colors hover:text-sky-500 dark:hover:text-sky-300 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 transition-all duration-200 shadow-lg shadow-sky-500/25 mt-2"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full bg-black dark:bg-gray-700/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 dark:text-gray-400 bg-neutral-300 dark:bg-gray-800/90">Or continue with</span>
        </div>
      </div>

      <Link
        href={!form.formState.isSubmitting ? getProviderLoginUrl('google') : ''}
        className={cn(
          'flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/15 dark:text-white py-3 rounded-md transition-colors duration-200 border border-gray-700/50',
          form.formState.isSubmitting && 'cursor-not-allowed opacity-70'
        )}
      >
        <div className="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
            <path
              fill="#ffc107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"
            />
            <path
              fill="#ff3d00"
              d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"
            />
            <path
              fill="#4caf50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"
            />
            <path
              fill="#1976d2"
              d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"
            />
          </svg>
        </div>
        <span>Sign in with Google</span>
      </Link>

      <div className="text-center text-sm pt-4 border-t border-gray-700/50 mt-6">
        <span className="text-neutral-700 dark:text-gray-400">Don&apos;t have an account?</span>{' '}
        <Link
          href="/register"
          className="font-medium text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 hover:underline transition-colors"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
