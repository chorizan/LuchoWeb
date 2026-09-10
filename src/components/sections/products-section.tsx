"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { popularProducts, recommendedProducts } from "@/constants/mock-data";
import { formatPrice } from "@/lib/utils";
import { FadeInUp, ScaleOnHover } from "@/components/ui/motion";
import { useCartStore } from "@/features/cart/store";

export function PopularProductsSection() {
  return (
    <section className="relative py-16 md:py-24">
      {/* Green background with wave */}
      <div className="absolute inset-0 bg-olive rounded-[2rem] md:rounded-[3rem] mx-2 sm:mx-4 lg:mx-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 1440 400" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0 200C360 100 720 300 1080 200C1260 150 1380 250 1440 200V400H0V200Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      <div className="container-premium relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 pt-4">
          <FadeInUp>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
              Productos Populares
            </h2>
            <p className="mt-2 text-white/70 text-sm max-w-md">
              Sal de Maras, Panela orgánica y selección artesanal premium.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-olive"
            >
              <Link href="/productos">Ver Todos</Link>
            </Button>
          </FadeInUp>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 pb-4">
          {popularProducts.map((product, index) => (
            <FadeInUp key={product.id} delay={index * 0.15}>
              <ScaleOnHover>
                <Link href={`/productos/${product.slug}`} className="group block text-center">
                  <div className="relative mx-auto w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-white/20 shadow-xl group-hover:border-white/40 transition-all duration-300">
                    <Image
                      src={product.mainImage}
                      alt={product.name}
                      fill
                      className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 176px, 208px"
                    />
                  </div>
                  <h3 className="mt-5 font-serif text-lg font-semibold text-white">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/60">{product.shortDesc}</p>
                  <p className="mt-2 text-lg font-semibold text-gold">
                    {formatPrice(product.price)}
                  </p>
                </Link>
              </ScaleOnHover>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RecommendedSection() {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <section className="py-16 md:py-24">
      <div className="container-premium">
        <FadeInUp className="mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-text">
            Te recomendamos probar
          </h2>
          <p className="mt-2 text-text-muted text-sm max-w-lg">
            Sal de Maras y Panela orgánica — selección curada por nuestros expertos.
          </p>
        </FadeInUp>

        <div className="space-y-4">
          {recommendedProducts.map((product, index) => (
            <FadeInUp key={product.id} delay={index * 0.1}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-4 md:gap-6 bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-base md:text-lg font-semibold truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs md:text-sm text-text-muted line-clamp-2 mt-0.5">
                    {product.shortDesc}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-semibold text-sm md:text-base">
                    {formatPrice(product.price)}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      addItem({
                        id: product.id,
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        image: product.mainImage,
                      })
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-olive text-white hover:bg-olive-dark transition-colors cursor-pointer"
                    aria-label={`Agregar ${product.name} al carrito`}
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
