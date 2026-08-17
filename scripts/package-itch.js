import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function packageDist() {
  const distDir = path.resolve('dist');
  if (!fs.existsSync(distDir)) {
    console.error('dist directory does not exist! Run npm run build first.');
    process.exit(1);
  }

  const zip = new JSZip();

  function addFiles(currentDir, rootDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const relativePath = path.relative(rootDir, fullPath);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        addFiles(fullPath, rootDir);
      } else {
        const data = fs.readFileSync(fullPath);
        zip.file(relativePath, data);
      }
    }
  }

  addFiles(distDir, distDir);

  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'arrow-puzzle-itchio.zip');
  fs.writeFileSync(outputPath, content);
  console.log('Successfully created:', outputPath, `(${Math.round(content.length / 1024)} KB)`);
}

packageDist().catch(console.error);
