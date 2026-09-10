import sharp from "sharp";
import path from "node:path";

const root = process.cwd();
const sources = [
  path.join(root, "scripts/source-logo-alt.png"),
  path.join(root, "scripts/source-logo.png"),
  path.join(root, "public/brand/logo-dulce-vida-light.png"),
];

async function removeLightBackground(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = data;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const isWhite = r > 235 && g > 235 && b > 235;
    const isCream = r > 230 && g > 225 && b > 210 && r - b < 30;
    const isLightGray = r > 220 && g > 220 && b > 220 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15;

    if (isWhite || isCream || isLightGray) {
      pixels[i + 3] = 0;
    }
  }

  return sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .trim({ threshold: 10 })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  let output = null;

  for (const source of sources) {
    try {
      output = await removeLightBackground(source);
      console.log(`Processed logo from ${path.basename(source)}`);
      break;
    } catch {
      // try next source
    }
  }

  if (!output) {
    throw new Error("No logo source could be processed.");
  }

  const target = path.join(root, "public/brand/logo-dulce-vida.png");
  await sharp(output).toFile(target);

  const meta = await sharp(target).metadata();
  console.log(`Saved transparent logo ${meta.width}x${meta.height}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
