"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatPrice } from "@/lib/utils";
import { shippingCost } from "@/config/site";
import { FadeInUp } from "@/components/ui/motion";

export default function CarritoPage() {
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  if (!hydrated) {
    return (
      <div className="container-premium py-24 md:py-32">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-beige-dark rounded w-48" />
          <div className="h-32 bg-beige-dark rounded-3xl" />
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shipping =
    subtotal >= shippingCost.freeThreshold ? 0 : shippingCost.standard;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container-premium py-24 md:py-32 text-center">
        <FadeInUp>
          <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-olive/10 mb-6">
            <ShoppingBag className="h-10 w-10 text-olive" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
            Tu carrito está vacío
          </h1>
          <p className="text-text-muted mb-8 max-w-md mx-auto">
            Descubre nuestra Sal de Maras gourmet y Panela orgánica, productos
            naturales con beneficios comprobados.
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
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
          Carrito de compras
        </h1>
        <p className="text-text-muted mb-10">
          {items.length} {items.length === 1 ? "producto" : "productos"} en tu
          carrito
        </p>
      </FadeInUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <FadeInUp key={item.productId} delay={i * 0.05}>
              <motion.div
                layout
                className="flex gap-4 md:gap-6 bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-sm"
              >
                <Link
                  href={`/productos/${item.slug}`}
                  className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-light"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                    sizes="96px"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/productos/${item.slug}`}>
                    <h3 className="font-serif text-base md:text-lg font-semibold hover:text-olive transition-colors truncate">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm font-semibold mt-1">
                    {formatPrice(item.salePrice ?? item.price)}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-light rounded-full px-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-beige-dark transition-colors cursor-pointer"
                        aria-label="Disminuir"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-beige-dark transition-colors cursor-pointer"
                        aria-label="Aumentar"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="flex items-center gap-1 text-xs text-text-muted hover:text-sale transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-semibold">
                    {formatPrice(
                      (item.salePrice ?? item.price) * item.quantity
                    )}
                  </p>
                </div>
              </motion.div>
            </FadeInUp>
          ))}
        </div>

        {/* Summary */}
        <FadeInUp delay={0.2}>
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm h-fit sticky top-24">
            <h2 className="font-serif text-xl font-semibold mb-6">
              Resumen del pedido
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Envío</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-olive">Gratis</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {subtotal < shippingCost.freeThreshold && (
                <p className="text-xs text-text-muted bg-beige rounded-xl px-3 py-2">
                  Agrega {formatPrice(shippingCost.freeThreshold - subtotal)}{" "}
                  más para envío gratis
                </p>
              )}
              <div className="border-t border-beige-dark pt-3 flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            <Button asChild size="lg" className="w-full mt-6">
              <Link href="/checkout">
                Proceder al pago
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Link
              href="/productos"
              className="block text-center text-sm text-text-muted hover:text-olive mt-4 transition-colors"
            >
              Seguir comprando
            </Link>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
