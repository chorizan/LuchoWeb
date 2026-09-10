import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getActiveCategories,
  getCategoryBySlug,
  getProductsByCategory,
  getAllProductSlugs,
} from "@/lib/catalog";
import { ProductCard } from "@/components/cards/product-card";
import { FadeInUp } from "@/components/ui/motion";
import { siteConfig } from "@/config/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getActiveCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Categoría no encontrada" };

  return {
    title: category.name,
    description: category.description,
    openGraph: {
      title: `${category.name} | ${siteConfig.name}`,
      description: category.description,
      images: [{ url: category.image }],
    },
    alternates: {
      canonical: `${siteConfig.url}/categorias/${slug}`,
    },
  };
}

export default async function CategoriaDetailPage({ params }: Props) {
  const { slug } = await params;
  const [category, categoryProducts, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug),
    getActiveCategories(),
  ]);
  if (!category) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `${siteConfig.url}/categorias/${slug}`,
    numberOfItems: categoryProducts.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-premium py-24 md:py-32">
        <FadeInUp>
          <Link
            href="/categorias"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-olive transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Todas las categorías
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16">
            <div>
              <nav className="text-sm text-text-muted mb-4">
                <Link href="/" className="hover:text-olive transition-colors">
                  Inicio
                </Link>
                <span className="mx-2">/</span>
                <Link
                  href="/categorias"
                  className="hover:text-olive transition-colors"
                >
                  Categorías
                </Link>
                <span className="mx-2">/</span>
                <span className="text-text">{category.name}</span>
              </nav>
              <h1 className="font-serif text-4xl md:text-5xl font-bold">
                {category.name}
              </h1>
              <p className="mt-4 text-text-muted leading-relaxed text-lg">
                {category.description}
              </p>
              <p className="mt-4 text-sm text-olive font-medium">
                {categoryProducts.length}{" "}
                {categoryProducts.length === 1 ? "producto" : "productos"}{" "}
                disponibles
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-sm">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-contain p-8"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </FadeInUp>

        {categoryProducts.length === 0 ? (
          <FadeInUp>
            <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
              <p className="text-text-muted">
                Próximamente agregaremos productos en esta categoría.
              </p>
              <Link
                href="/productos"
                className="inline-block mt-4 text-sm text-olive hover:underline"
              >
                Ver todos los productos
              </Link>
            </div>
          </FadeInUp>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryProducts.map((product, i) => (
              <FadeInUp key={product.id} delay={i * 0.05}>
                <ProductCard product={product} />
              </FadeInUp>
            ))}
          </div>
        )}

        {/* Otras categorías */}
        {categories.filter((c) => c.slug !== slug).length > 0 && (
          <FadeInUp className="mt-20 pt-16 border-t border-beige-dark">
            <h2 className="font-serif text-2xl font-semibold mb-8">
              Otras categorías
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories
                .filter((c) => c.slug !== slug)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categorias/${c.slug}`}
                    className="px-5 py-2.5 rounded-full bg-white text-sm font-medium text-text-muted hover:bg-olive hover:text-white transition-colors shadow-sm"
                  >
                    {c.name}
                  </Link>
                ))}
            </div>
          </FadeInUp>
        )}
      </div>
    </>
  );
}
