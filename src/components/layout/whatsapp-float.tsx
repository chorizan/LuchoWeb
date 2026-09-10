"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig, getWhatsAppUrl, whatsappMessages } from "@/config/site";

export function WhatsAppFloat() {
  return (
    <motion.a
      href={getWhatsAppUrl(whatsappMessages.general)}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.4 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl transition-shadow"
      aria-label={`Contactar por WhatsApp al ${siteConfig.contact.phone}`}
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </motion.a>
  );
}
