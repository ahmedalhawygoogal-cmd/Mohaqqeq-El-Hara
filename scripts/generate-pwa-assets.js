import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Write the main SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#2a201a"/>
      <stop offset="55%" stop-color="#151210"/>
      <stop offset="100%" stop-color="#0a0807"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="lensGrad" x1="20%" y1="20%" x2="80%" y2="80%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35"/>
      <stop offset="40%" stop-color="#fbbf24" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#1e1b18" stop-opacity="0.8"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="104" fill="url(#bgGrad)"/>
  
  <!-- Outer Decorative Noir Border -->
  <rect x="24" y="24" width="464" height="464" rx="84" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-opacity="0.4"/>
  <rect x="36" y="36" width="440" height="440" rx="72" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="8 6" stroke-opacity="0.6"/>

  <!-- Vintage Egyptian Cairo Street Lamp Beam -->
  <path d="M256 60 L140 380 L372 380 Z" fill="#f59e0b" opacity="0.06"/>

  <!-- Detective Hat / Cairo Silhouette -->
  <path d="M196 160 C216 135 296 135 316 160 C336 175 365 178 375 186 C380 190 350 196 256 196 C162 196 132 190 137 186 C147 178 176 175 196 160 Z" fill="#d97706" opacity="0.75"/>
  <path d="M205 160 C220 145 292 145 307 160 L315 182 L197 182 Z" fill="#92400e" opacity="0.9"/>
  <rect x="200" y="176" width="112" height="6" fill="#f59e0b" opacity="0.9"/>

  <!-- Magnifying Glass (Main Icon Focus) -->
  <g transform="translate(10, 20)">
    <!-- Shadow -->
    <circle cx="240" cy="250" r="105" fill="#000000" opacity="0.5"/>
    
    <!-- Handle -->
    <path d="M315 325 L395 405 C404 414 404 428 395 437 C386 446 372 446 363 437 L283 357 Z" fill="url(#goldGrad)" filter="url(#glow)"/>
    <path d="M322 332 L388 398" stroke="#fef3c7" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
    
    <!-- Outer Ring -->
    <circle cx="236" cy="246" r="106" fill="none" stroke="url(#goldGrad)" stroke-width="18" filter="url(#glow)"/>
    <circle cx="236" cy="246" r="106" fill="none" stroke="#fef3c7" stroke-width="2" opacity="0.5"/>
    <circle cx="236" cy="246" r="97" fill="url(#lensGrad)"/>

    <!-- Fingerprint / Cairo Alley Map inside Lens -->
    <path d="M236 186 C210 186 188 208 188 236 C188 250 194 262 204 270" fill="none" stroke="#f59e0b" stroke-width="4.5" stroke-linecap="round" opacity="0.85"/>
    <path d="M236 200 C218 200 202 216 202 236 C202 268 220 286 236 298 C252 286 270 268 270 236" fill="none" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
    <path d="M236 216 C226 216 216 226 216 238 C216 256 230 268 236 274 C242 268 256 256 256 238 C256 226 246 216 236 216 Z" fill="none" stroke="#fbbf24" stroke-width="3.5" stroke-linecap="round" opacity="0.95"/>
    
    <!-- Lens Light Reflection -->
    <path d="M165 210 A85 85 0 0 1 230 165" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.6"/>
  </g>

  <!-- Mystery Clue Stars -->
  <polygon points="120,120 123,128 131,131 123,134 120,142 117,134 109,131 117,128" fill="#fbbf24" opacity="0.85"/>
  <polygon points="390,110 392,116 398,118 392,120 390,126 388,120 382,118 388,116" fill="#fbbf24" opacity="0.7"/>

  <!-- Arabic Typography Subtext -->
  <text x="256" y="475" text-anchor="middle" font-family="'Cairo', sans-serif" font-weight="800" font-size="28" fill="#e6c894" letter-spacing="1">محقق الحارة</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent.trim());
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent.trim());
console.log('Created icon.svg and favicon.svg');

// CRC32 table & helper for PNG generator
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[i] = c >>> 0;
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function createPngChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

/**
 * Creates a valid, beautiful PNG image buffer
 * @param {number} size - width & height
 * @param {boolean} isMaskable - if true, content has 15% safe zone margin
 */
