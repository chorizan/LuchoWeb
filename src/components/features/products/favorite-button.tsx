"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/features/favorites/store";
import { useCartToast } from "@/features/cart/toast";
import { useHydrated } from "@/hooks/use-hydrated";
import type { Product } from "@/types";

interface FavoriteButtonProps {
  product: Product;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizeStyles = {
  sm: { button: "h-8 w-8", icon: "h-4 w-4" },
  md: { button: "h-10 w-10", icon: "h-5 w-5" },
  lg: { button: "h-11 w-11", icon: "h-5 w-5" },
} as const;

export function FavoriteButton({
  product,
  className,
  size = "md",
  showLabel = false,
}: FavoriteButtonProps) {
  const hydrated = useHydrated();
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) =>
    s.items.some((item) => item.productId === product.id)
  );
  const { showToast } = useCartToast();
  const styles = sizeStyles[size];

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const added = toggleFavorite(product);
    showToast(
      added
        ? `${product.name} agregado a favoritos`
        : `${product.name} eliminado de favoritos`
    );
  };

  const active = hydrated && isFavorite;

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={handleToggle}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors cursor-pointer",
        showLabel ? "gap-2 px-4 py-2.5 text-sm font-medium" : styles.button,
        active
          ? "bg-sale/10 text-sale hover:bg-sale/15"
          : "bg-white/90 text-text-muted hover:bg-white hover:text-sale",
        className
      )}
      aria-label={
        active
          ? `Quitar ${product.name} de favoritos`
          : `Agregar ${product.name} a favoritos`
      }
      aria-pressed={active}
    >
      <Heart
        className={cn(styles.icon, active && "fill-current")}
        strokeWidth={active ? 0 : 2}
      />
      {showLabel && (active ? "En favoritos" : "Agregar a favoritos")}
    </motion.button>
  );
}
