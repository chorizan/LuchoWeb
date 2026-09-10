import { PrismaClient, UserRole, ProductStatus, CategoryStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { categories, products } from "../src/constants/products";
import { siteConfig } from "../src/config/site";

const prisma = new PrismaClient();

function parseWeight(weight?: string): { value: number | null; unit: string } {
  if (!weight) return { value: null, unit: "kg" };
  const match = weight.match(/^([\d.]+)\s*(.*)$/);
  if (!match) return { value: null, unit: "kg" };
  return { value: parseFloat(match[1]), unit: match[2] || "kg" };
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin";
  const adminName = process.env.ADMIN_NAME ?? "Super Admin";

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
    },
  });
  console.log(`Super Admin listo: ${adminEmail}`);

  const categoryMap = new Map<string, string>();

  for (const [index, category] of categories.entries()) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        image: category.image,
        sortOrder: index,
        status: CategoryStatus.ACTIVE,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        sortOrder: index,
        status: CategoryStatus.ACTIVE,
      },
    });
    categoryMap.set(category.slug, record.id);
  }

  for (const [index, product] of products.entries()) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) continue;

    const { value: weight, unit: weightUnit } = parseWeight(product.weight);

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        shortDesc: product.shortDesc,
        longDesc: product.longDesc,
        price: product.price,
        salePrice: product.salePrice ?? null,
        sku: product.sku,
        stock: product.stock,
        weight,
        weightUnit,
        origin: product.origin ?? null,
        brand: product.brand ?? null,
        brandLogo: product.brandLogo ?? null,
        categoryId,
        mainImage: product.mainImage,
        tags: product.tags,
        highlights: product.highlights ?? [],
        benefits: (product.benefits ?? []) as unknown as object,
        uses: product.uses ?? [],
        nutritionalInfo: product.nutritionalInfo ?? [],
        isFeatured: ["sal-de-maras", "panela-organica", "panela-pura"].includes(
          product.id
        ),
        sortOrder: index,
        status: ProductStatus.PUBLISHED,
      },
      create: {
        name: product.name,
        slug: product.slug,
        shortDesc: product.shortDesc,
        longDesc: product.longDesc,
        price: product.price,
        salePrice: product.salePrice ?? null,
        sku: product.sku,
        stock: product.stock,
        weight,
        weightUnit,
        origin: product.origin ?? null,
        brand: product.brand ?? null,
        brandLogo: product.brandLogo ?? null,
        categoryId,
        mainImage: product.mainImage,
        tags: product.tags,
        highlights: product.highlights ?? [],
        benefits: (product.benefits ?? []) as unknown as object,
        uses: product.uses ?? [],
        nutritionalInfo: product.nutritionalInfo ?? [],
        isFeatured: ["sal-de-maras", "panela-organica", "panela-pura"].includes(
          product.id
        ),
        sortOrder: index,
        status: ProductStatus.PUBLISHED,
      },
    });
  }

  const defaultSettings: Record<string, string> = {
    "site.name": siteConfig.name,
    "site.tagline": siteConfig.tagline,
    "site.description": siteConfig.description,
    "contact.email": siteConfig.contact.email,
    "contact.phone": siteConfig.contact.phone,
    "contact.hours": siteConfig.contact.hours,
    "contact.whatsapp": siteConfig.orders.whatsapp,
    "social.instagram": siteConfig.links.instagram,
    "social.facebook": siteConfig.links.facebook,
    "content.hero": JSON.stringify({
      title: "Productos que enamoran desde el primer contacto",
      subtitle: "",
      description:
        "Descubre la autenticidad de los productos naturales peruanos: panela orgánica Dulce & Vida, Sal de Maras y selección artesanal elaborada con pasión y tradición.",
      buttonText: "Ver Catálogo",
      buttonLink: "/productos",
      image: "/products/sal-de-maras.png",
    }),
    "content.about": JSON.stringify({
      title: "Nuestra historia",
      description:
        "Somos una marca peruana dedicada a productos naturales con origen, tradición y calidad premium.",
      history: "",
      image: "/products/sal-de-maras.png",
    }),
    "content.contact": JSON.stringify({
      phone: siteConfig.contact.phone,
      whatsapp: siteConfig.contact.phoneRaw,
      email: siteConfig.contact.email,
      address: siteConfig.contact.addressPlaceholder,
      hours: siteConfig.contact.hours,
      instagram: siteConfig.links.instagram,
      facebook: siteConfig.links.facebook,
    }),
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  console.log("Seed completado.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
