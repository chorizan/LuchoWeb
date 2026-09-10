import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { orderStatusLabels } from "@/config/site";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: { include: { user: true } },
      address: true,
      items: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="p-8">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/admin/pedidos">Volver a pedidos</Link>
      </Button>

      <h1 className="font-serif text-3xl font-bold">{order.orderNumber}</h1>
      <p className="mt-2 text-text-muted">
        {orderStatusLabels[order.status] ?? order.status} ·{" "}
        {new Date(order.createdAt).toLocaleString("es-PE")}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-semibold">Cliente</h2>
          <p className="mt-3">{order.customer.user.name}</p>
          <p className="text-sm text-text-muted">{order.customer.user.email}</p>
          <p className="text-sm text-text-muted">{order.customer.phone}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-semibold">Entrega y pago</h2>
          <p className="mt-3 text-sm">{order.paymentMethod}</p>
          <p className="text-sm">{order.deliveryMethod}</p>
          {order.address && (
            <p className="mt-3 text-sm text-text-muted">
              {order.address.street}, {order.address.district}, {order.address.province}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-semibold">Productos</h2>
        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}× {item.name} ({item.sku})
              </span>
              <span className="font-medium">{formatPrice(Number(item.total))}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-beige-dark pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            <span>{formatPrice(Number(order.shippingCost))}</span>
          </div>
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
