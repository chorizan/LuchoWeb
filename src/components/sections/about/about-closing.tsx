"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { FAQAccordion } from "@/components/ui/accordion";
import {
  commitment,
  process,
  quality,
  faq,
  cta,
} from "@/constants/about-content";

export function AboutCommitment() {
  return (
    <section className="py-20 md:py-32">
      <div className="container-premium">
        <FadeInUp className="max-w-2xl mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            {commitment.title}
          </h2>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commitment.items.map((item) => (
            <StaggerItem key={item.title}>
              <div className="bg-white rounded-2xl p-6 md:p-8 h-full shadow-sm border border-beige-dark/50">
                <h3 className="font-serif text-lg font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function AboutProcess() {
  return (
    <section className="py-20 md:py-32 bg-olive/5">
      <div className="container-premium">
        <FadeInUp className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            {process.title}
          </h2>
          <p className="mt-4 text-text-muted">{process.subtitle}</p>
        </FadeInUp>

        <div className="relative">
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {process.steps.map((step) => (
              <StaggerItem key={step.step}>
                <div className="text-center relative">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-olive text-white font-serif font-bold text-sm relative z-10">
                    {step.step}
                  </div>
                  <h3 className="mt-4 font-serif font-semibold">{step.title}</h3>
                  <p className="mt-2 text-xs text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

export function AboutQuality() {
  return (
    <section className="py-20 md:py-32">
      <div className="container-premium">
        <FadeInUp className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            {quality.title}
          </h2>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {quality.items.map((item, i) => (
            <StaggerItem key={item.title}>
              <div
                className={`bg-white rounded-2xl p-6 shadow-sm h-full ${
                  i === quality.items.length - 1 && quality.items.length % 3 !== 0
                    ? "md:col-span-2 lg:col-span-1"
                    : ""
                }`}
              >
                <span className="text-3xl font-serif font-bold text-olive/20">
                  0{i + 1}
                </span>
                <h3 className="mt-2 font-serif text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function AboutFAQ() {
  return (
    <section className="py-20 md:py-32 bg-cream">
      <div className="container-premium max-w-3xl">
        <FadeInUp className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Preguntas Frecuentes
          </h2>
        </FadeInUp>
        <FadeInUp delay={0.1}>
          <FAQAccordion items={faq} />
        </FadeInUp>
      </div>
    </section>
  );
}

export function AboutCTA() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={cta.image}
          alt="Explorar catálogo"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-olive/80" />
      </div>
      <div className="container-premium relative z-10 text-center">
        <FadeInUp>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white text-balance max-w-2xl mx-auto">
            {cta.title}
          </h2>
          <p className="mt-6 text-white/80 max-w-lg mx-auto leading-relaxed">
            {cta.subtitle}
          </p>
          <div className="mt-10">
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-olive">
              <Link href={cta.href}>
                {cta.button}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
