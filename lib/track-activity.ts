'use client';
import { activityEnabled, activitySchema, activityPage, type PublicActivity } from './activity';

export function trackActivity(event: PublicActivity): void {
  if (!activityEnabled || typeof window === 'undefined') return;
  const navigator = window.navigator as Navigator & { globalPrivacyControl?: boolean };
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;
  const parsed = activitySchema.safeParse(event);
  if (!parsed.success) return;
  try {
    void window.fetch('/api/activity', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data),
      credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store', keepalive: true
    }).catch(() => {});
  } catch { /* La medición nunca debe impedir comprar o abrir WhatsApp. */ }
}

export function trackCartAdd(productId: string) {
  if (typeof window === 'undefined') return;
  const page = activityPage(window.location.pathname);
  if (page && ['home', 'catalog', 'occasion', 'product'].includes(page.source)) trackActivity({ event: 'cart_add', source: page.source, productId });
}
