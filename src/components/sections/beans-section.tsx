"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeInUp, FloatAnimation } from "@/components/ui/motion";

export function BeansSection() {
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container-premium">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeInUp>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-text text-balance">
              Productos de los que estamos orgullosos
            </h2>
            <p className="mt-4 text-text-muted leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cada
              producto es seleccionado cuidadosamente de las mejores regiones
              del Perú, trabajando directamente con artesanos locales que
              preservan técnicas ancestrales.
            </p>
            <p className="mt-3 text-text-muted leading-relaxed">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="mt-8">
              <Button asChild variant="olive" size="lg">
                <Link href="/productos">
                  Explorar Productos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex gap-6">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-olive" />
                <span className="text-sm text-text-muted">Origen certificado</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-olive" />
                <span className="text-sm text-text-muted">Calidad premium</span>
              </div>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <FloatAnimation>
              <div className="relative flex justify-center">
                <div className="relative w-72 h-72 md:w-80 md:h-80">
                  <div className="absolute inset-0 rounded-full overflow-hidden shadow-xl">
                    <Image
                      src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=600&fit=crop"
                      alt="Ingredientes naturales"
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 w-36 h-48 md:w-44 md:h-56 rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=400&fit=crop"
                      alt="Empaque premium"
                      fill
                      className="object-cover"
                      sizes="176px"
                    />
                  </motion.div>
                </div>
              </div>
            </FloatAnimation>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
