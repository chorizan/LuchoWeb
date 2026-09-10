"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brand-logo";
import { navLinks } from "@/config/site";
import { useCartStore } from "@/features/cart/store";
import { useFavoritesStore } from "@/features/favorites/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const hydrated = useHydrated();
  const itemCount = useCartStore((s) => s.getItemCount());
  const favoriteCount = useFavoritesStore((s) => s.getCount());

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-beige/80 backdrop-blur-md">
      <div className="container-premium">
        <div className="flex h-20 md:h-[6.25rem] items-center justify-between gap-4">
          {/* Logo */}
          <BrandLogo variant="header" priority />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-muted hover:text-olive transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/favoritos"
              className="relative hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-beige-dark/60 transition-colors"
              aria-label="Favoritos"
            >
              <Heart
                className={`h-5 w-5 ${
                  hydrated && favoriteCount > 0 ? "fill-sale text-sale" : "text-text-muted"
                }`}
                strokeWidth={hydrated && favoriteCount > 0 ? 0 : 2}
              />
              {hydrated && favoriteCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sale text-[10px] font-bold text-white">
                  {favoriteCount}
                </span>
              )}
            </Link>
            <Link
              href="/cuenta"
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-beige-dark/60 transition-colors"
              aria-label="Mi cuenta"
            >
              <User className="h-5 w-5 text-text-muted" />
            </Link>
            <Link
              href="/carrito"
              className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-beige-dark/60 transition-colors"
              aria-label="Carrito"
            >
              <ShoppingBag className="h-5 w-5 text-text-muted" />
              {hydrated && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sale text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            <Button asChild className="hidden md:inline-flex">
              <Link href="/productos">Ver Catálogo</Link>
            </Button>
            <button
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full hover:bg-beige-dark/60 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-beige-dark bg-beige/95 backdrop-blur-md overflow-hidden"
          >
            <nav className="container-premium py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "py-3 px-4 rounded-xl text-sm text-text hover:bg-beige-dark/50 transition-colors"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/favoritos"
                onClick={() => setMobileOpen(false)}
                className="py-3 px-4 rounded-xl text-sm text-text hover:bg-beige-dark/50 transition-colors flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Favoritos
                {hydrated && favoriteCount > 0 && (
                  <span className="ml-auto rounded-full bg-sale px-2 py-0.5 text-[10px] font-bold text-white">
                    {favoriteCount}
                  </span>
                )}
              </Link>
              <div className="pt-2">
                <Button asChild className="w-full">
                  <Link href="/productos" onClick={() => setMobileOpen(false)}>
                    Ver Catálogo
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
