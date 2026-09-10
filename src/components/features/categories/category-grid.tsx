"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/ui/motion";
import type { Category, Product } from "@/types";

interface CategoryGridProps {
  categories: Category[];
  products: Product[];
}

export function CategoryGrid({ categories, products }: CategoryGridProps) {
  const countByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const product of products) {
      map.set(product.categorySlug, (map.get(product.categorySlug) ?? 0) + 1);
    }
    return map;
  }, [products]);

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {categories.map((cat) => {
        const productCount = countByCategory.get(cat.slug) ?? 0;        return (
          <StaggerItem key={cat.slug}>
            <ScaleOnHover>
              <Link
                href={`/categorias/${cat.slug}`}
                className="group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative aspect-[4/3] bg-gray-light">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-xl md:text-2xl font-semibold group-hover:text-olive transition-colors">
                        {cat.name}
                      </h2>
                      <p className="mt-2 text-sm text-text-muted leading-relaxed">
                        {cat.description}
                      </p>
                      <p className="mt-3 text-xs font-medium text-olive uppercase tracking-wide">
                        {productCount}{" "}
                        {productCount === 1 ? "producto" : "productos"}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-olive/10 group-hover:bg-olive group-hover:text-white transition-colors duration-300">
                      <ArrowRight className="h-4 w-4 text-olive group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </ScaleOnHover>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}
