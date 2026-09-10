import { siteConfig } from "@/config/site";

export const contactHero = {
  title: "Hablemos",
  subtitle:
    "Estamos aquí para ayudarte. Escríbenos por WhatsApp, correo o completa el formulario. Te respondemos con la atención personalizada que mereces.",
  cta: "Escríbenos por WhatsApp",
};

export const contactInfo = [
  {
    label: "Teléfono / WhatsApp",
    value: siteConfig.contact.phone,
    href: siteConfig.links.whatsapp,
    external: true,
  },
  {
    label: "Correo electrónico",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    external: false,
  },
  {
    label: "Horario de atención",
    value: siteConfig.contact.hours,
    href: null,
    external: false,
  },
  {
    label: "Ubicación",
    value: siteConfig.contact.address ?? siteConfig.contact.addressPlaceholder,
    href: siteConfig.contact.address
      ? null
      : siteConfig.maps.url,
    external: true,
    isPlaceholder: !siteConfig.contact.address,
  },
];

export const socialLinks = [
  {
    name: "Facebook",
    href: siteConfig.links.facebook,
    label: "Facebook",
  },
  {
    name: "Instagram",
    href: siteConfig.links.instagram,
    label: "Instagram",
  },
  {
    name: "WhatsApp",
    href: siteConfig.links.whatsapp,
    label: "WhatsApp",
  },
];
