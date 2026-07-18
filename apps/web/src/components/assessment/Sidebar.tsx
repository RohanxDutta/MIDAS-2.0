import { LogOut, Home, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  user: {
    email: string;
    user_metadata?: {
      role?: string;
    };
  } | null;
  onLogout: () => void;
  onGoHome?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  user,
  onLogout,
  onGoHome,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  // Extract initials from email
  const getInitials = (email: string) => {
    if (!email) return 'U';
    const parts = email.split('@')[0];
    if (parts.length <= 2) return parts.toUpperCase();
    return parts.substring(0, 2).toUpperCase();
  };

  const email = user?.email || 'user@icmr.gov.in';
  const role = user?.user_metadata?.role === 'nodal' ? 'Nodal Team' : 'Data Custodian';
  const initials = getInitials(email);

  return (
    <aside
      className={`bg-white/75 backdrop-blur-lg border-r border-brand-border/40 flex flex-col justify-between shrink-0 h-screen sticky top-0 print:hidden select-none transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top Branding & Nav */}
      <div className="flex flex-col">
        {/* Branding & Toggle Header */}
        <div
          className={`py-5 border-b border-brand-border/40 flex items-center justify-between transition-all duration-300 ${
            isCollapsed ? 'px-4 justify-center' : 'px-6'
          }`}
        >
          {!isCollapsed && (
            <div onClick={onGoHome} className="flex items-center gap-2.5 cursor-pointer">
              <BookOpen className="w-5.5 h-5.5 text-brand-blue" />
              <div className="flex flex-col">
                <span className="text-base font-serif font-black text-brand-navy tracking-tight leading-none">
                  MIDAS 2.0
                </span>
                <span className="text-[9px] font-bold text-brand-slate uppercase tracking-wider mt-1">
                  Dataset Quality Toolkit
                </span>
              </div>
            </div>
          )}

          {/* Toggle Collapse Button */}
          <button
            onClick={onToggleCollapse}
            className={`p-1.5 hover:bg-brand-bg-start border border-brand-border/80 hover:border-brand-slate rounded-lg text-brand-slate hover:text-brand-navy transition-all cursor-pointer ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className={`mt-5 transition-all duration-300 ${isCollapsed ? 'px-3' : 'px-4'}`}>
          <button
            onClick={onGoHome}
            className={`flex items-center gap-3 py-2.5 px-3.5 bg-brand-bg-start hover:bg-brand-bg-end border border-brand-border/40 rounded-xl font-bold text-brand-blue transition-all cursor-pointer text-left ${
              isCollapsed ? 'w-12 h-12 justify-center mx-auto' : 'w-full text-sm'
            }`}
            title="Dashboard"
          >
            <Home className="w-5 h-5 text-brand-blue shrink-0" />
            {!isCollapsed && <span>Dashboard</span>}
          </button>
        </div>
      </div>

      {/* Bottom Profile & Logout */}
      <div
        className={`border-t border-brand-border/60 bg-brand-bg-start/30 transition-all duration-300 ${
          isCollapsed ? 'p-3 flex flex-col items-center gap-3' : 'p-5'
        }`}
      >
        {isCollapsed ? (
          <>
            {/* Collapsed initials circle */}
            <div
              className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center text-white text-xs font-bold shadow-xs cursor-default"
              title={`${email} (${role})`}
            >
              {initials}
            </div>

            {/* Collapsed logout icon button */}
            <button
              onClick={onLogout}
              className="w-10 h-10 rounded-xl bg-white hover:bg-red-50 border border-brand-border hover:border-red-200 text-brand-slate hover:text-red-600 transition-all flex items-center justify-center cursor-pointer shadow-3xs"
              title="Logout"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </>
        ) : (
          <>
            {/* Expanded profile details */}
            <div className="flex items-center gap-3 mb-4.5">
              <div className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0 cursor-default">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-brand-navy truncate" title={email}>
                  {email}
                </span>
                <span className="text-[9px] font-extrabold text-brand-blue uppercase tracking-wider mt-0.5">
                  {role}
                </span>
              </div>
            </div>

            {/* Expanded logout action button */}
            <button
              onClick={onLogout}
              className="w-full py-2.5 px-4 bg-white hover:bg-red-50 border border-brand-border hover:border-red-200 text-brand-slate hover:text-red-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
