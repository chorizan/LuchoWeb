"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  MessageCircle,
  Send,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { VideoBackground } from "@/components/ui/video-background";
import {
  contactHero,
  contactInfo,
  socialLinks,
} from "@/constants/contact-content";
import {
  siteConfig,
  getWhatsAppUrl,
  whatsappMessages,
} from "@/config/site";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Correo inválido"),
  phone: z.string().min(9, "Teléfono inválido"),
  message: z.string().min(10, "Mensaje muy corto"),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactHero() {
  return (
    <section className="relative min-h-[50vh] flex items-end overflow-hidden pt-20">
      <div className="absolute inset-0">
        <VideoBackground
          src="/videos/nosotros-hero.mp4"
          poster="/products/sal-de-maras.png"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/25" />
      </div>
      <div className="container-premium relative z-10 pb-16 md:pb-20 pt-28">
        <FadeInUp>
          <span className="text-sm font-medium text-white/70 uppercase tracking-widest">
            Contacto
          </span>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-bold text-white max-w-2xl">
            {contactHero.title}
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-xl leading-relaxed">
            {contactHero.subtitle}
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#20BD5A] text-white border-0">
              <a
                href={getWhatsAppUrl(whatsappMessages.general)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                {contactHero.cta}
              </a>
            </Button>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

export function ContactInfoSection() {
  const icons = [Phone, Mail, Clock, MapPin];

  return (
    <section className="py-20 md:py-32">
      <div className="container-premium">
        <FadeInUp className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Información de contacto
          </h2>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((item, i) => {
            const Icon = icons[i];
            const content = (
              <div className="bg-white rounded-2xl p-6 shadow-sm h-full hover:shadow-md transition-shadow">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-olive/10 mb-4">
                  <Icon className="h-5 w-5 text-olive" />
                </div>
                <p className="text-xs font-medium text-olive uppercase tracking-wide mb-1">
                  {item.label}
                </p>
                <p
                  className={`text-sm leading-relaxed ${
                    item.isPlaceholder ? "text-text-muted italic" : "text-text font-medium"
                  }`}
                >
                  {item.value}
                </p>
              </div>
            );

            return (
              <StaggerItem key={item.label}>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="block h-full hover:-translate-y-1 transition-transform duration-300"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function ContactSocialSection() {
  return (
    <section className="py-16 bg-cream">
      <div className="container-premium text-center">
        <FadeInUp>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8">
            Síguenos en redes sociales
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-olive hover:text-white transition-all duration-300 text-sm font-medium"
              >
                {social.label}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

export function ContactMapSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container-premium">
        <FadeInUp className="mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Cómo llegar</h2>
          <p className="mt-3 text-text-muted max-w-lg">
            {siteConfig.maps.embedUrl
              ? "Encuéntranos en el mapa. También puedes abrir la ubicación en Google Maps para obtener indicaciones."
              : "Ubicación pendiente de configuración."}
          </p>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          {siteConfig.maps.embedUrl ? (
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden shadow-sm aspect-[16/9] md:aspect-[21/9]">
                <iframe
                  src={siteConfig.maps.embedUrl}
                  className="w-full h-full min-h-[300px] border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación en Google Maps"
                />
              </div>
              <div className="text-center">
                <a
                  href={siteConfig.maps.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-olive hover:underline"
                >
                  Abrir en Google Maps
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden bg-olive/5 border-2 border-dashed border-olive/20 aspect-[16/9] md:aspect-[21/9] flex flex-col items-center justify-center p-8 text-center">
              <MapPin className="h-12 w-12 text-olive/30 mb-4" />
              <p className="font-serif text-lg font-semibold text-olive">
                Google Maps — Pendiente de configuración
              </p>
              <p className="mt-2 text-sm text-text-muted max-w-md">
                El administrador podrá agregar la ubicación en Google Maps.
              </p>
              <p className="mt-4 text-xs text-text-muted">
                Dirección: {siteConfig.contact.addressPlaceholder}
              </p>
            </div>
          )}
        </FadeInUp>
      </div>
    </section>
  );
}

export function ContactFormSection() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactForm) => {
    const message = `Hola, soy ${data.name}.

📧 Correo: ${data.email}
📱 Teléfono: ${data.phone}

💬 Mensaje:
${data.message}

Enviado desde el formulario de contacto de ${siteConfig.name}.`;

    window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section className="py-20 md:py-32 bg-cream">
      <div className="container-premium max-w-2xl">
        <FadeInUp className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Envíanos un mensaje
          </h2>
          <p className="mt-3 text-text-muted">
            Completa el formulario y te responderemos a la brevedad por WhatsApp
            o correo electrónico.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-3xl p-6 md:p-10 shadow-sm space-y-5"
          >
            <Field label="Nombre" error={errors.name?.message}>
              <Input {...register("name")} placeholder="Tu nombre" />
            </Field>
            <Field label="Correo" error={errors.email?.message}>
              <Input
                {...register("email")}
                type="email"
                placeholder="tu@correo.com"
              />
            </Field>
            <Field label="Teléfono" error={errors.phone?.message}>
              <Input {...register("phone")} placeholder="960 929 243" />
            </Field>
            <Field label="Mensaje" error={errors.message?.message}>
              <textarea
                {...register("message")}
                rows={5}
                placeholder="Cuéntanos qué productos te interesan..."
                className="flex w-full rounded-2xl border border-beige-dark bg-white px-5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/30 resize-none"
              />
            </Field>

            {sent && (
              <p className="text-sm text-olive bg-olive/10 rounded-xl px-4 py-3 text-center">
                Mensaje enviado. Se abrió WhatsApp para completar el contacto.
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              <Send className="h-4 w-4" />
              {isSubmitting ? "Enviando..." : "Enviar mensaje"}
            </Button>
          </form>
        </FadeInUp>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-sale mt-1">{error}</p>}
    </div>
  );
}
