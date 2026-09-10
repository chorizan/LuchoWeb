import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";
import type { OrderData } from "./types";
import { DELIVERY_LABELS, PAYMENT_LABELS } from "./types";

export function formatOrderWhatsAppMessage(order: OrderData): string {
  const lines = [
    `🛒 *NUEVO PEDIDO — ${siteConfig.name}*`,
    ``,
    `📋 *Pedido:* ${order.orderNumber}`,
    `📅 *Fecha:* ${new Date(order.createdAt).toLocaleString("es-PE")}`,
    ``,
    `👤 *CLIENTE*`,
    `• Nombre: ${order.customer.firstName} ${order.customer.lastName}`,
    `• Correo: ${order.customer.email}`,
    `• Celular: ${order.customer.phone}`,
    ``,
    `📍 *ENTREGA*`,
    `• ${order.customer.street}`,
    `• ${order.customer.district}, ${order.customer.province}`,
    `• ${order.customer.department}`,
  ];

  if (order.customer.reference) {
    lines.push(`• Ref: ${order.customer.reference}`);
  }

  lines.push(
    ``,
    `📦 *PRODUCTOS*`,
    ...order.items.map((item) => {
      const price = item.salePrice ?? item.price;
      return `• ${item.name} × ${item.quantity} — ${formatPrice(price * item.quantity)}`;
    }),
    ``,
    `💰 *RESUMEN*`,
    `• Subtotal: ${formatPrice(order.subtotal)}`,
    `• Envío: ${order.shipping === 0 ? "Gratis" : formatPrice(order.shipping)}`,
    `• *TOTAL: ${formatPrice(order.total)}*`,
    ``,
    `🚚 Entrega: ${DELIVERY_LABELS[order.customer.deliveryMethod]}`,
    `💳 Pago: ${PAYMENT_LABELS[order.customer.paymentMethod]}`
  );

  if (order.customer.notes) {
    lines.push(``, `📝 *Observaciones:* ${order.customer.notes}`);
  }

  return lines.join("\n");
}

export function sendOrderToWhatsApp(order: OrderData): void {
  const message = formatOrderWhatsAppMessage(order);
  const phone = siteConfig.orders.whatsapp.replace(/\D/g, "");
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function getWhatsAppOrderUrl(order: OrderData): string {
  const message = formatOrderWhatsAppMessage(order);
  const phone = siteConfig.orders.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
