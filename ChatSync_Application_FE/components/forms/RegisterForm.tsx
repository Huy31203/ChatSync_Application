'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z
    .object({
      name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters' })
        .max(50, { message: 'Name cannot exceed 50 characters' }),
      email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Please enter a valid email address' }),
      password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(100, { message: 'Password cannot exceed 100 characters' })
        .regex(hasUpperCase, { message: 'Password must contain at least one uppercase letter' })
        .regex(hasLowerCase, { message: 'Password must contain at least one lowercase letter' })
        .regex(hasNumber, { message: 'Password must contain at least one number' })
        .regex(hasSpecialChar, { message: 'Password must contain at least one special character' }),
      confirmPassword: z.string(),
      terms: z.boolean().refine((val) => val === true, {
        message: 'You must agree to the terms and conditions',
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('values', values);
      const data = {
        name: values.name,
        email: values.email,
        password: values.password,
      };

      await authService.register(data);

      toast.success('Registered successfully');

      router.push('/login');
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-300">Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input
                      placeholder="John Doe"
                      className="pl-10 dark:bg-gray-900/60  dark:text-white 
                      placeholder:text-gray-500 focus:border-sky-500 focus:ring-sky-500/30"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

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
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10 dark:bg-gray-900/60  dark:text-white 
                      placeholder:text-gray-500 focus:border-sky-500 focus:ring-sky-500/30"
                      {...field}
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

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-gray-700 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="dark:text-gray-300">
                    I agree to the{' '}
                    <Link href="/terms" className="text-sky-400 hover:text-sky-300 hover:underline transition-colors">
                      terms of service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-sky-400 hover:text-sky-300 hover:underline transition-colors">
                      privacy policy
                    </Link>
                  </FormLabel>
                  <FormMessage className="text-red-400" />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 transition-all duration-200 shadow-lg shadow-sky-500/25 mt-4"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm pt-4 border-t border-gray-700/50 mt-6">
        <span className="text-gray-400">Already have an account?</span>{' '}
        <Link href="/login" className="font-medium text-sky-400 hover:text-sky-300 hover:underline transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  );
}
