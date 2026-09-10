"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/cards/product-card";
import { useFavoritesStore } from "@/features/favorites/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { FadeInUp } from "@/components/ui/motion";
import { useMemo } from "react";
import type { Product } from "@/types";

export default function FavoritosClient({ products }: { products: Product[] }) {
  const hydrated = useHydrated();
  const favoriteItems = useFavoritesStore((s) => s.items);

  const favoriteProducts = useMemo(() => {
    const ids = new Set(favoriteItems.map((item) => item.productId));
    return products.filter(
      (product) => ids.has(product.id) || ids.has(product.slug)
    );
  }, [favoriteItems, products]);

  if (!hydrated) {
    return (
      <div className="container-premium py-24 md:py-32">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-beige-dark rounded w-56" />
          <div className="h-64 bg-beige-dark rounded-3xl" />
        </div>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="container-premium py-24 md:py-32 text-center">
        <FadeInUp>
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sale/10">
            <Heart className="h-10 w-10 text-sale" />
          </div>
          <h1 className="mb-3 font-serif text-3xl font-bold md:text-4xl">
            Aún no tienes favoritos
          </h1>
          <p className="mx-auto mb-8 max-w-md text-text-muted">
            Guarda los productos que más te gusten tocando el corazón en el
            catálogo o en la ficha de cada producto.
          </p>
          <Button asChild size="lg">
            <Link href="/productos">
              Explorar productos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </FadeInUp>
      </div>
    );
  }

  return (
    <div className="container-premium py-24 md:py-32">
      <FadeInUp>
        <h1 className="mb-2 font-serif text-3xl font-bold md:text-4xl">
          Mis favoritos
        </h1>
        <p className="mb-10 text-text-muted">
          {favoriteProducts.length}{" "}
          {favoriteProducts.length === 1 ? "producto guardado" : "productos guardados"}
        </p>
      </FadeInUp>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favoriteProducts.map((product, index) => (
          <FadeInUp key={product.id} delay={index * 0.05}>
            <ProductCard product={product} />
          </FadeInUp>
        ))}
      </div>
    </div>
  );
}
