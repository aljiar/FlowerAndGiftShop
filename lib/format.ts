import { site } from './constants';
import { localDate, dateAfter, availableDate } from './delivery';

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: site.currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPriceShort(value: number): string {
  const symbol = site.currencySymbol;
  return `${symbol} ${new Intl.NumberFormat('es-BO', { maximumFractionDigits: 0 }).format(value)}`;
}

export function formatDateEs(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString('es-BO', {
    timeZone: site.timezone,
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString('es-BO', { timeZone: site.timezone, day: '2-digit', month: 'short' });
}

export function todayIso(): string { return localDate(); }
export function addDaysIso(days: number): string { return dateAfter(days); }
export function isCutToday(now: Date = new Date()): boolean { return availableDate(localDate(now), now); }

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function cn(...inputs: Array<string | undefined | false | null>): string {
  return inputs.filter(Boolean).join(' ');
}
