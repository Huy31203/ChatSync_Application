import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center dark:bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight dark:text-white">Forgot password</h1>
          <p className="mt-3 text-neutral-600 dark:text-gray-400">Enter your email to reset your password</p>
        </div>
        <div className="mt-8">
          <div className="rounded-lg bg-neutral-300 dark:bg-gray-800/50 p-8 shadow-xl backdrop-blur-sm">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
