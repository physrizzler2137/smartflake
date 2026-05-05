#!/usr/bin/env node
/**
 * SMaRT-Lab Mega.nz Downloader (Node.js)
 * ========================================
 * Downloads all mega.nz images referenced in the website's data files.
 * Uses megajs (already in node_modules from vite-mega-proxy).
 *
 * Usage:
 *   node pictoolkit/download-mega.mjs                # Download all
 *   node pictoolkit/download-mega.mjs --list         # List URLs only
 *   node pictoolkit/download-mega.mjs --category facilities
 */

import { File } from 'megajs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ── Hardcoded manifest of ALL mega.nz images ──────────────────────────────
// This is far more reliable than regex parsing TypeScript.

const MEGA_MANIFEST = [
  // ── Facility panoramas (light + dark variants) ──
  { url: 'https://mega.nz/file/3oh3gRAT#FWDQNUpZL-np90ItswDf7k6anaPs9rEjgs_UFdhx7VE', category: 'facilities', slug: '1-11g_micro-chemistry', variant: 'light', name: 'Micro-chemistry Lab (1.11G) — light' },
  { url: 'https://mega.nz/file/exZ3kZpa#DKisp5qSA7yS4sweH0UCW7DuApumBfG9mMbALhmNtAk', category: 'facilities', slug: '1-11g_micro-chemistry', variant: 'dark', name: 'Micro-chemistry Lab (1.11G) — dark' },
  { url: 'https://mega.nz/file/S8AUUSwD#ChdmjzyYLk2cN10xsXRTK9E9W7FAot1hMUyIFiVbkYw', category: 'facilities', slug: '1-4a_optical-microscopy', variant: 'light', name: 'Optical Microscopy Lab (1.4A) — light' },
  { url: 'https://mega.nz/file/Lo5X3KrB#MdOZa-rsRRXpnHr8Iv_WyQ0Z3LR4K5S-A7ul8jQhkr8', category: 'facilities', slug: '1-4a_optical-microscopy', variant: 'dark', name: 'Optical Microscopy Lab (1.4A) — dark' },
  { url: 'https://mega.nz/file/78w1zR6Y#fWEeDelw2fj1e23zryz0g92yBl_oPr80unRSI6Ad-wo', category: 'facilities', slug: '0-016_fabrication', variant: 'light', name: 'Fabrication Facility (0.016) — light' },
  { url: 'https://mega.nz/file/n4hwDKyQ#LVHp18LWMTEIz-kzbkK_kbXIH9iSJ73JcG80Ty7ja04', category: 'facilities', slug: '0-016_fabrication', variant: 'dark', name: 'Fabrication Facility (0.016) — dark' },

  // ── Equipment: Lab 1.11G ──
  { url: 'https://mega.nz/file/DswRBSCB#Qp6S1A2IQjItIdk6POO-HfASCJSQSoorTD_kXxKvxnc', category: 'equipment', slug: 'corrtest_cs35m', variant: '', name: 'Corrtest CS35M potentiostat/galvanostat' },
  { url: 'https://mega.nz/file/vshwHARL#sZrj8awhgLbVX1IGKmbzz_s9zKE44Eg5OzDjOL-XCYw', category: 'equipment', slug: 'shimadzu_ez-lx', variant: '', name: 'Shimadzu EZ-LX tensile jig' },
  { url: 'https://mega.nz/file/K5AljK5B#BadejAIvGfcWNScL-4m6fm0UuMG7Hjmn23RMeoxWtQE', category: 'equipment', slug: 'dantec_dic', variant: '', name: 'Dantec DIC system' },
  { url: 'https://mega.nz/file/ngxllYQI#MaI0D8LlDtmlLj_3egj0O8uHAKBj83hvKMHUT1CKh38', category: 'equipment', slug: 'rigol_multimeters', variant: '', name: 'Rigol Multimeters' },
  { url: 'https://mega.nz/file/2hAyXJib#uqEetMRxqNPJzoJ_p7TWycjIQXPbRJyFzUV3S6sV9hU', category: 'equipment', slug: 'flir_ax00', variant: '', name: 'FLIR AX00 thermal imaging camera' },

  // ── Equipment: Lab 1.4A ──
  { url: 'https://mega.nz/file/HgxQ2KBS#pmSCF4tOQ68nBWT26Ui4NmsmbiNVaHN4lYsiTLofmIs', category: 'equipment', slug: 'magcam_combi', variant: '', name: 'Magcam Combi scanner' },
  { url: 'https://mega.nz/file/eoJi3TKA#8K0bZs0cUbEFFlTjgVNwhNUyvgSddvbq0djCd1uTZjI', category: 'equipment', slug: 'leica_m205a', variant: '', name: 'Leica M205A stereoscopic microscope' },
  { url: 'https://mega.nz/file/Xl50xaBa#6VddFMrgZtQrsBpMKZ5lJSFjGgnXbn0CQDCeyq29PYo', category: 'equipment', slug: 'zeenko_librevna', variant: '', name: 'ZeenKo LibreVNA' },

  // ── Equipment: Lab 0.016 ──
  { url: 'https://mega.nz/file/XkgATYYB#K_7q_nc-v-IOlTc2djkQcH6DrWBlKP1bJEkAloXKba4', category: 'equipment', slug: 'reise3d_pro2', variant: '', name: 'Reise3D Pro2 Plus 3D printer' },
  { url: 'https://mega.nz/file/fhwTlSjJ#aQsBZ9eHzr19pzgGoDD9JxMSLp6qaRJcIx5hTo27Fb8', category: 'equipment', slug: 'trotec_speedy100', variant: '', name: 'Trotec Laser Speedy 100' },
  { url: 'https://mega.nz/file/a5IXFBya#Np5blFaBRt88xQTW7XADbzu6GPSo1K20c5GTngXrox8', category: 'equipment', slug: 'musashi_im350pc', variant: '', name: 'Musashi IM350PC micro-dispensing' },
  { url: 'https://mega.nz/file/CgB2HJyY#b6rnL7ypg7QywTAzEDXX_1yWIw1qA9Dh8_3rVG6pmCo', category: 'equipment', slug: 'proxxon_micro-milling', variant: '', name: 'Proxxon micro-milling & lathe' },
  { url: 'https://mega.nz/file/2pYGgb5Z#hIdGMn08kS_GJuHTtrPQ6rb9y06GgZLlD-jon79FEC0', category: 'equipment', slug: 'vacuum_bucket', variant: '', name: 'Vacuum bucket' },
  { url: 'https://mega.nz/file/f1oiEbjb#DMvFU0E0z7CMtU3U9cCWGyYOV8T2XPQ7tp_F5l9iiaA', category: 'equipment', slug: 'laboratory_dryer', variant: '', name: 'Laboratory dryer' },
  { url: 'https://mega.nz/file/SkInwDjI#kSTyjIgj8dyj8-dRaN553iuhkkkYgCHqbE1sMTL-gtI', category: 'equipment', slug: 'pneumatics_stand', variant: '', name: 'Pneumatics stand' },
  { url: 'https://mega.nz/file/zh4WBJCI#nnqt16GepAgNxlUFTRO2vI5SZgb4VaWPV7d4I4uFie8', category: 'equipment', slug: 'ultrasonic_cleaners', variant: '', name: 'Ultrasonic cleaners' },
  { url: 'https://mega.nz/file/Lh5VXZYI#9E06Z_GTIzIIBBNqRG2yGupaUSnSpa_hFk1prf3t2ls', category: 'equipment', slug: 'spin_coater', variant: '', name: 'Spin coater' },
];