function generateDetectivePng(size, isMaskable = false) {
  const width = size;
  const height = size;
  // Raw uncompressed RGBA pixel buffer with filter byte (0) per row
  const rowStride = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowStride);

  const cx = width / 2;
  const cy = height / 2;
  const safeRadius = (isMaskable ? 0.38 : 0.46) * size;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    rawData[rowOffset] = 0; // Filter byte 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default dark noir background gradient
      const normY = y / height;
      let r = Math.round(18 + 14 * (1 - normY));
      let g = Math.round(14 + 8 * (1 - normY));
      let b = Math.round(12 + 6 * (1 - normY));
      let a = 255;

      // Outer gold decorative circle
      const outerRingWidth = Math.max(2, size * 0.015);
      if (Math.abs(dist - safeRadius) < outerRingWidth) {
        // Gold amber ring
        r = 217; g = 119; b = 6;
      } else if (dist < safeRadius) {
        // Inside vignette
        const innerRatio = dist / safeRadius;
        r = Math.round(24 + 18 * (1 - innerRatio));
        g = Math.round(18 + 12 * (1 - innerRatio));
        b = Math.round(15 + 8 * (1 - innerRatio));

        // Magnifying glass lens center slightly offset
        const lensCx = cx - (isMaskable ? 0 : size * 0.03);
        const lensCy = cy - (isMaskable ? 0 : size * 0.03);
        const lensDx = x - lensCx;
        const lensDy = y - lensCy;
        const lensDist = Math.sqrt(lensDx * lensDx + lensDy * lensDy);
        const lensRadius = safeRadius * 0.58;

        // Lens rim
        const rimWidth = Math.max(3, size * 0.035);
        if (Math.abs(lensDist - lensRadius) < rimWidth) {
          // Brilliant gold / amber
          const highlight = (lensDx + lensDy < 0) ? 35 : 0;
          r = Math.min(255, 245 + highlight);
          g = Math.min(255, 158 + highlight);
          b = Math.min(255, 11 + highlight);
        } else if (lensDist < lensRadius) {
          // Lens glass with amber tint & light reflection
          const glassGlow = Math.max(0, 1 - (lensDist / lensRadius));
          r = Math.round(45 + 110 * glassGlow);
          g = Math.round(35 + 85 * glassGlow);
          b = Math.round(25 + 30 * glassGlow);

          // Fingerprint rings inside lens
          const fpDist = Math.sqrt((x - lensCx) ** 2 + (y - lensCy) ** 2);
          const fpPeriod = size * 0.045;
          if (fpDist > size * 0.04 && fpDist < lensRadius * 0.85) {
            const wave = Math.sin((fpDist / fpPeriod) * Math.PI * 2);
            if (wave > 0.4) {
              r = Math.min(255, r + 70);
              g = Math.min(255, g + 50);
              b = Math.min(255, b + 10);
            }
          }
          // Lens reflection arc
          if (lensDx < 0 && lensDy < 0 && Math.abs(lensDist - lensRadius * 0.75) < size * 0.02) {
            r = 255; g = 250; b = 230;
          }
        }

        // Magnifying glass handle
        const handleAngle = Math.PI / 4; // 45 deg down-right
        const projLen = (x - lensCx) * Math.cos(handleAngle) + (y - lensCy) * Math.sin(handleAngle);
        const perpDist = Math.abs(-(x - lensCx) * Math.sin(handleAngle) + (y - lensCy) * Math.cos(handleAngle));
        if (projLen >= lensRadius && projLen <= safeRadius * 1.15 && perpDist < size * 0.028) {
          r = 180; g = 83; b = 9;
          if (perpDist < size * 0.012) {
            r = 245; g = 158; b = 11;
          }
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // PNG Header
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk: 13 bytes
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: 6 (RGBA)
  ihdrData[10] = 0; // Compression: deflate
  ihdrData[11] = 0; // Filter: 0 (standard)
  ihdrData[12] = 0; // Interlace: 0 (none)
  const ihdrChunk = createPngChunk('IHDR', ihdrData);

  // IDAT chunk: compressed raw data
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createPngChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createPngChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate PNG assets
const pwa192 = generateDetectivePng(192, false);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);

const pwa512 = generateDetectivePng(512, false);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);

const pwaMaskable512 = generateDetectivePng(512, true);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pwaMaskable512);

const appleTouchIcon = generateDetectivePng(180, false);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIcon);

// Create favicon.ico (matching 192x192 PNG or icon)
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), pwa192);

console.log('Successfully generated all PWA icons (192, 512, maskable-512, apple-touch 180, favicon).');
