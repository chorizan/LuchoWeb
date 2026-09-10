"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { featuredCategories, testimonials, instagramPosts } from "@/constants/mock-data";
import { FadeInUp, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="container-premium">
        <FadeInUp className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Categorías Destacadas
          </h2>
          <p className="mt-3 text-text-muted max-w-lg mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCategories.map((cat) => (
            <StaggerItem key={cat.id}>
              <ScaleOnHover>
                <Link
                  href={`/categorias/${cat.slug}`}
                  className="group block relative rounded-3xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-xl font-semibold text-white">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/70">{cat.description}</p>
                  </div>
                </Link>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function BrandStorySection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-premium">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInUp>
            <span className="text-sm font-medium text-olive uppercase tracking-widest">
              Nuestra Historia
            </span>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-bold">
              Tradición y excelencia en cada detalle
            </h2>
            <p className="mt-6 text-text-muted leading-relaxed">
              Conectamos el Perú artesanal con quienes valoran la calidad y la
              tradición. Desde las salineras de Maras hasta la panela de caña,
              cada producto cuenta una historia de origen, proceso y compromiso.
            </p>
            <div className="mt-8">
              <Button asChild variant="outline">
                <Link href="/nosotros">Conocer más</Link>
              </Button>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-olive/5">
      <div className="container-premium">
        <FadeInUp className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Lo que dicen nuestros clientes
          </h2>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <StaggerItem key={t.id}>
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm h-full">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-text-muted leading-relaxed italic">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="mt-6 pt-4 border-t border-beige-dark">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function InstagramSection() {
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="container-premium">
        <FadeInUp className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Síguenos en Instagram
          </h2>
          <p className="mt-2 text-text-muted text-sm">@raicesartesania</p>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {instagramPosts.map((src, i) => (
            <StaggerItem key={i}>
              <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer">
                <Image
                  src={src}
                  alt={`Instagram post ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-olive/0 group-hover:bg-olive/20 transition-colors duration-300" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
