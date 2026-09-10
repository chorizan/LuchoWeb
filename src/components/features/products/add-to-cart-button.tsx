"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";
import { useCartToast } from "@/features/cart/toast";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import Link from "next/link";

interface AddToCartButtonProps {
  product: Product;
  size?: "default" | "lg";
}

export function AddToCartButton({ product, size = "default" }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { showToast } = useCartToast();

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        salePrice: product.salePrice,
        image: product.mainImage,
      });
    }
    showToast(
      quantity === 1
        ? `${product.name} agregado al carrito`
        : `${quantity}× ${product.name} agregados al carrito`
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex items-center gap-3 bg-gray-light rounded-full px-2 py-1 self-start">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-beige-dark transition-colors cursor-pointer"
          aria-label="Disminuir cantidad"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-semibold">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-beige-dark transition-colors cursor-pointer"
          aria-label="Aumentar cantidad"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
          <Button
            onClick={handleAdd}
            size={size === "lg" ? "lg" : "default"}
            className="w-full"
          >
            <ShoppingBag className="h-4 w-4" />
            Agregar — {formatPrice((product.salePrice ?? product.price) * quantity)}
          </Button>
        </motion.div>
        <Button asChild variant="outline" size={size === "lg" ? "lg" : "default"}>
          <Link href="/carrito">Ver carrito</Link>
        </Button>
      </div>
    </div>
  );
}
