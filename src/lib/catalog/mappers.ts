import type { Prisma } from "@prisma/client";
import type { Product, Category } from "@/types";
import { parseBenefitsJson, resolveProductBenefits } from "@/lib/product-benefits";
import {
  products as staticProducts,
  categories as staticCategories,
} from "@/constants/products";

type DbProduct = Prisma.ProductGetPayload<{
  include: { category: true; images: true };
}>;

export function mapDbProduct(product: DbProduct): Product {
  const weightValue = product.weight ? Number(product.weight) : undefined;
  const weight =
    weightValue !== undefined
      ? `${weightValue}${product.weightUnit ? ` ${product.weightUnit}` : ""}`
      : undefined;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDesc: product.shortDesc ?? "",
    longDesc: product.longDesc ?? "",
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : undefined,
    mainImage: product.mainImage ?? "/products/sal-de-maras.png",
    category: product.category.name,
    categorySlug: product.category.slug,
    tags: product.tags,
    weight,
    origin: product.origin ?? undefined,
    brand: product.brand ?? undefined,
    brandLogo: product.brandLogo ?? undefined,
    highlights: product.highlights,
    sku: product.sku,
    stock: product.stock,
    benefits: resolveProductBenefits(
      parseBenefitsJson(product.benefits),
      product.highlights,
      product.shortDesc
    ),
    uses: product.uses,
    nutritionalInfo: product.nutritionalInfo,
    isFeatured: product.isFeatured,
    sortOrder: product.sortOrder,
    status: product.status,
    blockPurchaseWhenOutOfStock: product.blockPurchaseWhenOutOfStock,
    images: product.images
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((image) => ({
        id: image.id,
        url: image.url,
        alt: image.alt ?? undefined,
        sortOrder: image.sortOrder,
      })),
  };
}

export function mapDbCategory(category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  status: string;
}): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    image: category.image ?? "/products/sal-de-maras.png",
    sortOrder: category.sortOrder,
    status: category.status as Category["status"],
  };
}

export function getInventoryStatus(stock: number, lowThreshold = 10) {
  if (stock <= 0) return "Agotado" as const;
  if (stock <= lowThreshold) return "Bajo stock" as const;
  return "Disponible" as const;
}

export { staticProducts, staticCategories };
