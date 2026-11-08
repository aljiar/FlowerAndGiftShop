import 'server-only';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { CheckoutInput, Order, OrderStatus } from '../orders';
import { priceOrder } from '../orders';

interface Statement { run(...args: unknown[]): unknown; get(...args: unknown[]): Record<string, string> | undefined; all(...args: unknown[]): Record<string, string>[] }
interface Database { exec(sql: string): void; prepare(sql: string): Statement; close(): void }
let database: Database | undefined;
function db(): Database {
  if (database) return database;
  if (process.env.NODE_ENV === 'production' && !process.env.ORDERS_DB_PATH) throw new Error('Configura ORDERS_DB_PATH en un disco persistente.');
  const path = resolve(process.env.ORDERS_DB_PATH || 'data/orders.sqlite');
  mkdirSync(dirname(path), { recursive: true });
  const { DatabaseSync } = require('node:sqlite') as { DatabaseSync: new (path: string) => Database };
  database = new DatabaseSync(path);
  database.exec('PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, request_id TEXT NOT NULL UNIQUE, fingerprint TEXT NOT NULL, created_at TEXT NOT NULL, payload TEXT NOT NULL); CREATE TABLE IF NOT EXISTS inquiries (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, payload TEXT NOT NULL);');
  return database;
}
export function saveOrder(input: CheckoutInput): Order {
  const database = db();
  const fingerprint = createHash('sha256').update(JSON.stringify(input)).digest('hex');
  database.exec('BEGIN IMMEDIATE');
  try {
    const existing = database.prepare('SELECT payload, fingerprint FROM orders WHERE request_id = ?').get(input.requestId);
    if (existing) {
      if (existing.fingerprint !== fingerprint) throw new Error('Este intento ya corresponde a otro pedido. Revisa la confirmación anterior.');
      database.exec('COMMIT');
      return JSON.parse(existing.payload) as Order;
    }
    const order: Order = { ...priceOrder(input), id: `PET-${randomUUID().toUpperCase()}`, accessToken: randomBytes(32).toString('hex'), createdAt: new Date().toISOString(), status: 'pending' };
    database.prepare('INSERT INTO orders (id, request_id, fingerprint, created_at, payload) VALUES (?, ?, ?, ?, ?)').run(order.id, input.requestId, fingerprint, order.createdAt, JSON.stringify(order));
    database.exec('COMMIT');
    return order;
  } catch (error) { database.exec('ROLLBACK'); throw error; }
}
export function getOrder(id: string): Order | undefined {
  const row = db().prepare('SELECT payload FROM orders WHERE id = ?').get(id);
  return row ? JSON.parse(row.payload) as Order : undefined;
}
export function listOrders(): Order[] {
  return db().prepare('SELECT payload FROM orders ORDER BY created_at DESC LIMIT 200').all().map(row => JSON.parse(row.payload) as Order);
}
export function updateOrder(id: string, status: OrderStatus): Order | undefined {
  const database = db();
  database.exec('BEGIN IMMEDIATE');
  try {
    const order = getOrder(id);
    if (order) database.prepare('UPDATE orders SET payload = ? WHERE id = ?').run(JSON.stringify({ ...order, status }), id);
    database.exec('COMMIT');
    return order ? { ...order, status } : undefined;
  } catch (error) { database.exec('ROLLBACK'); throw error; }
}
export function saveInquiry(payload: unknown) {
  db().prepare('INSERT INTO inquiries (id, created_at, payload) VALUES (?, ?, ?)').run(randomUUID(), new Date().toISOString(), JSON.stringify(payload));
}
export function listInquiries(): Array<{ id: string; createdAt: string; name: string; email: string; phone: string; eventType: string; date: string; guests: string; budget: string; message: string }> {
  return db().prepare('SELECT id, created_at, payload FROM inquiries ORDER BY created_at DESC LIMIT 100').all().map(row => ({ ...JSON.parse(row.payload), id: row.id, createdAt: row.created_at }));
}
export function closeOrderStore() { database?.close(); database = undefined; }
