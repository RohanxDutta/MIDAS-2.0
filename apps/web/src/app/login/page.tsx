'use client';

import { useState } from 'react';
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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

      router.refresh();
      router.push('/');
    } catch (err: any) {
      console.error('Login error details:', err);
      let userFriendlyMsg = err.message || 'An unexpected error occurred.';
      if (userFriendlyMsg.toLowerCase().includes('failed to fetch')) {
        userFriendlyMsg = 'Unable to connect to the authentication server. Please check your internet connection or try again later.';
      } else if (userFriendlyMsg.toLowerCase().includes('invalid login credentials') || userFriendlyMsg.toLowerCase().includes('invalid_credentials')) {
        userFriendlyMsg = 'Incorrect email or password. Please check your entries and try again.';
      }
      setError(userFriendlyMsg);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-tr from-brand-bg-end to-brand-bg-start min-h-screen px-6 py-12 relative overflow-hidden select-none">
      
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

        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            icon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            icon={<Lock className="w-4 h-4" />}
            rightAction={
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="text-brand-slate hover:text-brand-navy transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
                title={showPassword ? 'Hide password' : 'Show password'}
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

          <Button type="submit" loading={loading} className="mt-2">
            {loading ? (
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
