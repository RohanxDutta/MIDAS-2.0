'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface PortalNavProps {
  user?: SupabaseUser | null;
  onLogout?: () => void;
}

export function PortalNav({ user, onLogout }: PortalNavProps) {
  const pathname = usePathname();

  const getInitials = (email?: string) => {
    if (!email) return 'U';

    const parts = email.split('@')[0];

    if (parts.length <= 2) {
      return parts.toUpperCase();
    }

    return parts.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.email);

  const role =
    (user?.app_metadata?.role ?? user?.user_metadata?.role) === 'nodal'
      ? 'Nodal Team'
      : 'Data Custodian';

  return (
    <nav>
      <Link href="/" className="nav-left">
        <img
          className="nav-logo-img"
          src="/logo.svg"
          alt="ICMR Logo"
        />

        <div className="nav-divider"></div>

        <div className="nav-title-group">
          <span className="nav-title">MIDAS 2.0</span>
          <span className="nav-subtitle">Framework Overview</span>
        </div>
      </Link>

      <div className="nav-right">
        <Link href="/guide" className="nav-btn nav-btn-outline">
          Guide
        </Link>

        {user && (
          <Link
            href={
              role === 'Nodal Team'
                ? '/dashboard'
                : pathname === '/assessments'
                ? '/dashboard'
                : '/assessments'
            }
            className="nav-btn nav-btn-outline"
          >
            {role === 'Nodal Team'
              ? 'Dashboard'
              : pathname === '/assessments'
              ? 'Dashboard'
              : 'My Assessments'}
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-brand-border/40">
            <div className="w-8 h-8 rounded-full bg-brand-navy flex items-center justify-center text-white text-[10px] font-bold shadow-xs shrink-0">
              {initials}
            </div>

            <div className="flex flex-col min-w-0 max-w-[130px]">
              <span className="text-[11px] font-bold text-brand-navy truncate leading-tight">
                {user.email ?? 'Unknown User'}
              </span>

              <span className="text-[8px] font-extrabold text-brand-blue uppercase tracking-wider">
                {role}
              </span>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="nav-btn text-brand-slate hover:text-red-600 hover:bg-red-50 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <Link href="/login" className="nav-btn nav-btn-outline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
} 