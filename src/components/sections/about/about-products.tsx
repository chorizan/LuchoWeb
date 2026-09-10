"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeInUp, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/ui/motion";
import { ComparisonTable } from "@/components/ui/accordion";
import {
  whyChooseUs,
  salDeMaras,
  panela,
} from "@/constants/about-content";

export function AboutWhyChoose() {
  return (
    <section className="py-20 md:py-32">
      <div className="container-premium">
        <FadeInUp className="max-w-2xl mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            ¿Por qué elegir nuestros productos?
          </h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            Cada decisión de compra refleja un compromiso con la calidad, el origen
            y las personas que hacen posible lo que llega a tu mesa.
          </p>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((item) => (
            <StaggerItem key={item.title}>
              <ScaleOnHover>
                <div className="group bg-white rounded-3xl overflow-hidden shadow-sm h-full">
                  <div className="relative aspect-[16/10] bg-gray-light">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function AboutSalDeMaras() {
  return (
    <section id="sal-de-maras" className="py-20 md:py-32 bg-cream scroll-mt-24">
      <div className="container-premium">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <FadeInUp>
            <span className="text-sm font-medium text-olive uppercase tracking-widest">
              Producto estrella
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-bold">
              {salDeMaras.title}
            </h2>
            <p className="mt-2 text-lg text-olive font-medium">
              {salDeMaras.subtitle}
            </p>
            <p className="mt-6 text-text-muted leading-relaxed">{salDeMaras.what}</p>

            <div className="mt-6 flex items-start gap-2 text-sm text-text-muted">
              <MapPin className="h-5 w-5 text-olive shrink-0 mt-0.5" />
              <span>{salDeMaras.where}</span>
            </div>

            <div className="mt-8">
              <Button asChild variant="olive">
                <Link href="/productos/sal-de-maras">
                  Ver producto
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-lg">
              <Image
                src={salDeMaras.image}
                alt="Sal de Maras gourmet"
                fill
                className="object-contain p-8"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeInUp>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <FadeInUp>
            <h3 className="font-serif text-xl font-semibold mb-4">
              Proceso artesanal
            </h3>
            <ol className="space-y-3">
              {salDeMaras.how.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-text-muted">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive/10 text-xs font-semibold text-olive">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <h3 className="font-serif text-xl font-semibold mb-4">Historia</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-6">
              {salDeMaras.history}
            </p>
            <h3 className="font-serif text-xl font-semibold mb-4">
              Características
            </h3>
            <ul className="space-y-2">
              {salDeMaras.characteristics.map((c) => (
                <li key={c} className="flex gap-2 text-sm text-text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-olive shrink-0 mt-2" />
                  {c}
                </li>
              ))}
            </ul>
          </FadeInUp>
        </div>

        <FadeInUp className="mt-12">
          <h3 className="font-serif text-xl font-semibold mb-4">
            Minerales presentes naturalmente
          </h3>
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-3">
            {salDeMaras.minerals.map((m) => (
              <p key={m.slice(0, 30)} className="text-sm text-text-muted leading-relaxed">
                {m}
              </p>
            ))}
          </div>
        </FadeInUp>

        <FadeInUp className="mt-8">
          <h3 className="font-serif text-xl font-semibold mb-4">
            Uso gastronómico
          </h3>
          <div className="flex flex-wrap gap-2">
            {salDeMaras.culinary.map((use) => (
              <span
                key={use}
                className="text-sm bg-olive/10 text-olive px-4 py-2 rounded-full"
              >
                {use}
              </span>
            ))}
          </div>
        </FadeInUp>

        <FadeInUp className="mt-8">
          <div className="flex gap-3 bg-beige-dark/40 rounded-2xl p-5 md:p-6">
            <AlertCircle className="h-5 w-5 text-olive shrink-0 mt-0.5" />
            <p className="text-sm text-text-muted leading-relaxed">
              <strong className="text-text">Consumo responsable:</strong>{" "}
              {salDeMaras.responsible}
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

export function AboutPanela() {
  return (
    <section id="panela" className="py-20 md:py-32 scroll-mt-24">
      <div className="container-premium">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <FadeInUp className="order-2 lg:order-1">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-lg">
              <Image
                src={panela.image}
                alt="Panela orgánica"
                fill
                className="object-contain p-8"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeInUp>

          <FadeInUp delay={0.1} className="order-1 lg:order-2">
            <span className="text-sm font-medium text-olive uppercase tracking-widest">
              Endulzante natural
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-bold">
              {panela.title}
            </h2>
            <p className="mt-2 text-lg text-olive font-medium">{panela.subtitle}</p>
            <p className="mt-6 text-text-muted leading-relaxed">{panela.what}</p>
            <p className="mt-4 text-text-muted leading-relaxed">{panela.origin}</p>

            <div className="mt-8">
              <Button asChild variant="olive">
                <Link href="/productos/panela-organica">
                  Ver producto
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeInUp>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <FadeInUp>
            <h3 className="font-serif text-xl font-semibold mb-4">
              Proceso artesanal
            </h3>
            <ol className="space-y-3">
              {panela.how.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-text-muted">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive/10 text-xs font-semibold text-olive">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <h3 className="font-serif text-xl font-semibold mb-4">
              Conservación de la melaza
            </h3>
            <p className="text-sm text-text-muted leading-relaxed mb-6">
              {panela.molasses}
            </p>
            <h3 className="font-serif text-xl font-semibold mb-4">
              Perfil de sabor
            </h3>
            <p className="text-sm text-text-muted leading-relaxed mb-6">
              {panela.flavor}
            </p>
            <h3 className="font-serif text-xl font-semibold mb-4">
              Características
            </h3>
            <ul className="space-y-2">
              {panela.characteristics.map((c) => (
                <li key={c} className="flex gap-2 text-sm text-text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-olive shrink-0 mt-2" />
                  {c}
                </li>
              ))}
            </ul>
          </FadeInUp>
        </div>

        <FadeInUp className="mt-8">
          <h3 className="font-serif text-xl font-semibold mb-4">
            Uso culinario
          </h3>
          <div className="flex flex-wrap gap-2">
            {panela.culinary.map((use) => (
              <span
                key={use}
                className="text-sm bg-olive/10 text-olive px-4 py-2 rounded-full"
              >
                {use}
              </span>
            ))}
          </div>
        </FadeInUp>

        <FadeInUp className="mt-8">
          <div className="flex gap-3 bg-beige-dark/40 rounded-2xl p-5 md:p-6">
            <AlertCircle className="h-5 w-5 text-olive shrink-0 mt-0.5" />
            <p className="text-sm text-text-muted leading-relaxed">
              <strong className="text-text">Consumo responsable:</strong>{" "}
              {panela.responsible}
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

export function AboutComparisons() {
  return (
    <section className="py-20 md:py-32 bg-cream">
      <div className="container-premium">
        <FadeInUp className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Comparativas
          </h2>
          <p className="mt-4 text-text-muted max-w-xl mx-auto">
            Diferencias respaldadas entre productos artesanales y sus equivalentes
            refinados industrialmente.
          </p>
        </FadeInUp>

        <div className="space-y-8">
          <FadeInUp>
            <ComparisonTable
              title="Sal de Maras vs Sal Refinada"
              rows={salDeMaras.vsRefined}
              leftLabel="Sal de Maras"
              rightLabel="Sal Refinada"
              leftKey="maras"
              rightKey="refined"
            />
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <ComparisonTable
              title="Panela vs Azúcar Refinada"
              rows={panela.vsRefined}
              leftLabel="Panela"
              rightLabel="Azúcar Refinada"
              leftKey="panela"
              rightKey="refined"
            />
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
