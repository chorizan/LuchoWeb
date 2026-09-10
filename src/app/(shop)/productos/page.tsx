import type { Metadata } from "next";
import { ProductCatalog } from "@/components/features/products/product-catalog";
import { FadeInUp } from "@/components/ui/motion";
import { getPublishedProducts, getActiveCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Sal de Maras, panela orgánica y productos artesanales premium del Perú. Descubre sus beneficios naturales.",
};

export default async function ProductosPage() {
  const [products, categories] = await Promise.all([
    getPublishedProducts(),
    getActiveCategories(),
  ]);

  return (
    <div className="container-premium py-24 md:py-32">
      <FadeInUp>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
          Nuestros Productos
        </h1>
        <p className="text-text-muted max-w-2xl mb-10">
          Descubre la Sal de Maras milenaria y la Panela 100% natural, junto a
          una selección curada de productos artesanales premium.
        </p>
      </FadeInUp>
      <ProductCatalog products={products} categories={categories} />
    </div>
  );
}
