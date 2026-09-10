import { prisma } from "@/lib/prisma";

export interface TopProductStat {
  productId: string;
  name: string;
  quantitySold: number;
  revenue: number;
}

export interface MonthlyRevenueStat {
  key: string;
  label: string;
  revenue: number;
  orders: number;
}

export interface DashboardAnalytics {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  lowStock: number;
  pendingOrders: number;
  totalOrders: number;
  revenue: number;
  grossRevenueInPeriod: number;
  totalUnitsSold: number;
  averageOrderValue: number;
  topProducts: TopProductStat[];
  salesTimeline: MonthlyRevenueStat[];
  timelineMode: "day" | "month";
  timelineLabel: string;
  periodLabel: string;
  bestSalesDay: {
    date: string;
    label: string;
    revenue: number;
    orders: number;
  } | null;
  catalogProducts: Array<{
    id: string;
    name: string;
    stock: number;
    status: string;
    price: number;
  }>;
}

export type DashboardPeriod =
  | "7d"
  | "30d"
  | "90d"
  | "3m"
  | "6m"
  | "12m"
  | "all";

export interface DashboardFilterOptions {
  period?: DashboardPeriod;
  from?: string;
  to?: string;
}

const MONTH_LABELS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(key: string) {
  const [year, month] = key.split("-");
  const monthIndex = Number(month) - 1;
  return `${MONTH_LABELS[monthIndex] ?? month} ${year}`;
}

function buildRecentMonthKeys(months = 6, endDate = new Date()) {
  const keys: string[] = [];

  for (let i = months - 1; i >= 0; i -= 1) {
    const date = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
    keys.push(getMonthKey(date));
  }

  return keys;
}

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function endOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
}

function getDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getDayLabel(key: string, includeYear = false) {
  return new Date(`${key}T12:00:00`).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    ...(includeYear ? { year: "numeric" } : {}),
  });
}

function buildRecentDayKeys(days: number, endDate = new Date()) {
  const keys: string[] = [];
  const end = startOfDay(endDate);

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(end);
    date.setDate(end.getDate() - i);
    keys.push(getDayKey(date));
  }

  return keys;
}

export function parseDashboardFilter(params: {
  period?: string;
  from?: string;
  to?: string;
}): DashboardFilterOptions {
  const allowed: DashboardPeriod[] = ["7d", "30d", "90d", "3m", "6m", "12m", "all"];
  const period = allowed.includes(params.period as DashboardPeriod)
    ? (params.period as DashboardPeriod)
    : "6m";

  return {
    period: params.from || params.to ? undefined : period,
    from: params.from,
    to: params.to,
  };
}

function resolveDateRange(filter?: DashboardFilterOptions) {
  const end = filter?.to ? endOfDay(new Date(filter.to)) : endOfDay(new Date());

  if (filter?.from) {
    return {
      start: startOfDay(new Date(filter.from)),
      end,
      period: undefined as DashboardPeriod | undefined,
      isCustom: true,
    };
  }

  const period = filter?.period ?? "6m";
  if (period === "all") {
    return { start: null, end, period, isCustom: false };
  }

  const start = new Date(end);

  if (period.endsWith("d")) {
    const days = Number(period.replace("d", ""));
    start.setDate(end.getDate() - (days - 1));
    return { start: startOfDay(start), end, period, isCustom: false };
  }

  const months = Number(period.replace("m", ""));
  start.setMonth(end.getMonth() - (months - 1), 1);
  return { start: startOfDay(start), end, period, isCustom: false };
}

function getPeriodLabel(filter?: DashboardFilterOptions) {
  if (filter?.from) {
    const fromLabel = new Date(filter.from).toLocaleDateString("es-PE");
    const toLabel = filter.to
      ? new Date(filter.to).toLocaleDateString("es-PE")
      : "hoy";
    return `${fromLabel} - ${toLabel}`;
  }

  const labels: Record<DashboardPeriod, string> = {
    "7d": "Últimos 7 días",
    "30d": "Últimos 30 días",
    "90d": "Últimos 90 días",
    "3m": "Últimos 3 meses",
    "6m": "Últimos 6 meses",
    "12m": "Últimos 12 meses",
    all: "Todo el historial",
  };

  return labels[filter?.period ?? "6m"];
}


