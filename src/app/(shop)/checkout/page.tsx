"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CheckCircle, Download, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/features/cart/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatPrice, generateOrderNumber } from "@/lib/utils";
import { shippingCost } from "@/config/site";
import { FadeInUp } from "@/components/ui/motion";
import { downloadOrderPdf } from "@/features/orders/generate-order-pdf";
import { sendOrderToWhatsApp } from "@/features/orders/whatsapp";
import type { OrderData } from "@/features/orders/types";
import type { CartItem } from "@/types";
import { createOrderAction } from "@/actions/admin/orders";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "Nombre requerido"),
  lastName: z.string().min(2, "Apellido requerido"),
  email: z.string().email("Correo inválido"),
  phone: z.string().min(9, "Teléfono inválido"),
  street: z.string().min(5, "Dirección requerida"),
  district: z.string().min(2, "Distrito requerido"),
  province: z.string().min(2, "Provincia requerida"),
  department: z.string().min(2, "Departamento requerido"),
  reference: z.string().optional(),
  notes: z.string().optional(),
  deliveryMethod: z.enum(["pickup", "standard", "express"]),
  paymentMethod: z.enum(["transfer", "cash_on_delivery"]),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const ORDER_STORAGE_KEY = "last-order";

function calcShipping(
  deliveryMethod: CheckoutForm["deliveryMethod"],
  subtotal: number
): number {
  if (deliveryMethod === "pickup") return 0;
  if (deliveryMethod === "express") return shippingCost.express;
  return subtotal >= shippingCost.freeThreshold ? 0 : shippingCost.standard;
}

