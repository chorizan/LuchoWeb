import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  AboutHero,
  AboutStory,
  AboutPhilosophy,
  AboutMissionVision,
  AboutValues,
} from "@/components/sections/about/about-intro";
import {
  AboutWhyChoose,
  AboutSalDeMaras,
  AboutPanela,
  AboutComparisons,
} from "@/components/sections/about/about-products";
import {
  AboutCommitment,
  AboutProcess,
  AboutQuality,
  AboutFAQ,
  AboutCTA,
} from "@/components/sections/about/about-closing";
import {
  AboutProductOrigins,
  AboutBocadillos,
  AboutGallery,
  AboutVideos,
} from "@/components/sections/about/about-extras";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce la historia, misión y valores de Dulce & Vida. Información confiable sobre panela orgánica, Sal de Maras y productos naturales peruanos.",
  openGraph: {
    title: `Nosotros | ${siteConfig.name}`,
    description:
      "Productos artesanales premium del Perú. Tradición, calidad y comercio responsable.",
    url: `${siteConfig.url}/nosotros`,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/nosotros`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `Nosotros — ${siteConfig.name}`,
  description: siteConfig.description,
  url: `${siteConfig.url}/nosotros`,
  mainEntity: {
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      contactType: "customer service",
    },
    address: siteConfig.contact.address
      ? {
          "@type": "PostalAddress",
          streetAddress: siteConfig.contact.address,
          addressCountry: "PE",
        }
      : undefined,
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.maps.coordinates.lat,
      longitude: siteConfig.maps.coordinates.lng,
    },
    hasMap: siteConfig.maps.url,
  },
};

export default function NosotrosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutHero />
      <AboutStory />
      <AboutPhilosophy />
      <AboutMissionVision />
      <AboutValues />
      <AboutWhyChoose />
      <AboutProductOrigins />
      <AboutSalDeMaras />
      <AboutPanela />
      <AboutBocadillos />
      <AboutComparisons />
      <AboutCommitment />
      <AboutProcess />
      <AboutGallery />
      <AboutVideos />
      <AboutQuality />
      <AboutFAQ />
      <AboutCTA />
    </>
  );
}
