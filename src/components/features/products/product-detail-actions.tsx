"use client";

import type { Product } from "@/types";
import { FavoriteButton } from "@/components/features/products/favorite-button";

interface ProductDetailActionsProps {
  product: Product;
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
      <FavoriteButton product={product} size="lg" showLabel className="w-full sm:w-auto" />
    </div>
  );
}
