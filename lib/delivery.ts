import { site, timeSlots } from './constants';

export function localDate(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: site.timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
export function localMinutes(now = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: site.timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  return Number(parts.find(p => p.type === 'hour')?.value) * 60 + Number(parts.find(p => p.type === 'minute')?.value);
}
export function dateAfter(days: number, now = new Date()): string {
  const date = new Date(`${localDate(now)}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export function availableDate(date: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return false;
  return date >= localDate(now) && date <= dateAfter(7, now) && parsed.getUTCDay() !== 0 && (date !== localDate(now) || localMinutes(now) < 14 * 60);
}
export function availableSlots(date: string, now = new Date()) {
  if (!availableDate(date, now)) return [];
  // Dos horas de preparación antes del inicio de la franja.
  return timeSlots.filter(slot => date !== localDate(now) || Number(slot.start.slice(0, 2)) * 60 >= localMinutes(now) + 120);
}
export function deliveryDates(now = new Date()) {
  return Array.from({ length: 8 }, (_, i) => {
    const value = dateAfter(i, now);
    return { value, label: `${i === 0 ? 'Hoy · ' : i === 1 ? 'Mañana · ' : ''}${new Date(`${value}T12:00:00Z`).toLocaleDateString('es-BO', { timeZone: site.timezone, weekday: 'long', day: 'numeric', month: 'long' })}`, available: availableSlots(value, now).length > 0 };
  });
}
