'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/libs/utils';
import { authService } from '@/services/auth-service';
import { logError } from '@/utils';

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
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="border-0 focus:ring-0 text-white ring-offset-0 fucus:ring-offset-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      className="border-0 focus:ring-0 text-white ring-offset-0 fucus:ring-offset-0"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
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
          <div className="!mt-3">
            <Link href="/forgot-password" className="text-sm text-sky-400 font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full !mt-4" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 text-white bg-[#313338]">Or continue with</span>
        </div>
      </div>

      <Link
        href={!form.formState.isSubmitting ? getProviderLoginUrl('google') : ''}
        className={cn(
          'flex items-center justify-center space-x-2 bg-black py-3 rounded-l-full rounded-r-full',
          form.formState.isSubmitting && 'cursor-not-allowed'
        )}
      >
        <svg
          className="mr-2 h-4 w-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
        Sign in with Google
      </Link>

      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-sky-400 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
