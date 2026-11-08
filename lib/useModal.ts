'use client';
import { useEffect, type RefObject } from 'react';

export function useModal(open: boolean, close: () => void, ref: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const panel = ref.current;
    const controls = () => Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]') || []).filter(el => el.getClientRects().length > 0);
    (controls()[0] || panel)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab') {
        const items = controls(), first = items[0], last = items[items.length - 1];
        if (!first) { e.preventDefault(); panel?.focus(); return; }
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || document.activeElement === panel)) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [open, close, ref]);
}
