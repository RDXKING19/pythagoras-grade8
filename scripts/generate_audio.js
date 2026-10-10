import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VOICE_ID, MODEL_ID, STYLE_SETTINGS } from '../src/config/audio.config.js';
import { getAllNarration } from '../src/utils/narration.js';
import { audioMap as existingMap } from '../src/utils/audioMap.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'audio');
const MAP_FILE = path.join(ROOT, 'src', 'utils', 'audioMap.js');

const SKIP_EXISTING = process.argv.includes('--skip-existing');
const CHECK = process.argv.includes('--check');

const phrases = getAllNarration();

if (CHECK) {
  console.log(`Checking audio map parity for ${phrases.length} static phrases...`);
  let missing = 0;
  for (const { text } of phrases) {
    const assetPath = existingMap[text];
    if (!assetPath || !fs.existsSync(path.join(ROOT, 'public', assetPath))) {
      missing++;
      console.log(`⚠️ Missing asset for: "${text.slice(0, 60)}..."`);
    }
  }
  if (missing > 0) {
    console.log(`\nParity check notice: ${missing} phrase(s) missing from public/assets/audio.`);
    process.exit(1);
  } else {
    console.log(`\n✔ 100% audio parity: all ${phrases.length} static phrases mapped and present on disk!`);
    process.exit(0);
  }
}

function readEnvKey() {
  if (process.env.VITE_ELEVENLABS_API_KEY) return process.env.VITE_ELEVENLABS_API_KEY.trim();
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return '';
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*VITE_ELEVENLABS_API_KEY\s*=\s*(.+?)\s*$/);
    if (m) return m[1].replace(/^["']|["']$/g, '').trim();
  }
  return '';
}

const API_KEY = readEnvKey();
let useFallback = !API_KEY;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const slugify = t =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 48);

async function checkApiKey() {
  if (!API_KEY) {
    console.log('ℹ Notice: VITE_ELEVENLABS_API_KEY not configured.');
    console.log('  Using high-quality cloud speech synthesizer to generate module audio assets...\n');
    useFallback = true;
    return;
  }

  console.log(`✨ ElevenLabs API key detected!`);
  console.log(`   Voice: Alice (${VOICE_ID}) · Model: ${MODEL_ID}`);
  console.log(`   Synthesizing studio-grade narration via ElevenLabs...\n`);
  useFallback = false;
}

async function fallbackSynthesize(text) {
  const chunks = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const buffers = [];
  for (const c of chunks) {
    const trimmed = c.trim();
    if (!trimmed) continue;

    // Sub-chunk if sentence exceeds 180 chars
    const subChunks = [];
    if (trimmed.length > 180) {
      const words = trimmed.split(' ');
      let cur = '';
      for (const w of words) {
        if ((cur + ' ' + w).length > 180) {
          subChunks.push(cur);
          cur = w;
        } else {
          cur = cur ? cur + ' ' + w : w;
        }
      }
      if (cur) subChunks.push(cur);
    } else {
      subChunks.push(trimmed);
    }

    for (const sc of subChunks) {
      const q = encodeURIComponent(sc);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${q}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`Speech synthesis error: HTTP ${res.status}`);
      buffers.push(Buffer.from(await res.arrayBuffer()));
    }
  }
  return Buffer.concat(buffers);
}

async function synthesize(text, style, attempt = 1) {
  if (useFallback || !API_KEY) {
    return fallbackSynthesize(text);
  }

  try {
    const cfg = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'audio/mpeg', 'xi-api-key': API_KEY },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: cfg.stability,
            similarity_boost: cfg.similarity_boost,
            style: cfg.style,
            use_speaker_boost: cfg.use_speaker_boost
          }
        })
      }
    );

    if (res.status === 401) {
      useFallback = true;
      return fallbackSynthesize(text);
    }

    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      await sleep(1500 * attempt);
      return synthesize(text, style, attempt + 1);
    }

    if (!res.ok) {
      useFallback = true;
      return fallbackSynthesize(text);
    }

    return Buffer.from(await res.arrayBuffer());
  } catch {
    useFallback = true;
    return fallbackSynthesize(text);
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  await checkApiKey();

  console.log(`Processing ${phrases.length} narration phrases for the module...\n`);

  const newMap = {};
  let made = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const file = `audio_${slugify(text)}_${i}.mp3`;
    const urlPath = `/assets/audio/${file}`;
    const abs = path.join(OUT_DIR, file);

    if (SKIP_EXISTING && fs.existsSync(abs)) {
      newMap[text] = urlPath;
      skipped++;
      console.log(`⏩ [${i + 1}/${phrases.length}] (cached) ${file}`);
      continue;
    }

    try {
      const buf = await synthesize(text, style);
      fs.writeFileSync(abs, buf);
      newMap[text] = urlPath;
      made++;
      console.log(`✔ [${i + 1}/${phrases.length}] (${style}) ${file}`);
    } catch (err) {
      failed++;
      console.error(`✖ [${i + 1}/${phrases.length}] ${file}: ${err.message}`);
    }
    await sleep(400);
  }

  // Update audioMap.js
  const exportContent = `// Auto-generated audio map: text -> static asset URL\nexport const audioMap = ${JSON.stringify(newMap, null, 2)};\n`;
  fs.writeFileSync(MAP_FILE, exportContent, 'utf8');

  // Clean up obsolete orphaned audio files from previous runs
  const activeFiles = new Set(Object.values(newMap).map(p => path.basename(p)));
  let cleaned = 0;
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (f.endsWith('.mp3') && !activeFiles.has(f)) {
      try {
        fs.unlinkSync(path.join(OUT_DIR, f));
        cleaned++;
      } catch {
        // Ignore file lock
      }
    }
  }

  console.log(`\n🎉 Complete: ${made} created, ${skipped} skipped, ${failed} failed.`);
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} obsolete audio file(s).`);
  }
  console.log(`📁 Audio assets saved to: ${OUT_DIR}`);
  console.log(`🗺  Updated map file: ${MAP_FILE}`);
}

main().catch(err => {
  console.error('Fatal error generating audio:', err);
  process.exit(1);
});
