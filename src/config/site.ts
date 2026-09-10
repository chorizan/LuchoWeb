export const siteConfig = {
  name: "Dulce & Vida",
  tagline: "Productos Naturales",
  logo: "/brand/logo-dulce-vida.png",
  icon: "/brand/icons/icon-32.png",
  icons: {
    favicon: "/favicon.ico",
    icon16: "/brand/icons/icon-16.png",
    icon32: "/brand/icons/icon-32.png",
    icon48: "/brand/icons/icon-48.png",
    icon192: "/brand/icons/icon-192.png",
    icon512: "/brand/icons/icon-512.png",
    apple: "/brand/icons/apple-icon.png",
  },
  description:
    "Productos naturales premium del Perú. Panela orgánica, Sal de Maras y selección artesanal con calidad, origen y tradición.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/og-image.jpg",
  links: {
    instagram: "https://www.instagram.com/_ceviche777/",
    facebook: "https://www.facebook.com/uriel.abdiel.2025",
    whatsapp: "https://wa.me/51960929243",
  },
  contact: {
    email: "urielabdiel1234@gmail.com",
    phone: "+51 960 929 243",
    phoneRaw: "960929243",
    address: null as string | null,
    addressPlaceholder: "Ver ubicación en Google Maps",
    hours: "Lun - Sáb: 9:00 - 20:00",
  },
  orders: {
    whatsapp: "51960929243",
  },
  maps: {
    url: "https://www.google.com/maps?q=-12.0180547,-76.9564786&z=17&hl=es",
    embedUrl:
      "https://www.google.com/maps?q=-12.0180547,-76.9564786&z=17&hl=es&output=embed",
    coordinates: {
      lat: -12.0180547,
      lng: -76.9564786,
    },
  },
} as const;

export const whatsappMessages = {
  general: `Hola.

Me interesa conocer más sobre sus productos artesanales.

Quisiera información sobre:
• Sal de Maras
• Panela
• Bocadillos

Muchas gracias.`,
} as const;

export function getWhatsAppUrl(message: string): string {
  const phone = siteConfig.orders.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/categorias", label: "Categorías" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const adminNavLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/inventario", label: "Inventario" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/contenido", label: "Contenido" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/configuracion", label: "Configuración" },
] as const;

export const shippingCost = {
  standard: 15,
  express: 25,
  freeThreshold: 200,
} as const;

export const orderStatusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PREPARING: "Preparando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};
