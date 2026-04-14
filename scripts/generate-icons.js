/**
 * generate-icons.js  –  StudyLane Icon Generator
 *
 * Generates every icon size needed for Desktop (Windows .ico, macOS .icns),
 * Android (adaptive + legacy mipmap PNGs) and iOS (AppIcon.appiconset).
 *
 * Prerequisites:
 *   npm install --save-dev sharp to-ico png2icons
 *
 * Usage:
 *   node scripts/generate-icons.js
 *
 * Android output  →  assets/android/   (copy to android/app/src/main/res/)
 * iOS output      →  assets/ios/        (copy to ios/App/App/Assets.xcassets/)
 * Desktop output  →  assets/           (icon.ico · icon.icns · icon-*.png)
 */

'use strict';

const sharp     = require('sharp');
const toIco     = require('to-ico');
const pngToIcoMod = require('png-to-ico');
const pngToIco  = (typeof pngToIcoMod === 'function') ? pngToIcoMod : (pngToIcoMod.default || pngToIcoMod.imagesToIco);
const png2icons = require('png2icons');
const fs        = require('fs');
const path      = require('path');

const ROOT    = path.resolve(__dirname, '..');
const ASSETS  = path.join(ROOT, 'assets');
const SRC     = path.join(ROOT, 'Studylane.png');          // new logo PNG
const SRC_FG  = path.join(ROOT, 'Studylane.png');          // foreground (same source)
const SRC_MSK = path.join(ROOT, 'Studylane.png');          // maskable (same source)

// ── util ────────────────────────────────────────────────────────────────────

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }

async function pngBuf(src, size) {
  return sharp(src).resize(size, size).png().toBuffer();
}

// ICO frames: per-size flatten (ClipFlow approach)
async function pngBufFlat(src, size, bg) {
  return sharp(src)
    .resize(size, size)
    .flatten({ background: bg || '#ffffff' })
    .png()
    .toBuffer();
}

async function writePng(src, size, dest) {
  await sharp(src).resize(size, size).png().toFile(dest);
  console.log(`  ✓  ${path.relative(ROOT, dest)}`);
}

// ── 1. Web / PWA PNGs ───────────────────────────────────────────────────────

async function buildWeb() {
  console.log('\n── Web / PWA icons ─────────────────────────────────────────');
  for (const s of [16, 32, 48, 64, 128, 192, 256, 512]) {
    await writePng(SRC, s, path.join(ASSETS, `icon-${s}.png`));
  }
  // maskable variant (192 + 512)
  for (const s of [192, 512]) {
    await writePng(SRC_MSK, s, path.join(ASSETS, `icon-maskable-${s}.png`));
  }
}

// ── 2. Windows .ico (png-to-ico via temp files, ClipFlow build-ico approach) ─

async function buildIco() {
  console.log('\n── Windows .ico  (16 · 24 · 32 · 48 · 64 · 128 · 256) ─────');
  const SIZES    = [16, 24, 32, 48, 64, 128, 256];
  const TEMP_DIR = path.join(ASSETS, '_tmp_ico');
  ensureDir(TEMP_DIR);

  const tempFiles = [];
  for (const s of SIZES) {
    const out = path.join(TEMP_DIR, `icon-${s}.png`);
    await sharp(SRC).resize(s, s).png().toFile(out);
    tempFiles.push(out);
    console.log(`  · ${s}×${s}`);
  }

  const ico  = await pngToIco(tempFiles);
  const dest = path.join(ASSETS, 'icon.ico');
  fs.writeFileSync(dest, ico);

  for (const f of tempFiles) fs.unlinkSync(f);
  fs.rmdirSync(TEMP_DIR, { recursive: true });

  console.log(`  ✓  ${path.relative(ROOT, dest)}`);
}

// ── 3. macOS .icns (cross-platform via png2icons) ───────────────────────────

async function buildIcns() {
  console.log('\n── macOS .icns ─────────────────────────────────────────────');
  const buf  = await pngBuf(SRC, 1024);
  const icns = png2icons.createICNS(buf, png2icons.BILINEAR, 0);
  if (!icns) { console.warn('  ⚠  ICNS generation failed – skipped'); return; }
  const dest = path.join(ASSETS, 'icon.icns');
  fs.writeFileSync(dest, icns);
  console.log(`  ✓  ${path.relative(ROOT, dest)}`);
}

