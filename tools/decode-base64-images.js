const fs = require('fs');
const path = require('path');

const assetsFolder = path.resolve(__dirname, '../assets/images/drawer');

fs.readdirSync(assetsFolder).forEach(file => {
  if (file.endsWith('.b64')) {
    const b64 = fs.readFileSync(path.join(assetsFolder, file), 'utf8').trim();
    const outName = file.replace('.b64', '');
    const outPath = path.join(assetsFolder, outName);
    const buffer = Buffer.from(b64, 'base64');
    fs.writeFileSync(outPath, buffer);
    console.log('Wrote', outPath);
  }
});
console.log('Done');