export default function CheckoutPage() {
  const hydrated = useHydrated();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const [confirmed, setConfirmed] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryMethod: "standard",
      paymentMethod: "transfer",
      department: "Lima",
    },
  });

  const deliveryMethod = watch("deliveryMethod");

  useEffect(() => {
    if (hydrated && items.length === 0 && !confirmed) {
      router.push("/carrito");
    }
  }, [hydrated, items.length, confirmed, router]);

  if (!hydrated) return null;

  if (items.length === 0 && !confirmed) {
    return null;
  }

  const subtotal = getSubtotal();
  const shipping = calcShipping(deliveryMethod, subtotal);
  const total = subtotal + shipping;

  const onSubmit = async (data: CheckoutForm) => {
    setSubmitError(null);
    const orderItems: CartItem[] = items.map((item) => ({ ...item }));
    const sub = getSubtotal();
    const ship = calcShipping(data.deliveryMethod, sub);

    const orderData: OrderData = {
      orderNumber: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      customer: data,
      items: orderItems,
      subtotal: sub,
      shipping: ship,
      total: sub + ship,
    };

    const result = await createOrderAction({
      orderNumber: orderData.orderNumber,
      customer: data,
      items: orderItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        sku: item.slug,
        price: item.salePrice ?? item.price,
        quantity: item.quantity,
      })),
      subtotal: sub,
      shippingCost: ship,
      total: sub + ship,
      paymentMethod: data.paymentMethod,
      deliveryMethod: data.deliveryMethod,
    });

    if (result?.error) {
      setSubmitError(result.error);
      return;
    }

    await new Promise((r) => setTimeout(r, 800));

    setOrder(orderData);
    setConfirmed(true);
    clearCart();

    sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orderData));

    downloadOrderPdf(orderData);
    sendOrderToWhatsApp(orderData);
  };

  if (confirmed && order) {
    return (
      <div className="container-premium py-24 md:py-32 text-center max-w-lg mx-auto">
        <FadeInUp>
          <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-olive/10 mb-6">
            <CheckCircle className="h-10 w-10 text-olive" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-3">
            ¡Pedido confirmado!
          </h1>
          <p className="text-text-muted mb-2">
            Tu pedido <strong>{order.orderNumber}</strong> ha sido registrado.
          </p>
          <p className="text-sm text-text-muted mb-8">
            Se descargó tu comprobante en PDF y se abrió WhatsApp para enviar
            los detalles. Te contactaremos pronto para confirmar pago y entrega.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button
              variant="olive"
              onClick={() => downloadOrderPdf(order)}
            >
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => sendOrderToWhatsApp(order)}
            >
              <MessageCircle className="h-4 w-4" />
              Reenviar por WhatsApp
            </Button>
          </div>

          <Button asChild>
            <Link href="/productos">Seguir comprando</Link>
          </Button>
        </FadeInUp>
      </div>
    );
  }

  return (
    <div className="container-premium py-24 md:py-32">
      <Link
        href="/carrito"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-olive transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al carrito
      </Link>

      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-10">
        Finalizar pedido
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12"
      >
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-semibold mb-6">
              Datos de contacto
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombre" error={errors.firstName?.message}>
                <Input {...register("firstName")} placeholder="Juan" />
              </Field>
              <Field label="Apellido" error={errors.lastName?.message}>
                <Input {...register("lastName")} placeholder="Pérez" />
              </Field>
              <Field label="Correo" error={errors.email?.message}>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="correo@ejemplo.com"
                />
              </Field>
              <Field label="Celular" error={errors.phone?.message}>
                <Input {...register("phone")} placeholder="999 999 999" />
              </Field>
            </div>
          </section>

          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-semibold mb-6">
              Dirección de entrega
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Dirección" error={errors.street?.message} className="sm:col-span-2">
                <Input {...register("street")} placeholder="Av. Principal 123" />
              </Field>
              <Field label="Distrito" error={errors.district?.message}>
                <Input {...register("district")} placeholder="Miraflores" />
              </Field>
              <Field label="Provincia" error={errors.province?.message}>
                <Input {...register("province")} placeholder="Lima" />
              </Field>
              <Field label="Departamento" error={errors.department?.message}>
                <Input {...register("department")} placeholder="Lima" />
              </Field>
              <Field label="Referencia" error={errors.reference?.message}>
                <Input {...register("reference")} placeholder="Opcional" />
              </Field>
            </div>
          </section>

          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-semibold mb-6">
              Entrega y pago
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Método de entrega</p>
                <div className="space-y-2">
                  {[
                    { value: "standard", label: "Envío estándar", price: shippingCost.standard },
                    { value: "express", label: "Envío express", price: shippingCost.express },
                    { value: "pickup", label: "Recojo en tienda", price: 0 },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-3 p-3 rounded-xl border border-beige-dark cursor-pointer hover:bg-beige/50 transition-colors has-[:checked]:border-olive has-[:checked]:bg-olive/5"
                    >
                      <input
                        type="radio"
                        {...register("deliveryMethod")}
                        value={opt.value}
                        className="accent-olive"
                      />
                      <span className="flex-1 text-sm">{opt.label}</span>
                      <span className="text-sm font-medium">
                        {opt.price === 0 ? "Gratis" : formatPrice(opt.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Método de pago</p>
                <div className="space-y-2">
                  {[
                    { value: "transfer", label: "Transferencia bancaria" },
                    { value: "cash_on_delivery", label: "Pago contra entrega" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-3 p-3 rounded-xl border border-beige-dark cursor-pointer hover:bg-beige/50 transition-colors has-[:checked]:border-olive has-[:checked]:bg-olive/5"
                    >
                      <input
                        type="radio"
                        {...register("paymentMethod")}
                        value={opt.value}
                        className="accent-olive"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Field label="Observaciones">
                <textarea
                  {...register("notes")}
                  rows={3}
                  placeholder="Instrucciones especiales para tu pedido..."
                  className="flex w-full rounded-2xl border border-beige-dark bg-white px-5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/30 resize-none"
                />
              </Field>
            </div>
          </section>
        </div>

        <div className="h-fit sticky top-24">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-semibold mb-6">
              Tu pedido
            </h2>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-sm"
                >
                  <span className="text-text-muted">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(
                      (item.salePrice ?? item.price) * item.quantity
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-beige-dark pt-4">
              <div className="flex justify-between">
                <span className="text-text-muted">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Envío</span>
                <span>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            {submitError && (
              <p className="mt-4 rounded-2xl border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
                {submitError}
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              className="w-full mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Confirmar pedido"}
            </Button>
            <p className="mt-3 text-xs text-text-muted text-center">
              Al confirmar se descargará un PDF y se enviará el pedido por WhatsApp.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-sale mt-1">{error}</p>}
    </div>
  );
}
