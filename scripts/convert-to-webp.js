const sharp = require('sharp');
const fs = require('fs');

const images = [
  { in: 'public/og-image_1200x630.png', out: 'public/og-image_1200x630.webp', width: 1200 },
  { in: 'public/og-image_1200x675.png', out: 'public/og-image_1200x675.webp', width: 1200 },
  { in: 'public/og-image_2400.png', out: 'public/og-image_2400.webp', width: 2400 },
];

(async () => {
  for (const img of images) {
    if (!fs.existsSync(img.in)) {
      console.error('Missing input file:', img.in);
      continue;
    }
    try {
      await sharp(img.in)
        .webp({ quality: 82, effort: 6 })
        .toFile(img.out);
      console.log('Converted', img.in, '→', img.out);
    } catch (err) {
      console.error('Error converting', img.in, err);
    }
  }
})();