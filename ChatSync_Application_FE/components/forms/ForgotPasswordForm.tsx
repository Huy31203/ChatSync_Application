'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MailIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/authService';
import logError from '@/utils';

const resetPasswordSchema = z.object({
  email: z.string().email({
    message: 'Hãy nhập một email hợp lệ.',
  }),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ForgotPasswordForm() {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      const data = {
        email: values.email,
      };

      await authService.forgotPassword(data);
      setIsSubmitSuccessful(true);
    } catch (error) {
      logError(error);
    }
  };

  if (isSubmitSuccessful) {
    return (
      <Card className="border-0 bg-transparent shadow-none">
        <CardContent className="pt-3">
          <Alert className="border-green-500/20 bg-green-500/60 dark:bg-green-500/10 text-green-200">
            <AlertDescription className="py-2 text-green-800 dark:text-inherit">
              If there&apos;s an account with email: <span className="font-semibold">{form.getValues().email}</span>,
              <br />
              we&apos;ll send you a link to reset your password.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-center pt-4 py-3">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-sky-400 transition-colors hover:text-sky-300 hover:underline"
          >
            Trở về trang đăng nhập
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-300s">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MailIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input
                      placeholder="Your email address"
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
          <Button
            type="submit"
            className="w-full !mt-7 bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 transition-all duration-200 shadow-lg shadow-sky-500/25"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Loading...' : 'Reset password'}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm pt-4 border-t border-gray-700/50 mt-6">
        <span className="text-gray-400">Want to login?</span>{' '}
        <Link href="/login" className="font-medium text-sky-400 hover:text-sky-300 hover:underline transition-colors">
          Login
        </Link>
      </div>
    </div>
  );
}