// ── Download a single file from mega.nz ────────────────────────────────────

async function downloadMegaFile(megaUrl, outputPath) {
  const file = File.fromURL(megaUrl);
  await file.loadAttributes();

  const ext = path.extname(file.name || '').toLowerCase() || '.jpg';
  const finalPath = outputPath + ext;

  if (fs.existsSync(finalPath)) {
    const stats = fs.statSync(finalPath);
    return { path: finalPath, skipped: true, size: stats.size };
  }

  const downloadStream = file.download({});
  const chunks = [];

  return new Promise((resolve, reject) => {
    downloadStream.on('data', chunk => chunks.push(Buffer.from(chunk)));
    downloadStream.on('end', () => {
      const data = Buffer.concat(chunks);
      fs.mkdirSync(path.dirname(finalPath), { recursive: true });
      fs.writeFileSync(finalPath, data);
      resolve({ path: finalPath, skipped: false, size: data.length });
    });
    downloadStream.on('error', reject);
  });
}


// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const listOnly = args.includes('--list');
  const categoryFilter = args.includes('--category') ? args[args.indexOf('--category') + 1] : null;

  console.log('\n📥 SMaRT-Lab Mega.nz Image Downloader');
  console.log(`   Manifest: ${MEGA_MANIFEST.length} images\n`);

  const filtered = categoryFilter
    ? MEGA_MANIFEST.filter(img => img.category === categoryFilter)
    : MEGA_MANIFEST;

  if (listOnly) {
    const byCategory = {};
    for (const img of filtered) {
      (byCategory[img.category] ||= []).push(img);
    }
    for (const [cat, items] of Object.entries(byCategory).sort()) {
      console.log(`  📂 ${cat.toUpperCase()} (${items.length} images)`);
      console.log(`  ${'─'.repeat(60)}`);
      for (const img of items) {
        const variant = img.variant ? ` [${img.variant}]` : '';
        console.log(`    ${img.name}${variant}`);
        console.log(`      ${img.url}`);
      }
      console.log();
    }
    console.log(`  Total: ${filtered.length} unique mega.nz images`);
    return;
  }

  const outputDir = path.join(PROJECT_ROOT, 'pictoolkit', 'mega_downloads');
  console.log(`   Downloading ${filtered.length} images`);
  if (categoryFilter) console.log(`   Filtering to: ${categoryFilter}`);
  console.log(`   Output: ${outputDir}\n`);

  let downloaded = 0, skipped = 0, failed = 0;

  for (let i = 0; i < filtered.length; i++) {
    const img = filtered[i];
    const catDir = path.join(outputDir, img.category);
    const baseName = img.variant ? `${img.slug}_${img.variant}` : img.slug;
    const outputPath = path.join(catDir, baseName);

    process.stdout.write(`  [${i + 1}/${filtered.length}] ${img.name} ... `);

    // Check if already exists with any extension
    fs.mkdirSync(catDir, { recursive: true });
    const existing = fs.readdirSync(catDir).find(f => f.startsWith(baseName + '.'));
    if (existing) {
      const size = fs.statSync(path.join(catDir, existing)).size;
      console.log(`⏭️  exists (${(size / 1024).toFixed(0)} KB)`);
      skipped++;
      continue;
    }

    try {
      const result = await downloadMegaFile(img.url, outputPath);
      if (result.skipped) {
        console.log(`⏭️  exists (${(result.size / 1024).toFixed(0)} KB)`);
        skipped++;
      } else {
        console.log(`✅ ${(result.size / 1024).toFixed(0)} KB → ${path.basename(result.path)}`);
        downloaded++;
      }
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }

    // Brief pause between downloads
    if (i < filtered.length - 1) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log(`\n  📊 Summary: ${downloaded} downloaded, ${skipped} already cached, ${failed} failed`);
  console.log(`  📁 Downloads saved to: ${outputDir}\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
