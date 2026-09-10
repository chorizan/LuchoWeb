import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { orderStatusLabels } from "@/config/site";
import { updateOrderStatusAction } from "@/actions/admin/orders";
import { Button } from "@/components/ui/button";

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    include: {
      customer: { include: { user: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-bold">Pedidos</h1>
      <p className="mt-1 mb-8 text-text-muted">
        Gestiona pedidos realizados desde la web.
      </p>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-text-muted shadow-sm">
            Aún no hay pedidos registrados en la base de datos.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-beige-dark bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-text-muted">
                    {order.customer.user.name ?? order.customer.user.email}
                  </p>
                  <p className="text-sm text-text-muted">
                    {new Date(order.createdAt).toLocaleString("es-PE")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(Number(order.total))}</p>
                  <p className="text-sm text-text-muted">
                    {orderStatusLabels[order.status] ?? order.status}
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-1 text-sm text-text-muted">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity}× {item.name} — {formatPrice(Number(item.total))}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/pedidos/${order.id}`}>Ver detalle</Link>
                </Button>
                {(["CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"] as const).map(
                  (status) => (
                    <form key={status} action={updateOrderStatusAction.bind(null, order.id, status)}>
                      <Button size="sm" variant="outline" type="submit">
                        {orderStatusLabels[status]}
                      </Button>
                    </form>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
