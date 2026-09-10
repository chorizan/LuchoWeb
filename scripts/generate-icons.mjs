import sharp from "sharp";
import toIco from "to-ico";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "scripts/source-icon.png");
const outDir = path.join(root, "public/brand/icons");

async function buildSquareIcon(size, paddingRatio = 0.06) {
  const padding = Math.round(size * paddingRatio);

  const trimmed = await sharp(source)
    .trim({ threshold: 12 })
    .toBuffer();

  return sharp(trimmed)
    .resize(size - padding * 2, size - padding * 2, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const sizes = [
    { name: "icon-16.png", size: 16 },
    { name: "icon-32.png", size: 32 },
    { name: "icon-48.png", size: 48 },
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
    { name: "apple-icon.png", size: 180 },
  ];

  for (const { name, size } of sizes) {
    const buffer = await buildSquareIcon(size);
    await writeFile(path.join(outDir, name), buffer);
    console.log(`Generated ${name} (${size}x${size})`);
  }

  const appIcon512 = await buildSquareIcon(512);
  const appApple = await buildSquareIcon(180);

  await writeFile(path.join(root, "src/app/icon.png"), appIcon512);
  await writeFile(path.join(root, "src/app/apple-icon.png"), appApple);
  await writeFile(path.join(root, "public/brand/icon-dulce-vida.png"), appIcon512);

  const icoBuffers = await Promise.all(
    [16, 32, 48].map((s) => buildSquareIcon(s, 0.04))
  );
  const ico = await toIco(icoBuffers);
  await writeFile(path.join(root, "public/favicon.ico"), ico);
  await writeFile(path.join(outDir, "favicon.ico"), ico);

  console.log("Favicon assets ready.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
