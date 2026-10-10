import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { audioMap } from '../src/utils/audioMap.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = path.resolve(__dirname, '..', 'public', 'assets', 'audio');

if (!fs.existsSync(AUDIO_DIR)) {
  console.log('No audio folder yet — nothing to clean.');
  process.exit(0);
}

const valid = new Set(Object.values(audioMap).map(p => path.basename(p)));
let removed = 0;

for (const f of fs.readdirSync(AUDIO_DIR)) {
  if (f.endsWith('.mp3') && !valid.has(f)) {
    fs.unlinkSync(path.join(AUDIO_DIR, f));
    console.log('🗑  Removed orphaned audio file:', f);
    removed++;
  }
}

console.log(`Cleanup complete: ${removed} orphaned file(s) removed, ${valid.size} referenced file(s) kept.`);
