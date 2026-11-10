import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync, openSync, closeSync, unlinkSync, realpathSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';

export function inspectOrderDatabase(filename) {
  if (!existsSync(filename)) throw new Error('No existe la base de origen.');
  const db = new DatabaseSync(filename, { readOnly: true });
  try {
    db.exec('PRAGMA busy_timeout = 5000;');
    const integrity = db.prepare('PRAGMA integrity_check').all();
    if (integrity.length !== 1 || Object.values(integrity[0])[0] !== 'ok') throw new Error('La base no superó la comprobación de integridad.');
    return {
      orders: db.prepare('SELECT count(*) AS total FROM orders').get().total,
      inquiries: db.prepare('SELECT count(*) AS total FROM inquiries').get().total
    };
  } finally { db.close(); }
}

export function snapshotOrderDatabase(source, destination) {
  const input = realpathSync(resolve(source));
  const output = resolve(destination);
  if (input.toLowerCase() === output.toLowerCase()) throw new Error('El destino debe ser distinto del origen.');
  if (['-wal', '-shm', '-journal'].some(suffix => output.toLowerCase() === input.toLowerCase() + suffix)) throw new Error('El destino no puede ser un archivo auxiliar de la base de origen.');
  inspectOrderDatabase(input);
  if (existsSync(output)) throw new Error('El destino ya existe. Elige un archivo nuevo; no se sobrescriben bases.');
  mkdirSync(dirname(output), { recursive: true });
  // Reserva exclusiva: no sobrescribir un archivo creado entre la comprobación y la copia.
  closeSync(openSync(output, 'wx', 0o600));
  let db;
  try {
    db = new DatabaseSync(input, { readOnly: true });
    db.exec('PRAGMA busy_timeout = 5000;');
    db.prepare('VACUUM INTO ?').run(output);
    db.close(); db = undefined;
    return { path: output, ...inspectOrderDatabase(output) };
  } catch (error) {
    db?.close();
    // El archivo reservado es propiedad de esta operación y podría estar incompleto.
    unlinkSync(output);
    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const { values, positionals } = parseArgs({ options: { source: { type: 'string' }, destination: { type: 'string' } }, allowPositionals: true });
    if (!['backup', 'restore'].includes(positionals[0]) || positionals.length !== 1 || !values.source || !values.destination) {
      throw new Error('Uso: node scripts/order-backup.mjs backup|restore --source origen.sqlite --destination archivo-nuevo.sqlite');
    }
    const result = snapshotOrderDatabase(values.source, values.destination);
    console.log(JSON.stringify({ operation: positionals[0], status: 'ok', ...result }));
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'No se pudo completar la operación.');
    process.exitCode = 1;
  }
}
