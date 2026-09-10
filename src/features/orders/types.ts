import type { CartItem } from "@/types";
import type { CheckoutFormData } from "@/types";

export interface OrderData {
  orderNumber: string;
  createdAt: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export const DELIVERY_LABELS: Record<string, string> = {
  standard: "Envío estándar",
  express: "Envío express",
  pickup: "Recojo en tienda",
};

export const PAYMENT_LABELS: Record<string, string> = {
  transfer: "Transferencia bancaria",
  cash_on_delivery: "Pago contra entrega",
};
