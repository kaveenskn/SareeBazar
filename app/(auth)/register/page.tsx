'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setRedirectUrl(params.get('redirect') || '/');
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`.trim(),
          email: data.email,
          password: data.password,
        }),
      });
      const result = await response.json();
      
      if (!response.ok) {
        toast.error(result.message || 'Registration failed');
        return;
      }
      
      toast.success('Registration successful! Please login.');
      router.push(redirectUrl !== '/' ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login');
    } catch (error: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const result = await response.json();
      
      if (!response.ok) {
        toast.error(result.message || 'Google Login failed');
        return;
      }
      
      const { loginUser } = await import('@/lib/authStore');
      loginUser(result.user, result.accessToken);
      
      toast.success('Logged in successfully');
      router.push(redirectUrl);
    } catch (error: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] mx-auto space-y-6 sm:space-y-8">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-[32px] font-semibold text-gray-900 tracking-tight mb-2">
            Create an account
          </h2>
          <p className="text-[15px] text-gray-500">
            Already have an account? <Link href={redirectUrl !== '/' ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'} className="font-medium text-primary-600 hover:text-primary-700 underline underline-offset-4 decoration-primary-600/30">Log in</Link>
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="firstName" className="sr-only">First Name</label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                className={`block w-full rounded-xl border-0 bg-gray-100/80 px-4 py-4 text-[15px] text-gray-900 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all ${errors.firstName ? 'ring-2 ring-inset ring-red-500' : ''}`}
                placeholder="First name"
                {...register('firstName')}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="sr-only">Last Name</label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                className={`block w-full rounded-xl border-0 bg-gray-100/80 px-4 py-4 text-[15px] text-gray-900 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all ${errors.lastName ? 'ring-2 ring-inset ring-red-500' : ''}`}
                placeholder="Last name"
                {...register('lastName')}
              />
            </div>
          </div>
          {(errors.firstName || errors.lastName) && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.firstName?.message || errors.lastName?.message}
            </p>
          )}
          
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`block w-full rounded-xl border-0 bg-gray-100/80 px-4 py-4 text-[15px] text-gray-900 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all ${errors.email ? 'ring-2 ring-inset ring-red-500' : ''}`}
              placeholder="Email"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className={`block w-full rounded-xl border-0 bg-gray-100/80 px-4 py-4 pr-12 text-[15px] text-gray-900 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary transition-all ${errors.password ? 'ring-2 ring-inset ring-red-500' : ''}`}
                placeholder="Enter your password"
                {...register('password')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center pt-1">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <label htmlFor="terms" className="ml-2.5 block text-[13px] text-gray-600">
              I agree to the <a href="#" className="underline decoration-gray-300 underline-offset-2 hover:text-primary-600 transition-colors">Terms & Conditions</a>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-xl bg-primary px-4 py-4 text-[15px] font-semibold text-white hover:bg-[#85004B] shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
          
          <div className="pt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 text-[13px]">Or register with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center w-full [&>div]:w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast.error('Google Sign-In failed');
                }}
                theme="outline"
                size="large"
                shape="rectangular"
                width="100%"
                text="signup_with"
              />
            </div>
          </div>
        </form>
      </div>
  );
}
