"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/features/cart/store";
import { useCartToast } from "@/features/cart/toast";
import { FavoriteButton } from "@/components/features/products/favorite-button";

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "horizontal";
}

export function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { showToast } = useCartToast();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: product.mainImage,
    });
    showToast(`${product.name} agregado al carrito`);
  };

  if (variant === "horizontal") {
    return (
      <motion.div
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-4 md:gap-6 bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <Link
          href={`/productos/${product.slug}`}
          className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-light"
        >
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            className="object-contain p-1.5"
            sizes="96px"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/productos/${product.slug}`}>
            <h3 className="font-serif text-base md:text-lg font-semibold truncate hover:text-olive transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs md:text-sm text-text-muted line-clamp-2 mt-0.5">
            {product.shortDesc}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <FavoriteButton product={product} size="sm" />
          <span className="font-semibold text-sm md:text-base">
            {formatPrice(product.salePrice ?? product.price)}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-olive text-white hover:bg-olive-dark transition-colors cursor-pointer"
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <Plus className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <Link href={`/productos/${product.slug}`} className="group block">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square bg-[#f5f1e8] overflow-hidden">
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            className={
              product.slug === "panela-organica"
                ? "object-contain p-6 md:p-8 group-hover:scale-[1.03] transition-transform duration-500"
                : "object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            }
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {product.salePrice && (
            <span className="absolute top-3 left-3 bg-sale text-white text-xs font-semibold px-3 py-1 rounded-full">
              Oferta
            </span>
          )}
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton
              product={product}
              size="sm"
              className="shadow-sm backdrop-blur-sm"
            />
          </div>
        </div>
        <div className="p-5">
          <span className="text-xs font-medium text-olive uppercase tracking-wide">
            {product.category}
          </span>
          <h3 className="mt-1 font-serif text-lg font-semibold group-hover:text-olive transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-text-muted line-clamp-2">
            {product.shortDesc}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              {product.salePrice ? (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sale">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-sm text-text-muted line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="font-semibold">{formatPrice(product.price)}</span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-olive text-white hover:bg-olive-dark transition-colors cursor-pointer"
              aria-label={`Agregar ${product.name}`}
            >
              <ShoppingBag className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </Link>
  );
}
