import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Scale } from "lucide-react";
import { getProductBySlug, getAllProductSlugs } from "@/lib/catalog";
import { ProductBenefits } from "@/components/features/products/product-benefits";
import { AddToCartButton } from "@/components/features/products/add-to-cart-button";
import { ProductDetailActions } from "@/components/features/products/product-detail-actions";
import { ProductImageFavorite } from "@/components/features/products/product-image-favorite";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { FadeInUp } from "@/components/ui/motion";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.shortDesc,
    openGraph: {
      title: product.name,
      description: product.shortDesc,
      images: [{ url: product.mainImage }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const isFeatured =
    product.slug === "sal-de-maras" ||
    product.slug === "panela-pura" ||
    product.slug === "panela-organica";

  return (
    <div className="container-premium py-24 md:py-32">
      <Link
        href="/productos"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-olive transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <FadeInUp>
          <div className="relative aspect-square bg-[#f5f1e8] rounded-3xl overflow-hidden shadow-sm">
            <ProductImageFavorite product={product} />
            <Image
              src={product.mainImage}
              alt={product.name}
              fill
              className={
                product.slug === "panela-organica"
                  ? "object-contain p-8 md:p-12"
                  : "object-contain p-6 md:p-10"
              }
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </FadeInUp>

        {/* Info */}
        <FadeInUp delay={0.1}>
          <div>
            {product.brandLogo && (
              <div className="mb-6 flex items-center gap-4">
                <Image
                  src={product.brandLogo}
                  alt={product.brand ?? siteConfig.name}
                  width={140}
                  height={58}
                  className="h-12 w-auto object-contain"
                />
              </div>
            )}
            <span className="text-sm font-medium text-olive uppercase tracking-wide">
              {product.category}
            </span>
            <h1 className="mt-2 font-serif text-3xl md:text-4xl font-bold">
              {product.name}
            </h1>
            <p className="mt-4 text-text-muted leading-relaxed">
              {product.longDesc}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-text-muted">
              {product.origin && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-olive" />
                  {product.origin}
                </span>
              )}
              {product.weight && (
                <span className="flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-olive" />
                  {product.weight}
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.highlights?.map((highlight) => (
                <span
                  key={highlight}
                  className="text-xs font-semibold bg-olive text-white px-3 py-1.5 rounded-full"
                >
                  {highlight}
                </span>
              ))}
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-beige-dark/60 text-text px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8">
              {product.salePrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-sale">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-lg text-text-muted line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <div className="mt-8">
              <AddToCartButton product={product} size="lg" />
            </div>

            <ProductDetailActions product={product} />

            {product.stock <= 10 && product.stock > 0 && (
              <p className="mt-4 text-sm text-sale">
                ¡Solo quedan {product.stock} unidades!
              </p>
            )}
          </div>
        </FadeInUp>
      </div>

      {/* Benefits section */}
      {(product.benefits.length > 0 ||
        (product.uses?.length ?? 0) > 0 ||
        (product.nutritionalInfo?.length ?? 0) > 0) && (
        <div className="mt-20 pt-16 border-t border-beige-dark">
          {isFeatured && (
          <FadeInUp className="mb-10">
            <div className="bg-olive/5 rounded-3xl p-6 md:p-8">
              <h2 className="font-serif text-xl md:text-2xl font-bold text-olive mb-2">
                {product.slug === "sal-de-maras"
                  ? "¿Por qué elegir Sal de Maras?"
                  : product.slug === "panela-organica"
                    ? "¿Por qué elegir nuestra Panela Orgánica?"
                    : "¿Por qué elegir Panela Pura?"}
              </h2>
              <p className="text-text-muted text-sm md:text-base leading-relaxed">
                {product.slug === "sal-de-maras"
                  ? "La Sal de Maras es reconocida mundialmente por su pureza, contenido mineral y tradición inca. A diferencia de la sal de mesa refinada, conserva minerales traza que realzan el sabor de tus platos."
                  : product.slug === "panela-organica"
                    ? "Panela orgánica Dulce & Vida: elaborada artesanalmente a partir del jugo de caña, sin procesos químicos ni aditivos. Rica en minerales, sostenible y directa del campo peruano a tu mesa."
                    : "La panela es un endulzante natural que conserva parte de los nutrientes del jugo de caña. A diferencia del azúcar blanco refinado, mantiene trazas de minerales y un sabor caramelizado que enriquece tus recetas."}
              </p>
            </div>
          </FadeInUp>
        )}
        <ProductBenefits
          benefits={product.benefits}
          uses={product.uses}
          nutritionalInfo={product.nutritionalInfo}
        />
        </div>
      )}
    </div>
  );
}
