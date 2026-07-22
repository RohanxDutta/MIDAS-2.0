import { createBrowserClient } from '@supabase/ssr'

const isProd = process.env.NODE_ENV === 'production';

// Instantiates browser-side Supabase client using client environmental keys and custom secure cookie settings
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-ref.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
  {
    cookies: {
      get(name) {
        if (typeof document === 'undefined') return undefined;
        const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
        return matches ? decodeURIComponent(matches[1]) : undefined;
      },
      set(name, value, options) {
        if (typeof document === 'undefined') return;
        let cookieString = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax;`;
        if (isProd) {
          cookieString += ' Secure;';
        }
        if (options?.maxAge) {
          cookieString += ` Max-Age=${options.maxAge};`;
        }
        document.cookie = cookieString;
      },
      remove(name, options) {
        if (typeof document === 'undefined') return;
        let cookieString = `${name}=; path=/; SameSite=Lax; Max-Age=0;`;
        if (isProd) {
          cookieString += ' Secure;';
        }
        document.cookie = cookieString;
      }
    }
  }
)

