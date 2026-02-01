/* Export mockup SVGs to PNG (1x, 2x, 4x)
   Usage: npm run export:mockups
   Requires: npm install --save-dev sharp
*/
const fs = require('fs').promises;
const path = require('path');

async function ensureDir(dir) {
  try { await fs.mkdir(dir, { recursive: true }); } catch(e){}
}

async function run() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('Missing dependency: sharp. Please run `npm install --save-dev sharp` and try again.');
    process.exit(1);
  }

  const inputs = [
    { src: 'assets/mockups/sovereign-dashboard.svg', base: 'sovereign-dashboard' },
    { src: 'assets/mockups/orion-domain.svg', base: 'orion-domain' },
    { src: 'assets/mockups/vesta-hearth.svg', base: 'vesta-hearth' }
  ];

  const outputsDir = path.join('assets','exports');
  await ensureDir(outputsDir);

  const sizes = [
    { name: '1x', width: 1280 },
    { name: '2x', width: 2560 },
    { name: '4x', width: 3840 }
  ];

  for (const file of inputs) {
    try {
      const svg = await fs.readFile(file.src);
      for (const s of sizes) {
        const out = path.join(outputsDir, `${file.base}-${s.name}.png`);
        await sharp(svg)
          .resize({ width: s.width })
          .png({ quality: 90 })
          .toFile(out);
        console.log('Wrote', out);
      }
    } catch (e) {
      console.error('Error processing', file.src, e.message);
    }
  }
}

run().catch(e => { console.error(e); process.exit(1); });
