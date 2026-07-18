'use client';

import { useEffect } from 'react';
import { PortalNav } from './PortalNav';
import { PortalFooter } from './PortalFooter';

interface PortalPageLayoutProps {
  children: React.ReactNode;
}

/**
 * Master shell for every public portal page.
 *
 * Usage:
 *   export default function SomePage() {
 *     return (
 *       <PortalPageLayout>
 *         <section className="...">...page-specific content...</section>
 *       </PortalPageLayout>
 *     );
 *   }
 *
 * What this provides:
 *   - `.portal-home-page` root class so all scoped CSS applies
 *   - Shared <PortalNav /> at the top
 *   - Scroll-triggered `.fade-up` IntersectionObserver (exact match to live site)
 *   - Shared <PortalFooter /> at the bottom
 *
 * New pages only need to provide their own <section> content blocks.
 * Do NOT duplicate nav/footer/observer logic in page components.
 */
export function PortalPageLayout({ children }: PortalPageLayoutProps) {
  // Scroll fade-up animation — mirrors the live site's portal-index.js observer
  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.1 }
      );

      document.querySelectorAll('.fade-up').forEach((el) => {
        observer?.observe(el);
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div className="portal-home-page">
      <PortalNav />
      {children}
      <PortalFooter />
    </div>
  );
}
