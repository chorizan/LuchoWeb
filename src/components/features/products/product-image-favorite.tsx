"use client";

import type { Product } from "@/types";
import { FavoriteButton } from "@/components/features/products/favorite-button";

interface ProductImageFavoriteProps {
  product: Product;
}

export function ProductImageFavorite({ product }: ProductImageFavoriteProps) {
  return (
    <div className="absolute top-4 right-4 z-10">
      <FavoriteButton
        product={product}
        size="lg"
        className="shadow-md backdrop-blur-sm"
      />
    </div>
  );
}
