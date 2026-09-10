import Link from "next/link";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig, navLinks, getWhatsAppUrl, whatsappMessages } from "@/config/site";
import { BrandLogo } from "@/components/ui/brand-logo";
import { FadeInUp } from "@/components/ui/motion";

export function Footer() {
  return (
    <footer className="relative mt-20">
      <div className="w-full overflow-hidden leading-none rotate-180 -mb-px">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C360 80 720 0 1080 40C1260 60 1380 20 1440 40V80H0V40Z"
            fill="#556B2F"
            opacity="0.12"
          />
        </svg>
      </div>

      <div className="bg-cream pt-16 pb-8">
        <div className="container-premium">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            <FadeInUp>
              <BrandLogo variant="footer" href="/" className="mb-6" />
              <p className="text-sm text-text-muted leading-relaxed mb-6">
                {siteConfig.tagline}. Panela orgánica, Sal de Maras y productos
                artesanales seleccionados con calidad y origen peruano.
              </p>
            </FadeInUp>

            <FadeInUp delay={0.05}>
              <h3 className="font-serif text-xl font-semibold mb-6">
                Contáctanos
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-olive shrink-0 mt-0.5" />
                  {siteConfig.contact.address ? (
                    <span className="text-text-muted">{siteConfig.contact.address}</span>
                  ) : (
                    <a
                      href={siteConfig.maps.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-olive transition-colors"
                    >
                      {siteConfig.contact.addressPlaceholder}
                    </a>
                  )}
                </li>
                <li className="flex items-center gap-3 text-sm text-text-muted">
                  <Clock className="h-5 w-5 text-olive shrink-0" />
                  <span>{siteConfig.contact.hours}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Phone className="h-5 w-5 text-olive shrink-0" />
                  <a
                    href={siteConfig.links.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-olive transition-colors"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Mail className="h-5 w-5 text-olive shrink-0" />
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-text-muted hover:text-olive transition-colors break-all"
                  >
                    {siteConfig.contact.email}
                  </a>
                </li>
              </ul>
            </FadeInUp>

            <FadeInUp delay={0.1}>
              <h3 className="font-serif text-xl font-semibold mb-6">
                Enlaces
              </h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-olive transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button asChild variant="olive" size="sm">
                  <a
                    href={getWhatsAppUrl(whatsappMessages.general)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </Button>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.15}>
              <h3 className="font-serif text-xl font-semibold mb-6">
                Newsletter
              </h3>
              <p className="text-sm text-text-muted mb-4">
                Recibe novedades sobre Sal de Maras, panela y bocadillos artesanales.
              </p>
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1"
                />
                <Button type="submit" size="default">
                  Suscribirse
                </Button>
              </form>
            </FadeInUp>
          </div>

          <div className="mt-16 pt-8 border-t border-beige-dark">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <a
                  href={siteConfig.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-olive/10 hover:bg-olive/20 transition-colors text-olive text-xs font-semibold"
                  aria-label="Instagram"
                >
                  IG
                </a>
                <a
                  href={siteConfig.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-olive/10 hover:bg-olive/20 transition-colors text-olive text-xs font-semibold"
                  aria-label="Facebook"
                >
                  FB
                </a>
              </div>
              <p className="text-xs text-text-muted">
                © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <Link href="/contacto" className="hover:text-olive transition-colors">
                  Contacto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
