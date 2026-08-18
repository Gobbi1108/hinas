// Converte as fotos de assets/prof para WebP, redimensionando para o tamanho
// que o card realmente usa (280x350 CSS px -> 2x retina = 560x700; alvo 640x800).
// Os originais vao para chest/prof-originais/ (chest nao sobe pro servidor).
//
//   node scripts/webp-prof.js          -> converte
//   node scripts/webp-prof.js --dry    -> so mostra o que faria
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'assets', 'prof');
const CHEST = path.join(ROOT, 'chest', 'prof-originais');
const DRY = process.argv.includes('--dry');

const QUALITY = 82;
const BOX = { width: 640, height: 800 };

const kb = (n) => (n / 1024).toFixed(0) + 'K';

(async () => {
  const files = fs.readdirSync(SRC).filter((f) => /\.(png|jpe?g)$/i.test(f));
  if (!files.length) return console.log('nada para converter em assets/prof');

  if (!DRY) fs.mkdirSync(CHEST, { recursive: true });

  let antes = 0;
  let depois = 0;

  for (const file of files) {
    const src = path.join(SRC, file);
    const out = path.join(SRC, file.replace(/\.(png|jpe?g)$/i, '.webp'));
    const orig = fs.statSync(src).size;
    const meta = await sharp(src).metadata();

    const buf = await sharp(src)
      .resize({ ...BOX, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();

    antes += orig;
    depois += buf.length;

    const novo = await sharp(buf).metadata();
    const dim = `${meta.width}x${meta.height} -> ${novo.width}x${novo.height}`;
    console.log(
      `${path.basename(out).padEnd(42)} ${kb(orig).padStart(6)} -> ${kb(buf.length).padStart(6)}  ${dim}`
    );

    if (DRY) continue;
    fs.writeFileSync(out, buf);
    fs.renameSync(src, path.join(CHEST, file)); // original vai pro chest
  }

  console.log(`\ntotal: ${kb(antes)} -> ${kb(depois)}  (-${(100 - (depois / antes) * 100).toFixed(0)}%)`);
  if (DRY) console.log('(--dry: nada escrito)');
  else console.log(`originais movidos para chest/prof-originais/`);
})();
