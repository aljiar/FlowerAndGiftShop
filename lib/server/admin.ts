import 'server-only';
import { timingSafeEqual, createHmac } from 'node:crypto';
export const adminCookie = 'petalo-admin';
export function validPassword(value: string): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || secret.length < 16) return false;
  const supplied = Buffer.from(value), expected = Buffer.from(secret);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
export function createSession(): string {
  const expires = String(Date.now() + 8 * 60 * 60 * 1000);
  return `${expires}.${createHmac('sha256', process.env.ADMIN_PASSWORD!).update(expires).digest('hex')}`;
}
export function validSession(value?: string): boolean {
  if (!value || !process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 16) return false;
  const [expires, signature] = value.split('.');
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now() || !signature) return false;
  const expected = Buffer.from(createHmac('sha256', process.env.ADMIN_PASSWORD).update(expires).digest('hex')), supplied = Buffer.from(signature);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
