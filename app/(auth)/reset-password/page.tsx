'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Password reset failed');
      }

      toast.success('Password reset successfully!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {!token && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <p className="text-sm text-red-700">Missing reset token. Please request a new password reset link.</p>
        </div>
      )}

      <div className="space-y-4 rounded-md shadow-sm">
        <div>
          <label htmlFor="password" className="sr-only">New Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className={`relative block w-full rounded-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ${errors.password ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-peacock-500 sm:text-sm sm:leading-6`}
            placeholder="New Password"
            {...register('password')}
            disabled={!token}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className={`relative block w-full rounded-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ${errors.confirmPassword ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-peacock-500 sm:text-sm sm:leading-6`}
            placeholder="Confirm New Password"
            {...register('confirmPassword')}
            disabled={!token}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading || !token}
          className="flex w-full justify-center rounded-lg bg-peacock-500 px-3 py-3 text-sm font-semibold leading-6 text-white hover:bg-peacock-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peacock-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
      
      <div className="text-center text-sm">
        <Link href="/login" className="font-semibold text-gray-600 hover:text-peacock-700 transition-colors">
          &larr; Back to login
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-peacock-100/30">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-peacock-900">
            Create new password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your new password below
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
