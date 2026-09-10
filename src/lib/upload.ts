import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp, { type Metadata } from "sharp";
import { randomUUID } from "node:crypto";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/x-png",
  "image/webp",
]);

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const ALLOWED_SHARP_FORMATS = new Set(["jpeg", "png", "webp"]);

const MAX_SIZE = 5 * 1024 * 1024;

function getExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

function isAllowedMimeType(type: string): boolean {
  return ALLOWED_MIME_TYPES.has(type.toLowerCase());
}

function isAllowedExtension(filename: string): boolean {
  return ALLOWED_EXTENSIONS.has(getExtension(filename));
}

export async function saveUploadedImage(file: File): Promise<string> {
  if (file.size > MAX_SIZE) {
    throw new Error("La imagen no puede superar 5 MB.");
  }

  const mimeType = file.type.trim().toLowerCase();
  const hasAllowedMime = mimeType !== "" && isAllowedMimeType(mimeType);
  const hasAllowedExtension = isAllowedExtension(file.name);

  if (!hasAllowedMime && !hasAllowedExtension) {
    throw new Error("Formato no permitido. Usa JPG, PNG o WebP.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let metadata: Metadata;
  try {
    metadata = await sharp(buffer).metadata();
  } catch {
    throw new Error("No se pudo leer la imagen. Verifica que el archivo sea válido.");
  }

  if (!metadata.format || !ALLOWED_SHARP_FORMATS.has(metadata.format)) {
    throw new Error("Formato no permitido. Usa JPG, PNG o WebP.");
  }

  const optimized = await sharp(buffer)
    .rotate()
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const filename = `${randomUUID()}.webp`;
  const filepath = path.join(uploadsDir, filename);
  await writeFile(filepath, optimized);

  return `/uploads/${filename}`;
}
