import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ContactPageContent } from "@/components/sections/contact/contact-page-content";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos por WhatsApp, correo o formulario. Sal de Maras, panela y bocadillos artesanales del Perú.",
  openGraph: {
    title: `Contacto | ${siteConfig.name}`,
    description: siteConfig.description,
    url: `${siteConfig.url}/contacto`,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/contacto`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contacto — ${siteConfig.name}`,
  url: `${siteConfig.url}/contacto`,
  mainEntity: {
    "@type": "Organization",
    name: siteConfig.name,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    sameAs: [siteConfig.links.facebook, siteConfig.links.instagram],
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.maps.coordinates.lat,
      longitude: siteConfig.maps.coordinates.lng,
    },
    hasMap: siteConfig.maps.url,
  },
};

export default function ContactoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactPageContent />
    </>
  );
}
