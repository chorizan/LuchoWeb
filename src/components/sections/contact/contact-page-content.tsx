"use client";

import {
  ContactHero,
  ContactInfoSection,
  ContactSocialSection,
  ContactMapSection,
  ContactFormSection,
} from "@/components/sections/contact/contact-sections";

export function ContactPageContent() {
  return (
    <>
      <ContactHero />
      <ContactInfoSection />
      <ContactSocialSection />
      <ContactMapSection />
      <ContactFormSection />
    </>
  );
}
