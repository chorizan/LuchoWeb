import type { MetadataRoute } from "next";
import { getPublishedProducts, getActiveCategories } from "@/lib/catalog";
import { siteConfig, navLinks } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getPublishedProducts(),
    getActiveCategories(),
  ]);  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteConfig.url}/productos/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${siteConfig.url}/categorias/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const routes = ["", "/productos", "/categorias", "/nosotros", "/contacto", "/carrito", "/checkout", "/favoritos", "/cuenta", ...navLinks.map((l) => l.href)];

  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
