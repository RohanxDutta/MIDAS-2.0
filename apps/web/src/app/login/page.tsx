'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AlertCircle, Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Client-side rate limiting states (Fix #10)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  // Check for session errors on mount (Fix C)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('error') === 'session_expired') {
        setError('Your session has expired or is unauthorized. Please sign in again.');
      }
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTimeLeft <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimeLeft((prev) => {
        if (prev <= 1) {
          setFailedAttempts(0); // Reset attempts after lock lifts
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTimeLeft]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimeLeft > 0) return;
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw authError;
      }

      // Reset spammed attempts counter on successful login
      setFailedAttempts(0);
      setLockoutTimeLeft(0);

      router.refresh();
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error details:', err);
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      let userFriendlyMsg = err.message || 'An unexpected error occurred.';
      if (newAttempts >= 5) {
        setLockoutTimeLeft(30);
        userFriendlyMsg = 'Too many failed login attempts. Account temporarily locked for 30 seconds.';
      } else if (userFriendlyMsg.toLowerCase().includes('failed to fetch')) {
        userFriendlyMsg = 'Unable to connect to the authentication server. Please check your internet connection or try again later.';
      } else if (
        userFriendlyMsg.toLowerCase().includes('invalid login credentials') || 
        userFriendlyMsg.toLowerCase().includes('invalid_credentials')
      ) {
        userFriendlyMsg = `Incorrect email or password. Please check your entries and try again. (Attempt ${newAttempts}/5)`;
      }
      setError(userFriendlyMsg);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-gradient-to-tr from-brand-bg-end to-brand-bg-start relative select-none">
      
      {/* Brand Header */}
      <div className="absolute top-8 left-8">
        <span className="text-xl font-extrabold text-brand-navy tracking-tight">MIDAS 2.0</span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[480px] bg-white border border-brand-border rounded-[24px] px-10 py-12 shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative z-10 flex flex-col">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">
            Welcome Back
          </h1>
          <p className="text-brand-slate text-sm font-medium mt-2">
            Sign in to continue to MIDAS 2.0
          </p>
        </div>

        <form onSubmit={handleLogin} method="POST" className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            icon={<Mail className="w-4 h-4" />}
            autoComplete="username"
            disabled={lockoutTimeLeft > 0}
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            icon={<Lock className="w-4 h-4" />}
            autoComplete="current-password"
            disabled={lockoutTimeLeft > 0}
            rightAction={
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="text-brand-slate hover:text-brand-navy transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
                title={showPassword ? 'Hide password' : 'Show password'}
                disabled={lockoutTimeLeft > 0}
              >
                {showPassword ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            }
          />

          {error && (
            <div className="flex gap-2.5 bg-red-50 border border-red-200 rounded-lg p-3.5 text-xs text-red-600 font-medium">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" loading={loading} disabled={lockoutTimeLeft > 0} className="mt-2">
            {lockoutTimeLeft > 0 ? (
              `Locked out (${lockoutTimeLeft}s)`
            ) : loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
