"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  ShoppingCart,
  Users,
  FileText,
  ImageIcon,
  Settings,
  LogOut,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/inventario", label: "Inventario", icon: Boxes },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/contenido", label: "Contenido", icon: FileText },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminSidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-beige-dark bg-white">
      <div className="border-b border-beige-dark px-5 py-6">
        <p className="font-serif text-xl font-bold text-text">Panel Admin</p>
        <p className="mt-1 text-xs text-text-muted">{userName ?? "Super Admin"}</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-olive text-white"
                  : "text-text-muted hover:bg-beige hover:text-text"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-beige-dark p-3">
        <Button asChild variant="outline" className="w-full justify-start">
          <Link href="/">
            <Store className="h-4 w-4" />
            Ver tienda
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-text-muted"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
