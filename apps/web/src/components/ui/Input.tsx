import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  rightAction?: ReactNode;
}

export function Input({ label, icon, rightAction, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-brand-navy mb-2 tracking-wide">
        {label}
      </label>
      <div className="relative rounded-lg shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-slate">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-white border border-brand-border rounded-lg py-3 text-sm text-brand-navy placeholder-brand-slate/70 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all ${
            icon ? 'pl-10' : 'px-4'
          } ${rightAction ? 'pr-10' : 'pr-4'} ${className}`}
          {...props}
        />
        {rightAction && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            {rightAction}
          </div>
        )}
      </div>
    </div>
  );
}
