import 'server-only';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { activityEnabled, activityEvents, activitySchema, type ActivityEvent, type ActivityMode, type ActivitySummary, type PublicActivity } from '../activity';
import { commerceReady } from '../constants';
import { localDate, dateAfter } from '../delivery';

interface Statement { run(...args: unknown[]): unknown; all(...args: unknown[]): Array<Record<string, string | number>> }
interface Database { exec(sql: string): void; prepare(sql: string): Statement; close(): void }
let database: Database | undefined;
let prunedDay = '';
function db(): Database {
  if (database) return database;
  if (!process.env.METRICS_DB_PATH) throw new Error('La medición necesita una base configurada.');
  const filename = resolve(process.env.METRICS_DB_PATH);
  if (filename.toLowerCase() === resolve(process.env.ORDERS_DB_PATH || 'data/orders.sqlite').toLowerCase()) throw new Error('La base de métricas debe ser distinta de la base de pedidos.');
  mkdirSync(dirname(filename), { recursive: true });
  const { DatabaseSync } = require('node:sqlite') as { DatabaseSync: new (path: string) => Database };
  const connection = new DatabaseSync(filename);
  try {
    connection.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=100; CREATE TABLE IF NOT EXISTS activity_counts (day TEXT NOT NULL, mode TEXT NOT NULL, event TEXT NOT NULL, source TEXT NOT NULL, product_id TEXT NOT NULL DEFAULT \'\', count INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(day,mode,event,source,product_id));');
  } catch (error) { connection.close(); throw error; }
  database = connection;
  return database;
}
function write(event: ActivityEvent, source: string, productId: string, now: Date) {
  const connection = db();
  const today = localDate(now);
  if (prunedDay !== today) {
    connection.prepare('DELETE FROM activity_counts WHERE day < ?').run(dateAfter(-89, now));
    prunedDay = today;
  }
  connection.prepare('INSERT INTO activity_counts(day,mode,event,source,product_id,count) VALUES(?,?,?,?,?,1) ON CONFLICT(day,mode,event,source,product_id) DO UPDATE SET count=count+1').run(today, commerceReady ? 'live' : 'preview', event, source, productId);
}
export function recordActivity(event: PublicActivity, now = new Date()): boolean {
  if (!activityEnabled) return false;
  const parsed = activitySchema.safeParse(event);
  if (!parsed.success) return false;
  write(parsed.data.event, parsed.data.source, parsed.data.productId || '', now);
  return true;
}
export function recordOrderCreated(now = new Date()) {
  if (!activityEnabled) return;
  try { write('order_created', 'order', '', now); } catch { /* Un fallo de métricas no afecta el pedido guardado. */ }
}
export function readActivity(mode: ActivityMode, days: 7 | 30, now = new Date()): ActivitySummary {
  const from = dateAfter(1 - days, now), to = localDate(now);
  const totals = Object.fromEntries(activityEvents.map(event => [event, 0])) as Record<ActivityEvent, number>;
  const daily = Array.from({ length: days }, (_, index) => ({ day: dateAfter(index + 1 - days, now), productViews: 0, adds: 0, whatsapp: 0 }));
  const summary: ActivitySummary = { from, to, mode, totals, daily, products: [] };
  if (!activityEnabled) return summary;
  const connection = db();
  // También depurar al consultar, aunque no hayan llegado eventos nuevos.
  connection.prepare('DELETE FROM activity_counts WHERE day < ?').run(dateAfter(-89, now));
  const rows = connection.prepare('SELECT day,event,product_id,SUM(count) AS count FROM activity_counts WHERE mode=? AND day>=? AND day<=? GROUP BY day,event,product_id').all(mode, from, to);
  const products = new Map<string, { id: string; views: number; adds: number }>();
  for (const row of rows) {
    const event = String(row.event) as ActivityEvent;
    if (!activityEvents.includes(event)) continue;
    const count = Number(row.count);
    totals[event] += count;
    const day = daily.find(day => day.day === row.day);
    if (day && event === 'product_view') day.productViews += count;
    if (day && event === 'cart_add') day.adds += count;
    if (day && event === 'whatsapp_click') day.whatsapp += count;
    if (row.product_id && (event === 'product_view' || event === 'cart_add')) {
      const id = String(row.product_id);
      const product = products.get(id) || { id, views: 0, adds: 0 };
      if (event === 'product_view') product.views += count;
      else product.adds += count;
      products.set(id, product);
    }
  }
  summary.products = [...products.values()].sort((a, b) => b.views - a.views || b.adds - a.adds || a.id.localeCompare(b.id));
  return summary;
}
export function closeActivityStore() { database?.close(); database = undefined; prunedDay = ''; }
