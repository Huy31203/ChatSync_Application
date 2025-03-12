import RegisterForm from '@/components/forms/register-form';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your details to register</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