// ── 4. Android ──────────────────────────────────────────────────────────────
//
//  Legacy launcher icon   →  ic_launcher.png         (round + square)
//  Adaptive foreground    →  ic_launcher_foreground.png
//  Adaptive icon XML      →  mipmap-anydpi-v26/ic_launcher[_round].xml
//  Background colour XML  →  values/ic_launcher_background.xml
//
async function buildAndroid() {
  console.log('\n── Android icons ───────────────────────────────────────────');

  const densities = [
    { dir: 'mipmap-mdpi',    px: 48,  fgPx: 108 },
    { dir: 'mipmap-hdpi',    px: 72,  fgPx: 162 },
    { dir: 'mipmap-xhdpi',   px: 96,  fgPx: 216 },
    { dir: 'mipmap-xxhdpi',  px: 144, fgPx: 324 },
    { dir: 'mipmap-xxxhdpi', px: 192, fgPx: 432 },
  ];

  const STAGING  = path.join(ASSETS, 'android');
  // If cap add android has been run, write directly into the project too
  const RES_DIR  = path.join(ROOT, 'android', 'app', 'src', 'main', 'res');
  const INTO_PRJ = fs.existsSync(RES_DIR);

  async function writeToDir(baseDir) {
    for (const d of densities) {
      const dir = path.join(baseDir, d.dir);
      ensureDir(dir);
      await writePng(SRC,    d.px,   path.join(dir, 'ic_launcher.png'));
      await writePng(SRC,    d.px,   path.join(dir, 'ic_launcher_round.png'));
      await writePng(SRC_FG, d.fgPx, path.join(dir, 'ic_launcher_foreground.png'));
    }

    // Adaptive icon XML (API 26+)
    const anydpi = path.join(baseDir, 'mipmap-anydpi-v26');
    ensureDir(anydpi);
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`;
    fs.writeFileSync(path.join(anydpi, 'ic_launcher.xml'),       xml);
    fs.writeFileSync(path.join(anydpi, 'ic_launcher_round.xml'), xml);

    // Background colour resource
    const values = path.join(baseDir, 'values');
    ensureDir(values);
    fs.writeFileSync(
      path.join(values, 'ic_launcher_background.xml'),
      `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#1E1E2E</color>\n</resources>\n`
    );
  }

  // Always write to staging area
  await writeToDir(STAGING);
  console.log(`\n  Staged → assets/android/`);

  // Also write into the Capacitor Android project if it exists
  if (INTO_PRJ) {
    await writeToDir(RES_DIR);
    console.log(`  Written → android/app/src/main/res/`);
  } else {
    console.log(`  (Run 'npx cap add android' then re-run this script to auto-copy into the project)`);
  }

  // Play Store high-res icon
  await writePng(SRC, 512, path.join(STAGING, 'play_store_512.png'));
}

// ── 5. iOS AppIcon ──────────────────────────────────────────────────────────

async function buildIOS() {
  console.log('\n── iOS icons ───────────────────────────────────────────────');

  const OUT = path.join(ASSETS, 'ios', 'AppIcon.appiconset');
  ensureDir(OUT);

  // [size-pts, scale, idiom]
  const specs = [
    [20,   1, 'iphone'],  [20,   2, 'iphone'],  [20,   3, 'iphone'],
    [29,   1, 'iphone'],  [29,   2, 'iphone'],  [29,   3, 'iphone'],
    [40,   1, 'iphone'],  [40,   2, 'iphone'],  [40,   3, 'iphone'],
    [60,   2, 'iphone'],  [60,   3, 'iphone'],
    [20,   1, 'ipad'],    [20,   2, 'ipad'],
    [29,   1, 'ipad'],    [29,   2, 'ipad'],
    [40,   1, 'ipad'],    [40,   2, 'ipad'],
    [76,   1, 'ipad'],    [76,   2, 'ipad'],
    [83.5, 2, 'ipad'],
    [1024, 1, 'ios-marketing'],
  ];

  const generated = new Set();
  const images    = [];

  for (const [pts, scale, idiom] of specs) {
    const px       = Math.round(pts * scale);
    const filename = `Icon-${pts}@${scale}x.png`;

    if (!generated.has(filename)) {
      // iOS clips the icon itself – use full icon (including rounded background)
      await writePng(SRC, px, path.join(OUT, filename));
      generated.add(filename);
    }

    images.push({ filename, idiom, scale: `${scale}x`, size: `${pts}x${pts}` });
  }

  // Contents.json required by Xcode
  fs.writeFileSync(
    path.join(OUT, 'Contents.json'),
    JSON.stringify({ images, info: { author: 'xcode', version: 1 } }, null, 2)
  );
  console.log(`  ✓  assets/ios/AppIcon.appiconset/Contents.json`);
  console.log(`\n  Staged → assets/ios/`);
  console.log(`  (Run 'npx cap add ios' then copy AppIcon.appiconset to`);
  console.log(`   ios/App/App/Assets.xcassets/AppIcon.appiconset/)`);
}

// ── main ────────────────────────────────────────────────────────────────────

(async () => {
  console.log('StudyLane – Icon Generator\n');
  console.log('Sources:');
  console.log(`  Full icon   : ${path.relative(ROOT, SRC)}`);
  console.log(`  Foreground  : ${path.relative(ROOT, SRC_FG)}`);
  console.log(`  Maskable    : ${path.relative(ROOT, SRC_MSK)}`);

  for (const src of [SRC, SRC_FG, SRC_MSK]) {
    if (!fs.existsSync(src)) {
      console.error(`\nError: missing source file ${src}`);
      process.exit(1);
    }
  }

  await buildWeb();
  await buildIco();
  await buildIcns();
  await buildAndroid();
  await buildIOS();

  console.log('\n✓  All icons generated.\n');
})().catch(err => {
  console.error('\nFatal:', err.message);
  process.exit(1);
});
