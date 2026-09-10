"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Heart, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroFeatures } from "@/constants/mock-data";
import { HeroSaltScene } from "@/components/sections/hero-salt-scene";

const iconMap = {
  leaf: Leaf,
  heart: Heart,
  award: Award,
};

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-24 md:pt-28 pb-12">
      {/* Background organic shape */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -right-[20%] top-[10%] w-[70%] h-[80%] md:w-[55%] md:h-[85%]"
        >
          <svg
            viewBox="0 0 800 800"
            fill="none"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="hero-blob" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6B8240" />
                <stop offset="55%" stopColor="#556B2F" />
                <stop offset="100%" stopColor="#3D4F22" />
              </linearGradient>
            </defs>
            <motion.path
              d="M650 100C750 200 780 400 700 550C620 700 450 780 300 750C150 720 50 600 80 400C110 200 250 50 450 80C550 90 580 50 650 100Z"
              fill="url(#hero-blob)"
              animate={{
                d: [
                  "M650 100C750 200 780 400 700 550C620 700 450 780 300 750C150 720 50 600 80 400C110 200 250 50 450 80C550 90 580 50 650 100Z",
                  "M640 110C740 210 770 410 690 560C610 710 440 770 290 740C140 710 60 590 90 390C120 190 260 60 460 90C560 100 570 60 640 110Z",
                  "M650 100C750 200 780 400 700 550C620 700 450 780 300 750C150 720 50 600 80 400C110 200 250 50 450 80C550 90 580 50 650 100Z",
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      </div>

      <div className="container-premium relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-10 lg:gap-6 xl:gap-10 items-center">
          {/* Text */}
          <div className="max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-text text-balance"
            >
              Productos que enamoran desde el primer contacto
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-base sm:text-lg text-text-muted leading-relaxed"
            >
              Descubre la autenticidad de los productos naturales peruanos:
              panela orgánica Dulce & Vida, Sal de Maras y selección artesanal
              elaborada con pasión y tradición.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8"
            >
              <Button asChild size="lg">
                <Link href="/productos">
                  Ver Catálogo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Micro features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="mt-10 flex flex-wrap gap-6"
            >
              {heroFeatures.map((feature) => {
                const Icon = iconMap[feature.icon as keyof typeof iconMap];
                return (
                  <div key={feature.label} className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-olive/10">
                      <Icon className="h-4 w-4 text-olive" />
                    </div>
                    <span className="text-xs sm:text-sm text-text-muted">
                      {feature.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Hero 3D Salt Scene */}
          <div className="relative flex justify-center lg:justify-end">
            <HeroSaltScene />
          </div>
        </div>
      </div>
    </section>
  );
}
