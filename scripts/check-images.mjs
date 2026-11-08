import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
mkdirSync('output/qa/catalogue-images', { recursive: true });
function readSources(dir) {
  return readdirSync(dir, { withFileTypes: true }).map(entry => entry.isDirectory() ? readSources(join(dir, entry.name)) : /\.tsx?$/.test(entry.name) ? readFileSync(join(dir, entry.name), 'utf8') : '').join('\n');
}
const source = ['app', 'components', 'lib'].map(readSources).join('\n');
const ids = [...new Set([...source.matchAll(/photo-\d+-[a-z0-9]+/g)].map(match => match[0]))];
const failures = [];
for (let i = 0; i < ids.length; i += 4) {
  await Promise.all(ids.slice(i, i + 4).map(async id => {
    const response = await fetch(`https://images.unsplash.com/${id}?auto=format&fit=crop&w=240&h=240&q=60`, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) failures.push({ id, status: response.status });
    const bytes = Buffer.from(await response.arrayBuffer());
    if (response.ok) writeFileSync(`output/qa/catalogue-images/${id}.jpg`, bytes);
  }));
}
console.log(JSON.stringify({ checked: ids.length, failures }));
if (failures.length) process.exitCode = 1;
