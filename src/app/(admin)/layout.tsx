import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-beige">
      <div className="flex min-h-screen">
        <AdminSidebar userName={session?.user?.name} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
