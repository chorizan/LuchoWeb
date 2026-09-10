import { prisma } from "@/lib/prisma";
import {
  mapDbProduct,
  mapDbCategory,
  staticProducts,
  staticCategories,
} from "@/lib/catalog/mappers";
import type { Product, Category } from "@/types";
import { ProductStatus, CategoryStatus } from "@prisma/client";

const productInclude = {
  category: true,
  images: { orderBy: { sortOrder: "asc" as const } },
};

async function isDatabaseAvailable() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function getPublishedProducts(): Promise<Product[]> {
  if (!(await isDatabaseAvailable())) return staticProducts;

  try {
    const rows = await prisma.product.findMany({
      where: { status: ProductStatus.PUBLISHED },
      include: productInclude,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    if (rows.length === 0) return staticProducts;
    return rows.map(mapDbProduct);
  } catch {
    return staticProducts;
  }
}

export async function getAllProductsAdmin() {
  await prisma.product.findMany({
    include: productInclude,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!(await isDatabaseAvailable())) {
    return staticProducts.find((p) => p.slug === slug);
  }

  try {
    const product = await prisma.product.findFirst({
      where: { slug, status: ProductStatus.PUBLISHED },
      include: productInclude,
    });
    if (!product) {
      return staticProducts.find((p) => p.slug === slug);
    }
    return mapDbProduct(product);
  } catch {
    return staticProducts.find((p) => p.slug === slug);
  }
}

export async function getProductBySlugAdmin(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
}

export async function getProductByIdAdmin(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

export async function getActiveCategories(): Promise<Category[]> {
  if (!(await isDatabaseAvailable())) return staticCategories;

  try {
    const rows = await prisma.category.findMany({
      where: { status: CategoryStatus.ACTIVE },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return staticCategories;
    return rows.map(mapDbCategory);
  } catch {
    return staticCategories;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  if (!(await isDatabaseAvailable())) {
    return staticCategories.find((c) => c.slug === slug);
  }

  try {
    const category = await prisma.category.findFirst({
      where: { slug, status: CategoryStatus.ACTIVE },
    });
    if (!category) return staticCategories.find((c) => c.slug === slug);
    return mapDbCategory(category);
  } catch {
    return staticCategories.find((c) => c.slug === slug);
  }
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const all = await getPublishedProducts();
  return all.filter((p) => p.categorySlug === categorySlug);
}

export async function getPopularProducts(): Promise<Product[]> {
  const all = await getPublishedProducts();
  const featured = all.filter((p) => p.isFeatured);
  if (featured.length > 0) return featured.slice(0, 3);
  return all.slice(0, 3);
}

export async function getRecommendedProducts(): Promise<Product[]> {
  const all = await getPublishedProducts();
  return all.slice(0, 3);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const all = await getPublishedProducts();
  const q = query.toLowerCase().trim();
  if (!q) return all;
  return all.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDesc.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.benefits.some(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      )
  );
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await getPublishedProducts();
  return products.map((p) => p.slug);
}