export async function getSetting(key: string, fallback = "") {
  try {
    const setting = await prisma.settings.findUnique({ where: { key } });
    return setting?.value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getJsonSetting<T>(key: string, fallback: T): Promise<T> {
  const raw = await getSetting(key, "");
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function getAllSettingsMap() {
  try {
    const rows = await prisma.settings.findMany();
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  } catch {
    return {};
  }
}

export async function getDashboardStats() {
  const analytics = await getDashboardAnalytics();
  return {
    totalProducts: analytics.totalProducts,
    activeProducts: analytics.activeProducts,
    outOfStock: analytics.outOfStock,
    lowStock: analytics.lowStock,
    pendingOrders: analytics.pendingOrders,
    totalOrders: analytics.totalOrders,
    revenue: analytics.revenue,
  };
}

export async function getDashboardAnalytics(
  filter?: DashboardFilterOptions
): Promise<DashboardAnalytics> {
  const range = resolveDateRange(filter);
  const periodLabel = getPeriodLabel(filter);
  const useDailyTimeline =
    range.period === "7d" ||
    range.period === "30d" ||
    (range.isCustom &&
      range.start &&
      (range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24) <= 31);

  const timelineMonths =
    range.period === "3m" ? 3 : range.period === "12m" ? 12 : 6;

  const emptyTimeline = useDailyTimeline
    ? buildRecentDayKeys(range.period === "7d" ? 7 : 30, range.end).map((key) => ({
        key,
        label: getDayLabel(key),
        revenue: 0,
        orders: 0,
      }))
    : buildRecentMonthKeys(
        range.period === "all" ? 6 : timelineMonths,
        range.end
      ).map((key) => ({
        key,
        label: getMonthLabel(key),
        revenue: 0,
        orders: 0,
      }));

  const empty: DashboardAnalytics = {
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
    lowStock: 0,
    pendingOrders: 0,
    totalOrders: 0,
    revenue: 0,
    grossRevenueInPeriod: 0,
    totalUnitsSold: 0,
    averageOrderValue: 0,
    topProducts: [],
    salesTimeline: emptyTimeline,
    timelineMode: useDailyTimeline ? "day" : "month",
    timelineLabel: useDailyTimeline ? "Ventas por día" : "Ventas por mes",
    periodLabel,
    bestSalesDay: null,
    catalogProducts: [],
  };

  try {
    const orderDateFilter =
      range.start || range.end
        ? {
            createdAt: {
              ...(range.start ? { gte: range.start } : {}),
              lte: range.end,
            },
          }
        : {};

    const [
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      pendingOrders,
      filteredOrders,
      orderItems,
      products,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "PUBLISHED" } }),
      prisma.product.count({ where: { stock: 0 } }),
      prisma.product.count({ where: { stock: { gt: 0, lte: 10 } } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.findMany({
        where: {
          status: { not: "CANCELLED" },
          ...orderDateFilter,
        },
        select: { id: true, total: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.orderItem.findMany({
        where: {
          order: {
            status: { not: "CANCELLED" },
            ...orderDateFilter,
          },
        },
        select: {
          productId: true,
          name: true,
          quantity: true,
          total: true,
        },
      }),
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          stock: true,
          status: true,
          price: true,
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        take: 8,
      }),
    ]);

    const totalOrders = filteredOrders.length;
    const grossRevenueInPeriod = filteredOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );
    const totalUnitsSold = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const averageOrderValue = totalOrders > 0 ? grossRevenueInPeriod / totalOrders : 0;

    const productMap = new Map<string, TopProductStat>();
    for (const item of orderItems) {
      const current = productMap.get(item.productId) ?? {
        productId: item.productId,
        name: item.name,
        quantitySold: 0,
        revenue: 0,
      };
      current.quantitySold += item.quantity;
      current.revenue += Number(item.total);
      productMap.set(item.productId, current);
    }

    const topProducts = [...productMap.values()]
      .sort((a, b) => b.quantitySold - a.quantitySold || b.revenue - a.revenue)
      .slice(0, 5);

    let timelineKeys: string[] = [];
    if (useDailyTimeline) {
      if (range.isCustom && range.start) {
        const days =
          Math.floor(
            (range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;
        timelineKeys = buildRecentDayKeys(Math.min(Math.max(days, 1), 31), range.end);
      } else {
        timelineKeys = buildRecentDayKeys(range.period === "7d" ? 7 : 30, range.end);
      }
    } else if (range.period === "all") {
      const monthSet = new Set(filteredOrders.map((order) => getMonthKey(order.createdAt)));
      timelineKeys =
        monthSet.size > 0
          ? [...monthSet].sort()
          : buildRecentMonthKeys(6, range.end);
    } else {
      timelineKeys = buildRecentMonthKeys(timelineMonths, range.end);
    }

    const timelineMap = new Map<string, { revenue: number; orders: number }>();
    for (const key of timelineKeys) {
      timelineMap.set(key, { revenue: 0, orders: 0 });
    }

    const dayMap = new Map<string, { revenue: number; orders: number }>();

    for (const order of filteredOrders) {
      const timelineKey = useDailyTimeline
        ? getDayKey(order.createdAt)
        : getMonthKey(order.createdAt);

      if (timelineMap.has(timelineKey)) {
        const bucket = timelineMap.get(timelineKey)!;
        bucket.revenue += Number(order.total);
        bucket.orders += 1;
      }

      const dayKey = getDayKey(order.createdAt);
      const day = dayMap.get(dayKey) ?? { revenue: 0, orders: 0 };
      day.revenue += Number(order.total);
      day.orders += 1;
      dayMap.set(dayKey, day);
    }

    const salesTimeline = useDailyTimeline
      ? [...dayMap.entries()]
          .filter(([, stats]) => stats.orders > 0)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, bucket]) => ({
            key,
            label: getDayLabel(key, true),
            revenue: bucket.revenue,
            orders: bucket.orders,
          }))
      : timelineKeys
          .map((key) => {
            const bucket = timelineMap.get(key)!;
            return {
              key,
              label: getMonthLabel(key),
              revenue: bucket.revenue,
              orders: bucket.orders,
            };
          })
          .filter((item) => item.orders > 0);

    let bestSalesDay: DashboardAnalytics["bestSalesDay"] = null;
    for (const [date, stats] of dayMap.entries()) {
      if (
        !bestSalesDay ||
        stats.revenue > bestSalesDay.revenue ||
        (stats.revenue === bestSalesDay.revenue && stats.orders > bestSalesDay.orders)
      ) {
        bestSalesDay = {
          date,
          label: new Date(`${date}T12:00:00`).toLocaleDateString("es-PE", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          revenue: stats.revenue,
          orders: stats.orders,
        };
      }
    }

    const allTimeRevenue = await prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { total: true },
    });

    return {
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      pendingOrders,
      totalOrders,
      revenue: Number(allTimeRevenue._sum.total ?? 0),
      grossRevenueInPeriod,
      totalUnitsSold,
      averageOrderValue,
      topProducts,
      salesTimeline,
      timelineMode: useDailyTimeline ? "day" : "month",
      timelineLabel: useDailyTimeline ? "Ventas por día" : "Ventas por mes",
      periodLabel,
      bestSalesDay,
      catalogProducts: products.map((product) => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
        status: product.status,
        price: Number(product.price),
      })),
    };
  } catch (error) {
    console.error("getDashboardAnalytics", error);
    return empty;
  }
}
