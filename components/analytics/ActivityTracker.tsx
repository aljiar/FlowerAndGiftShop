'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { activityEnabled, activityPage } from '@/lib/activity';
import { trackActivity } from '@/lib/track-activity';

export function ActivityTracker() {
  const pathname = usePathname();
  const lastPage = useRef('');
  useEffect(() => {
    if (!activityEnabled || !pathname) return;
    const page = activityPage(pathname);
    if (!page) return;
    if (lastPage.current !== pathname) {
      lastPage.current = pathname;
      if (page.view) trackActivity(page.view);
    }
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(target instanceof HTMLAnchorElement)) return;
      try { if (new URL(target.href).hostname === 'wa.me') trackActivity({ event: 'whatsapp_click', source: page.source }); } catch { /* No se registra la URL. */ }
    };
    document.addEventListener('click', click, true);
    return () => document.removeEventListener('click', click, true);
  }, [pathname]);
  return null;
}
