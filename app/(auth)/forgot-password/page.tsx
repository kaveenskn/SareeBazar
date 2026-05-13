'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Something went wrong');
      }

      setIsSubmitted(true);
      toast.success('Password reset link sent!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-peacock-100/30">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-peacock-900">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        {isSubmitted ? (
          <div className="rounded-md bg-peacock-50 p-4 mt-8 text-center">
            <h3 className="text-sm font-medium text-peacock-800">Check your email</h3>
            <div className="mt-2 text-sm text-peacock-700">
              <p>We've sent a password reset link to your email address. (Check server console during dev)</p>
            </div>
            <div className="mt-6">
              <Link href="/login" className="text-sm font-semibold text-peacock-600 hover:text-peacock-500">
                &larr; Back to login
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`relative block w-full rounded-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ${errors.email ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-peacock-500 sm:text-sm sm:leading-6`}
                  placeholder="Email address"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-lg bg-peacock-500 px-3 py-3 text-sm font-semibold leading-6 text-white hover:bg-peacock-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peacock-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Sending link...' : 'Send reset link'}
              </button>
            </div>
            
            <div className="text-center text-sm">
              <Link href="/login" className="font-semibold text-gray-600 hover:text-peacock-700 transition-colors">
                &larr; Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
