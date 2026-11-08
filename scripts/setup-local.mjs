import { existsSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
if (!existsSync('.env.local')) {
  writeFileSync('.env.local', `ADMIN_PASSWORD=${randomBytes(24).toString('hex')}\nORDERS_DB_PATH=./data/orders.sqlite\n`, { mode: 0o600 });
  console.log('Configuración local creada en .env.local. La clave de administración está en ese archivo.');
} else {
  console.log('.env.local ya existe; se conservó su configuración.');
}
