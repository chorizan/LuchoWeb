import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import { getDashboardAnalytics, parseDashboardFilter } from "@/lib/admin/queries";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ period?: string; from?: string; to?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const filter = parseDashboardFilter(params);
  const data = await getDashboardAnalytics(filter);

  return (
    <Suspense fallback={<div className="p-8 text-text-muted">Cargando dashboard...</div>}>
      <AdminDashboard data={data} filter={filter} />
    </Suspense>
  );
}
