"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/ui/motion";
import {
  productOrigins,
  gallery,
  videos,
  bocadillos,
} from "@/constants/about-content";

export function AboutProductOrigins() {
  return (
    <section className="py-20 md:py-32">
      <div className="container-premium">
        <FadeInUp className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-medium text-olive uppercase tracking-widest">
            Origen
          </span>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl font-bold">
            Origen de nuestros productos
          </h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            Tres pilares de la gastronomía artesanal peruana, seleccionados por
            su calidad, tradición y trazabilidad.
          </p>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {productOrigins.map((item) => (
            <StaggerItem key={item.id}>
              <ScaleOnHover>
                <Link
                  href={item.href}
                  className="group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow h-full"
                >
                  <div className="relative aspect-[4/3] bg-gray-light">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold group-hover:text-olive transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-text-muted leading-relaxed">
                      {item.summary}
                    </p>
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

export function AboutBocadillos() {
  return (
    <section id="bocadillos" className="py-20 md:py-32 bg-cream scroll-mt-24">
      <div className="container-premium">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeInUp>
            <span className="text-sm font-medium text-olive uppercase tracking-widest">
              Dulzor tradicional
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-bold">
              {bocadillos.title}
            </h2>
            <p className="mt-2 text-lg text-olive font-medium">{bocadillos.subtitle}</p>
            <p className="mt-6 text-text-muted leading-relaxed">{bocadillos.what}</p>
            <p className="mt-4 text-text-muted leading-relaxed">{bocadillos.origin}</p>
            <ul className="mt-6 space-y-2">
              {bocadillos.characteristics.map((c) => (
                <li key={c} className="flex gap-2 text-sm text-text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-olive shrink-0 mt-2" />
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-text-muted italic">{bocadillos.responsible}</p>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-lg">
              <Image
                src={bocadillos.image}
                alt="Bocadillos artesanales — imagen referencial"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <span className="absolute top-4 left-4 text-xs bg-black/60 text-white px-3 py-1 rounded-full">
                Imagen referencial
              </span>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}

export function AboutGallery() {
  return (
    <section className="py-20 md:py-32 bg-olive/5">
      <div className="container-premium">
        <FadeInUp className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Galería</h2>
          <p className="mt-4 text-text-muted max-w-lg mx-auto">
            Un vistazo a nuestros productos, orígenes y la belleza del Perú
            artesanal. Las imágenes marcadas como referenciales serán reemplazadas.
          </p>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {gallery.map((item, i) => (
            <StaggerItem key={i}>
              <div className="group relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-white shadow-sm">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-3 left-3 right-3 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </span>
                {item.label.includes("Referencial") && (
                  <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                    Referencial
                  </span>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function AboutVideos() {
  return (
    <section className="py-20 md:py-32">
      <div className="container-premium">
        <FadeInUp className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Videos</h2>
          <p className="mt-4 text-text-muted max-w-lg mx-auto">
            Conoce nuestra historia, procesos y productos. Los espacios marcados
            están listos para incorporar videos propios.
          </p>
        </FadeInUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {videos.map((video, i) => (
            <FadeInUp key={video.id} delay={i * 0.08}>
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm h-full">
                <div className="relative aspect-video bg-gray-light">
                  {video.src ? (
                    <video
                      src={video.src}
                      poster={video.poster}
                      controls
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-olive/5">
                      <Image
                        src={video.poster}
                        alt={video.title}
                        fill
                        className="object-cover opacity-40"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="relative z-10 flex flex-col items-center gap-2 text-text-muted">
                        <ImageIcon className="h-10 w-10 text-olive/40" />
                        <span className="text-xs font-medium bg-white/90 px-3 py-1 rounded-full">
                          Video pendiente
                        </span>
                      </div>
                    </div>
                  )}
                  {video.isPlaceholder && (
                    <span className="absolute top-3 left-3 text-xs bg-olive text-white px-3 py-1 rounded-full">
                      Placeholder
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold">{video.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">{video.description}</p>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
