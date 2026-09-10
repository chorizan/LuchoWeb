"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/cards/product-card";
import { FadeInUp } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import type { Product, Category } from "@/types";

interface ProductCatalogProps {
  products: Product[];
  categories: Category[];
}

export function ProductCatalog({ products, categories }: ProductCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = products;
    if (category) {
      result = result.filter((p) => p.categorySlug === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.benefits.some(
            (b) =>
              b.title.toLowerCase().includes(q) ||
              b.description.toLowerCase().includes(q)
          )
      );
    }
    return result;
  }, [query, category, products]);

  return (
    <div>
      {/* Search & filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            type="search"
            placeholder="Buscar productos, beneficios..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer",
              !category
                ? "bg-olive text-white"
                : "bg-white text-text-muted hover:bg-beige-dark"
            )}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setCategory(cat.slug)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer",
                category === cat.slug
                  ? "bg-olive text-white"
                  : "bg-white text-text-muted hover:bg-beige-dark"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted">
            No se encontraron productos para &ldquo;{query}&rdquo;
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, i) => (
            <FadeInUp key={product.id} delay={i * 0.05}>
              <ProductCard product={product} />
            </FadeInUp>
          ))}
        </div>
      )}
    </div>
  );
}
