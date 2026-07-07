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

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
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
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      
      if (!response.ok) {
        toast.error(result.message || 'Login failed');
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
            Welcome back
          </h2>
          <p className="text-[15px] text-gray-500">
            Sign in to your Saree Bazar account
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`block w-full rounded-xl border-0 bg-gray-100/80 px-4 py-4 text-[15px] text-gray-900 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all ${errors.email ? 'ring-2 ring-inset ring-red-500' : ''}`}
              placeholder="Email address"
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
                autoComplete="current-password"
                className={`block w-full rounded-xl border-0 bg-gray-100/80 px-4 py-4 pr-12 text-[15px] text-gray-900 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary transition-all ${errors.password ? 'ring-2 ring-inset ring-red-500' : ''}`}
                placeholder="Password"
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

          <div className="text-center pt-1 pb-1">
            <Link href="/forgot-password" className="text-[14px] font-medium text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline decoration-primary-600/30 transition-all">
              Forgot password?
            </Link>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-xl bg-primary px-4 py-4 text-[15px] font-semibold text-white hover:bg-[#85004B] shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="pt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 text-[13px]">Or sign in with</span>
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
                text="signin_with"
              />
            </div>
          </div>
          
          <div className="text-center pt-2">
            <span className="text-[15px] text-gray-500">Don't have an account? </span>
            <Link 
              href={redirectUrl !== '/' ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : '/register'} 
              className="text-[15px] font-medium text-primary-600 hover:text-primary-700 underline underline-offset-4 decoration-primary-600/30"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
  );
}
