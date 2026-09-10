"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoBackground } from "@/components/ui/video-background";
import { getWhatsAppUrl, whatsappMessages } from "@/config/site";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import {
  aboutHero,
  ourStory,
  philosophy,
  mission,
  vision,
  values,
} from "@/constants/about-content";
import {
  Award,
  Heart,
  Leaf,
  Shield,
  Sparkles,
  Target,
  Users,
  Handshake,
} from "lucide-react";

const valueIcons = [Award, Heart, Leaf, Shield, Sparkles, Target, Users, Handshake];

export function AboutHero() {
  return (
    <section className="relative min-h-[70vh] flex items-end overflow-hidden pt-20">
      <div className="absolute inset-0">
        <VideoBackground
          src={aboutHero.video}
          poster={aboutHero.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />
      </div>
      <div className="container-premium relative z-10 pb-16 md:pb-24 pt-32">
        <FadeInUp>
          <span className="text-sm font-medium text-white/70 uppercase tracking-widest">
            Nosotros
          </span>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-balance max-w-3xl leading-tight">
            {aboutHero.title}
          </h1>
          <p className="mt-6 text-lg text-white/80 max-w-xl leading-relaxed">
            {aboutHero.subtitle}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg">
              <Link href={aboutHero.ctaHref}>
                {aboutHero.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-olive"
            >
              <a
                href={getWhatsAppUrl(whatsappMessages.general)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Contactar por WhatsApp
              </a>
            </Button>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

export function AboutStory() {
  return (
    <section className="py-20 md:py-32">
      <div className="container-premium">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <FadeInUp>
            <span className="text-sm font-medium text-olive uppercase tracking-widest">
              {ourStory.title}
            </span>
            <div className="mt-6 space-y-5">
              {ourStory.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="text-text-muted leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg">
              <Image
                src={ourStory.image}
                alt="Dulce & Vida — Productos Naturales"
                fill
                className="object-contain bg-white p-8"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeInUp>
        </div>

        {/* Timeline */}
        <FadeInUp className="mt-20 md:mt-28">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-center mb-12">
            Nuestro camino
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ourStory.timeline.map((item, i) => (
              <div
                key={item.year}
                className="relative bg-white rounded-2xl p-6 shadow-sm"
              >
                <span className="text-2xl font-serif font-bold text-olive">
                  {item.year}
                </span>
                <h4 className="mt-2 font-semibold">{item.title}</h4>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">
                  {item.description}
                </p>
                {i < ourStory.timeline.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-olive/30" />
                )}
              </div>
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

export function AboutPhilosophy() {
  return (
    <section className="py-20 md:py-32 bg-cream">
      <div className="container-premium">
        <FadeInUp className="max-w-2xl mb-14">
          <span className="text-sm font-medium text-olive uppercase tracking-widest">
            {philosophy.title}
          </span>
          <p className="mt-4 text-lg text-text-muted leading-relaxed">
            {philosophy.intro}
          </p>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {philosophy.pillars.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <div className="bg-white rounded-2xl p-6 md:p-8 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-serif text-lg font-semibold mb-3">
                  {pillar.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function AboutMissionVision() {
  return (
    <section className="py-20 md:py-32">
      <div className="container-premium">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <FadeInUp>
            <div className="bg-olive rounded-3xl p-8 md:p-10 text-white h-full">
              <span className="text-sm font-medium uppercase tracking-widest text-white/70">
                {mission.title}
              </span>
              <p className="mt-6 font-serif text-xl md:text-2xl leading-relaxed">
                {mission.text}
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm h-full border border-beige-dark">
              <span className="text-sm font-medium text-olive uppercase tracking-widest">
                {vision.title}
              </span>
              <p className="mt-6 text-text-muted leading-relaxed text-lg">
                {vision.text}
              </p>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}

export function AboutValues() {
  return (
    <section className="py-20 md:py-32 bg-olive/5">
      <div className="container-premium">
        <FadeInUp className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Nuestros Valores
          </h2>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {values.map((value, i) => {
            const Icon = valueIcons[i % valueIcons.length];
            return (
              <StaggerItem key={value.title}>
                <div className="bg-white rounded-2xl p-5 md:p-6 text-center h-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-olive/10 mb-4">
                    <Icon className="h-5 w-5 text-olive" />
                  </div>
                  <h3 className="font-serif font-semibold text-sm md:text-base">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-xs text-text-muted leading-relaxed hidden md:block">
                    {value.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
