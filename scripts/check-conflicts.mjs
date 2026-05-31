import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const conflictMarkers = ['<<<<<<<', '=======', '>>>>>>>'];
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist']);
const ignoredFiles = new Set(['package-lock.json']);
const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.ts',
  '.tsx',
  '.txt',
  '.yml',
]);

function extensionOf(filePath) {
  const index = filePath.lastIndexOf('.');
  return index === -1 ? '' : filePath.slice(index);
}

function walk(directory) {
  const hits = [];

  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    const relativePath = relative(process.cwd(), path) || entry;
    const stats = statSync(path);

    if (stats.isDirectory()) {
      if (!ignoredDirectories.has(entry)) hits.push(...walk(path));
      continue;
    }

    if (!stats.isFile() || ignoredFiles.has(entry) || !textExtensions.has(extensionOf(entry))) {
      continue;
    }

    const lines = readFileSync(path, 'utf8').split('\n');
    lines.forEach((line, index) => {
      if (conflictMarkers.some((marker) => line.startsWith(marker))) {
        hits.push(`${relativePath}:${index + 1}: ${line}`);
      }
    });
  }

  return hits;
}

const hits = walk(process.cwd());

if (hits.length > 0) {
  console.error('Merge conflict markers were found:');
  console.error(hits.join('\n'));
  process.exit(1);
}

console.log('No merge conflict markers found.');
