"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Boxes,
  CalendarDays,
  Filter,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type {
  DashboardAnalytics,
  DashboardFilterOptions,
  DashboardPeriod,
} from "@/lib/admin/queries";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";

interface AdminDashboardProps {
  data: DashboardAnalytics;
  filter: DashboardFilterOptions;
}

const PERIOD_OPTIONS: Array<{ value: DashboardPeriod; label: string }> = [
  { value: "7d", label: "7 días" },
  { value: "30d", label: "30 días" },
  { value: "90d", label: "90 días" },
  { value: "3m", label: "3 meses" },
  { value: "6m", label: "6 meses" },
  { value: "12m", label: "12 meses" },
  { value: "all", label: "Todo" },
];

function AnimatedBar({
  value,
  max,
  delay = 0,
  className = "bg-olive",
}: {
  value: number;
  max: number;
  delay?: number;
  className?: string;
}) {
  const width = max > 0 ? Math.max((value / max) * 100, value > 0 ? 8 : 0) : 0;

  return (
    <div className="h-3 overflow-hidden rounded-full bg-beige-dark/40">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        className={`h-full rounded-full ${className}`}
      />
    </div>
  );
}

export function AdminDashboard({ data, filter }: AdminDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [fromDate, setFromDate] = useState(filter.from ?? "");
  const [toDate, setToDate] = useState(filter.to ?? "");

  const activePeriod = filter.from || filter.to ? null : (filter.period ?? "6m");
  const hasStaleDateFilter =
    Boolean(filter.from || filter.to) &&
    data.grossRevenueInPeriod === 0 &&
    data.revenue > 0;

  const applySearch = (params: URLSearchParams) => {
    startTransition(() => {
      const query = params.toString();
      router.replace(query ? `/admin?${query}` : "/admin");
    });
  };

  const setPeriod = (period: DashboardPeriod) => {
    const params = new URLSearchParams();
    params.set("period", period);
    applySearch(params);
  };

  const applyCustomRange = () => {
    if (!fromDate && !toDate) return;
    const params = new URLSearchParams();
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);
    applySearch(params);
  };

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    applySearch(new URLSearchParams());
  };

  const summaryCards = useMemo(
    () => [
      { label: "Productos totales", value: String(data.totalProducts), icon: Package },
      { label: "Productos activos", value: String(data.activeProducts), icon: Package },
      { label: "Agotados", value: String(data.outOfStock), icon: AlertTriangle },
      { label: "Bajo stock", value: String(data.lowStock), icon: Boxes },
      { label: "Pedidos pendientes", value: String(data.pendingOrders), icon: ShoppingCart },
      { label: "Ventas totales", value: formatPrice(data.revenue), icon: Wallet },
    ],
    [data]
  );

  const financeCards = [
    {
      label: "Ingresos del periodo",
      value: formatPrice(data.grossRevenueInPeriod),
      hint: data.periodLabel,
      icon: TrendingUp,
    },
    {
      label: "Ticket promedio",
      value: formatPrice(data.averageOrderValue),
      hint: `${data.totalOrders} pedido${data.totalOrders === 1 ? "" : "s"} en el periodo`,
      icon: Wallet,
    },
    {
      label: "Unidades vendidas",
      value: String(data.totalUnitsSold),
      hint: "En el rango seleccionado",
      icon: ShoppingCart,
    },
  ];

  const maxTimelineRevenue = Math.max(
    ...data.salesTimeline.map((item) => item.revenue),
    data.salesTimeline.length > 0 ? 0 : 1
  );
  const maxProductSales = Math.max(...data.topProducts.map((item) => item.quantitySold), 1);

  return (
    <div className="p-8">
      <FadeInUp className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-text-muted">
            Finanzas, producción y rendimiento de ventas de la tienda.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="h-4 w-4" />
            Agregar producto
          </Link>
        </Button>
      </FadeInUp>

      <FadeInUp delay={0.05}>
        <section className="mb-8 rounded-3xl border border-beige-dark bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Filter className="h-5 w-5 text-olive" />
            <div>
              <h2 className="font-serif text-lg font-semibold">Filtrar por periodo</h2>
              <p className="text-sm text-text-muted">
                Mostrando: <span className="font-medium text-text">{data.periodLabel}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant={activePeriod === option.value ? "default" : "outline"}
                disabled={pending}
                onClick={() => setPeriod(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
            <Input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              aria-label="Desde"
            />
            <Input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              aria-label="Hasta"
            />
            <Button type="button" variant="outline" disabled={pending} onClick={applyCustomRange}>
              Aplicar rango
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={pending || (!searchParams.toString() && !fromDate && !toDate)}
              onClick={clearFilters}
            >
              Limpiar
            </Button>
          </div>
        </section>
      </FadeInUp>

      {hasStaleDateFilter && (
        <FadeInUp delay={0.06}>
          <div className="mb-8 rounded-3xl border border-amber-300 bg-amber-50 px-6 py-4 text-sm text-amber-900">
            Hay ventas registradas ({formatPrice(data.revenue)} en total), pero el rango de
            fechas seleccionado no incluye ninguna.{" "}
            <button
              type="button"
              className="font-semibold underline underline-offset-2"
              onClick={clearFilters}
            >
              Limpiar filtro y ver ventas recientes
            </button>
          </div>
        </FadeInUp>
      )}

      <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <StaggerItem key={label}>
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border border-beige-dark bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-muted">{label}</p>
                <Icon className="h-5 w-5 text-olive" />
              </div>
              <p className="mt-3 font-serif text-3xl font-bold">{value}</p>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <StaggerContainer className="mt-8 grid gap-4 md:grid-cols-3">
        {financeCards.map(({ label, value, hint, icon: Icon }, index) => (
          <StaggerItem key={label}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
              className="rounded-3xl bg-olive p-6 text-white shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/80">{label}</p>
                <Icon className="h-5 w-5 text-white/90" />
              </div>
              <p className="mt-3 font-serif text-3xl font-bold">{value}</p>
              <p className="mt-2 text-xs text-white/75">{hint}</p>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <FadeInUp delay={0.1}>
          <section className="rounded-3xl border border-beige-dark bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-olive" />
              <div>
                <h2 className="font-serif text-xl font-semibold">{data.timelineLabel}</h2>
                <p className="text-sm text-text-muted">{data.periodLabel}</p>
              </div>
            </div>

            <div className="space-y-4">
              {data.salesTimeline.length === 0 ? (
                <p className="text-sm text-text-muted">
                  No hay ventas registradas en este periodo.
                </p>
              ) : (
                data.salesTimeline.map((item, index) => (
                  <div key={item.key}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-text-muted">
                        {formatPrice(item.revenue)} · {item.orders} pedido
                        {item.orders === 1 ? "" : "s"}
                      </span>
                    </div>
                    <AnimatedBar
                      value={item.revenue}
                      max={maxTimelineRevenue}
                      delay={0.15 + index * 0.08}
                    />
                  </div>
                ))
              )}
            </div>
          </section>
        </FadeInUp>

        <FadeInUp delay={0.15}>
          <section className="rounded-3xl border border-beige-dark bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <Package className="h-5 w-5 text-olive" />
              <div>
                <h2 className="font-serif text-xl font-semibold">Productos más vendidos</h2>
                <p className="text-sm text-text-muted">{data.periodLabel}</p>
              </div>
            </div>

            {data.topProducts.length === 0 ? (
              <p className="text-sm text-text-muted">No hay ventas en este periodo.</p>
            ) : (
              <div className="space-y-5">
                {data.topProducts.map((product, index) => (
                  <div key={product.productId}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{product.name}</p>
                        <p className="text-text-muted">
                          {product.quantitySold} uds · {formatPrice(product.revenue)}
                        </p>
                      </div>
                      <span className="rounded-full bg-beige px-2.5 py-1 text-xs font-semibold text-olive">
                        #{index + 1}
                      </span>
                    </div>
                    <AnimatedBar
                      value={product.quantitySold}
                      max={maxProductSales}
                      delay={0.2 + index * 0.08}
                      className="bg-sale"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </FadeInUp>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <FadeInUp delay={0.2} className="xl:col-span-1">
          <section className="h-full rounded-3xl border border-beige-dark bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-olive" />
              <div>
                <h2 className="font-serif text-xl font-semibold">Mejor día de ventas</h2>
                <p className="text-sm text-text-muted">{data.periodLabel}</p>
              </div>
            </div>

            {data.bestSalesDay ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="rounded-2xl bg-beige/50 p-5"
              >
                <p className="font-semibold capitalize">{data.bestSalesDay.label}</p>
                <p className="mt-3 font-serif text-3xl font-bold text-olive">
                  {formatPrice(data.bestSalesDay.revenue)}
                </p>
                <p className="mt-2 text-sm text-text-muted">
                  {data.bestSalesDay.orders} pedido
                  {data.bestSalesDay.orders === 1 ? "" : "s"} ese día
                </p>
              </motion.div>
            ) : (
              <p className="text-sm text-text-muted">No hay ventas en este periodo.</p>
            )}
          </section>
        </FadeInUp>

        <FadeInUp delay={0.25} className="xl:col-span-2">
          <section className="rounded-3xl border border-beige-dark bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <Boxes className="h-5 w-5 text-olive" />
              <div>
                <h2 className="font-serif text-xl font-semibold">Producción y catálogo</h2>
                <p className="text-sm text-text-muted">
                  Productos que vendemos, stock disponible y precio
                </p>
              </div>
            </div>

            {data.catalogProducts.length === 0 ? (
              <p className="text-sm text-text-muted">No hay productos en catálogo.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-text-muted">
                    <tr>
                      <th className="pb-3 pr-4">Producto</th>
                      <th className="pb-3 pr-4">Stock</th>
                      <th className="pb-3 pr-4">Estado</th>
                      <th className="pb-3">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.catalogProducts.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                        className="border-t border-beige-dark/70"
                      >
                        <td className="py-3 pr-4 font-medium">{product.name}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={
                              product.stock === 0
                                ? "text-sale"
                                : product.stock <= 10
                                  ? "text-amber-700"
                                  : "text-olive"
                            }
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="rounded-full bg-beige px-2.5 py-1 text-xs font-medium">
                            {product.status === "PUBLISHED" ? "Publicado" : product.status}
                          </span>
                        </td>
                        <td className="py-3">{formatPrice(product.price)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </FadeInUp>
      </div>
    </div>
  );
}
