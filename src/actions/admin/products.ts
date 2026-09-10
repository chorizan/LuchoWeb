"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { ProductStatus } from "@prisma/client";
import { z } from "zod";
import { benefitsToPrismaJson, parseBenefitsText } from "@/lib/product-benefits";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
  categoryId: z.string().min(1),
  shortDesc: z.string().optional(),
  longDesc: z.string().optional(),
  price: z.coerce.number().positive(),
  salePrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  weight: z.coerce.number().positive().optional().nullable(),
  weightUnit: z.string().optional(),
  origin: z.string().optional(),
  brand: z.string().optional(),
  brandLogo: z.string().optional(),
  mainImage: z.string().optional(),
  tags: z.string().optional(),
  highlights: z.string().optional(),
  benefits: z.string().optional(),
  uses: z.string().optional(),
  nutritionalInfo: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  blockPurchaseWhenOutOfStock: z.coerce.boolean().optional(),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function splitLines(value?: string | null) {
  return value
    ? value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function splitComma(value?: string | null) {
  return value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function parseOptionalNumber(value: FormDataEntryValue | null) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseProductFormData(formData: FormData) {
  const mainImage = String(formData.get("mainImage") ?? "").trim();
  const brandLogo = String(formData.get("brandLogo") ?? "").trim();

  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    sku: formData.get("sku"),
    categoryId: formData.get("categoryId"),
    shortDesc: formData.get("shortDesc") || undefined,
    longDesc: formData.get("longDesc") || undefined,
    price: formData.get("price"),
    salePrice: parseOptionalNumber(formData.get("salePrice")),
    stock: formData.get("stock"),
    weight: parseOptionalNumber(formData.get("weight")),
    weightUnit: formData.get("weightUnit") || "kg",
    origin: formData.get("origin") || undefined,
    brand: formData.get("brand") || undefined,
    brandLogo: brandLogo || undefined,
    mainImage: mainImage || undefined,
    tags: formData.get("tags") || "",
    highlights: formData.get("highlights") || "",
    benefits: formData.get("benefits") || "",
    uses: formData.get("uses") || "",
    nutritionalInfo: formData.get("nutritionalInfo") || "",
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: formData.get("sortOrder") || 0,
    status: formData.get("status") || "DRAFT",
    blockPurchaseWhenOutOfStock: formData.get("blockPurchaseWhenOutOfStock") === "on",
  };
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();

  const parsed = productSchema.safeParse({
    ...parseProductFormData(formData),
    slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
  });

  if (!parsed.success) {
    return { error: "Datos inválidos. Revisa nombre, slug, SKU y precio." };
  }

  try {
    const benefits = parseBenefitsText(parsed.data.benefits);
    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        sku: parsed.data.sku,
        categoryId: parsed.data.categoryId,
        shortDesc: parsed.data.shortDesc,
        longDesc: parsed.data.longDesc,
        price: parsed.data.price,
        salePrice: parsed.data.salePrice ?? null,
        stock: parsed.data.stock,
        weight: parsed.data.weight ?? null,
        weightUnit: parsed.data.weightUnit,
        origin: parsed.data.origin,
        brand: parsed.data.brand,
        brandLogo: parsed.data.brandLogo ?? null,
        mainImage: parsed.data.mainImage ?? null,
        tags: splitComma(parsed.data.tags),
        highlights: splitComma(parsed.data.highlights),
        benefits: benefits.length > 0 ? benefitsToPrismaJson(benefits) : undefined,
        uses: splitLines(parsed.data.uses),
        nutritionalInfo: splitLines(parsed.data.nutritionalInfo),
        isFeatured: parsed.data.isFeatured ?? false,
        sortOrder: parsed.data.sortOrder,
        status: parsed.data.status as ProductStatus,
        blockPurchaseWhenOutOfStock: parsed.data.blockPurchaseWhenOutOfStock ?? true,
      },
    });

    revalidatePath("/admin/productos");
    revalidatePath("/admin/inventario");
    revalidatePath("/productos");
    revalidatePath(`/productos/${product.slug}`);
    return { success: true, id: product.id };
  } catch {
    return { error: "No se pudo crear el producto. Verifica que slug y SKU sean únicos." };
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = productSchema.safeParse(parseProductFormData(formData));

  if (!parsed.success) {
    return { error: "Datos inválidos. Revisa nombre, slug, SKU y precio." };
  }

  try {
    const benefits = parseBenefitsText(parsed.data.benefits);
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        sku: parsed.data.sku,
        categoryId: parsed.data.categoryId,
        shortDesc: parsed.data.shortDesc,
        longDesc: parsed.data.longDesc,
        price: parsed.data.price,
        salePrice: parsed.data.salePrice ?? null,
        stock: parsed.data.stock,
        weight: parsed.data.weight ?? null,
        weightUnit: parsed.data.weightUnit,
        origin: parsed.data.origin,
        brand: parsed.data.brand,
        brandLogo: parsed.data.brandLogo ?? null,
        mainImage: parsed.data.mainImage ?? null,
        tags: splitComma(parsed.data.tags),
        highlights: splitComma(parsed.data.highlights),
        benefits: benefits.length > 0 ? benefitsToPrismaJson(benefits) : [],
        uses: splitLines(parsed.data.uses),
        nutritionalInfo: splitLines(parsed.data.nutritionalInfo),
        isFeatured: parsed.data.isFeatured ?? false,
        sortOrder: parsed.data.sortOrder,
        status: parsed.data.status as ProductStatus,
        blockPurchaseWhenOutOfStock: parsed.data.blockPurchaseWhenOutOfStock ?? true,
      },
    });

    revalidatePath("/admin/productos");
    revalidatePath(`/admin/productos/${id}`);
    revalidatePath("/admin/inventario");
    revalidatePath("/productos");
    revalidatePath(`/productos/${product.slug}`);
    return { success: true };
  } catch {
    return { error: "No se pudo guardar el producto. Verifica que slug y SKU sean únicos." };
  }
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/productos");
  revalidatePath("/admin/inventario");
  revalidatePath("/productos");
}

export async function toggleProductStatusAction(id: string) {
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  const nextStatus =
    product.status === ProductStatus.PUBLISHED
      ? ProductStatus.DRAFT
      : ProductStatus.PUBLISHED;

  await prisma.product.update({
    where: { id },
    data: { status: nextStatus },
  });

  revalidatePath("/admin/productos");
  revalidatePath("/productos");
}

export async function updateStockAction(id: string, stock: number) {
  await requireAdmin();
  await prisma.product.update({
    where: { id },
    data: { stock: Math.max(0, stock) },
  });
  revalidatePath("/admin/inventario");
  revalidatePath("/productos");
}
