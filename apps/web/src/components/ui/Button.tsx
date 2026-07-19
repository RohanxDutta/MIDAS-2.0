import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
}

export function Button({ children, loading, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`w-full bg-brand-navy hover:bg-brand-navy-hover text-white font-semibold py-[13px] px-[26px] rounded-full transition-all flex items-center justify-center gap-2 shadow-[0_14px_30px_rgba(31,77,119,0.2)] hover:-translate-y-[2px] hover:shadow-[0_18px_36px_rgba(31,77,119,0.25)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_14px_30px_rgba(31,77,119,0.2)] ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {children}
    </button>
  );
}
