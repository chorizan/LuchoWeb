import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { CustomerCreateForm } from "@/components/admin/customer-create-form";
import { CustomerTable } from "@/components/admin/customer-table";

export default async function AdminCustomersPage() {
  await requireAdmin();

  const customersRaw = await prisma.customer.findMany({
    include: {
      user: true,
      orders: {
        select: { total: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const customers = customersRaw
    .map((customer) => {
      const totalSpent = customer.orders.reduce(
        (sum, order) => sum + Number(order.total),
        0
      );

      return {
        id: customer.id,
        name: customer.user.name ?? "—",
        email: customer.user.email,
        phone: customer.phone,
        orderCount: customer.orders.length,
        totalSpent,
        lastOrderAt: customer.orders[0]?.createdAt.toISOString() ?? null,
        isTopBuyer: false,
      };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent || b.orderCount - a.orderCount);

  if (customers.length > 0 && customers[0].totalSpent > 0) {
    customers[0].isTopBuyer = true;
  }

  const totalSales = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const activeBuyers = customers.filter((customer) => customer.orderCount > 0).length;
  const topBuyer = customers.find((customer) => customer.totalSpent > 0) ?? null;

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Clientes</h1>
          <p className="mt-1 text-text-muted">
            Usuarios registrados y clientes con pedidos. Ordenados por compras totales.
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-text-muted">Clientes registrados</p>
          <p className="mt-2 text-2xl font-bold">{customers.length}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-text-muted">Ventas totales</p>
          <p className="mt-2 text-2xl font-bold">{formatPrice(totalSales)}</p>
          <p className="mt-1 text-xs text-text-muted">
            {activeBuyers} cliente{activeBuyers === 1 ? "" : "s"} con compras
          </p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-text-muted">Cliente que más compra</p>
          {topBuyer ? (
            <>
              <p className="mt-2 text-lg font-semibold">{topBuyer.name}</p>
              <p className="text-sm text-text-muted">
                {formatPrice(topBuyer.totalSpent)} · {topBuyer.orderCount} pedido
                {topBuyer.orderCount === 1 ? "" : "s"}
              </p>
            </>
          ) : (
            <p className="mt-2 text-lg font-semibold text-text-muted">Sin compras aún</p>
          )}
        </div>
      </div>

      <CustomerCreateForm />

      <div className="overflow-hidden rounded-3xl border border-beige-dark bg-white shadow-sm">
        <CustomerTable customers={customers} />
      </div>
    </div>
  );
}
