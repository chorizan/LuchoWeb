import type { Metadata } from "next";
import Link from "next/link";
import { CategoryGrid } from "@/components/features/categories/category-grid";
import { FadeInUp } from "@/components/ui/motion";
import { getActiveCategories, getPublishedProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Categorías",
  description:
    "Explora nuestras categorías: Sales Gourmet, Endulzantes Naturales y Cafés de Especialidad. Productos artesanales premium del Perú.",
};

export default async function CategoriasPage() {
  const [categories, products] = await Promise.all([
    getActiveCategories(),
    getPublishedProducts(),
  ]);

  return (
    <div className="container-premium py-24 md:py-32">
      <FadeInUp>
        <nav className="text-sm text-text-muted mb-6">
          <Link href="/" className="hover:text-olive transition-colors">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-text">Categorías</span>
        </nav>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
          Categorías
        </h1>
        <p className="text-text-muted max-w-2xl mb-12 leading-relaxed">
          Navega por nuestra selección curada de productos artesanales. Cada
          categoría reúne lo mejor del Perú: desde la sal milenaria de Maras
          hasta endulzantes naturales y cafés de altura.
        </p>
      </FadeInUp>
      <CategoryGrid categories={categories} products={products} />
    </div>
  );
}
