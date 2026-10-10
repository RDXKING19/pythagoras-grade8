import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'story');

// 6 Story Panels per PRD §13
const PANELS = [
  {
    num: 1,
    title: 'The Shortcut Problem',
    color1: [46, 16, 101],   // #2e1065
    color2: [88, 28, 135]    // #581c87
  },
  {
    num: 2,
    title: 'Squares on the Sides',
    color1: [23, 37, 84],    // #172554
    color2: [30, 58, 138]    // #1e3a8a
  },
  {
    num: 3,
    title: 'Finding the Longest Side',
    color1: [20, 83, 45],    // #14532d
    color2: [22, 101, 52]    // #166534
  },
  {
    num: 4,
    title: 'Finding a Shorter Side',
    color1: [112, 26, 117],  // #701a75
    color2: [134, 25, 143]   // #86198f
  },
  {
    num: 5,
    title: 'Is the Corner Square?',
    color1: [124, 45, 18],   // #7c2d12
    color2: [154, 52, 18]    // #9a3412
  },
  {
    num: 6,
    title: 'Build It Right',
    color1: [30, 27, 75],    // #1e1b4b
    color2: [49, 46, 129]    // #312e81
  }
];

// Precompute CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data ? data.length : 0;
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(len, 0);

  const crcData = Buffer.concat(data ? [typeBuf, data] : [typeBuf]);
  const crc = crc32(crcData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat(data ? [lenBuf, typeBuf, data, crcBuf] : [lenBuf, typeBuf, crcBuf]);
}

function createPng(width, height, color1, color2) {
  // Signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR: 13 bytes
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type 2 (RGB)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines with filter byte 0
  const scanlineLength = 1 + width * 3;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // filter byte: None
    const t = y / height;

    const r = Math.round(color1[0] * (1 - t) + color2[0] * t);
    const g = Math.round(color1[1] * (1 - t) + color2[1] * t);
    const b = Math.round(color1[2] * (1 - t) + color2[2] * t);

    for (let x = 0; x < width; x++) {
      // Vignette effect
      const dx = (x - width / 2) / (width / 2);
      const dy = (y - height / 2) / (height / 2);
      const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 0.4);
      const factor = 1 - dist;

      const pxOffset = rowOffset + 1 + x * 3;
      rawData[pxOffset] = Math.round(r * factor);
      rawData[pxOffset + 1] = Math.round(g * factor);
      rawData[pxOffset + 2] = Math.round(b * factor);
    }
  }

  const deflated = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', null);

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

export function generateAllArt() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Generating 6 true 1024x1024 story PNG placeholders in: ${OUT_DIR}`);

  PANELS.forEach(p => {
    const filePath = path.join(OUT_DIR, `story_${p.num}.png`);
    const pngBuf = createPng(1024, 1024, p.color1, p.color2);
    fs.writeFileSync(filePath, pngBuf);
    console.log(`✔ Generated story_${p.num}.png (${(pngBuf.length / 1024).toFixed(1)} kB) - ${p.title}`);
  });

  console.log('✨ All 6 story illustrations created successfully!');
}

generateAllArt();
