import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { isAdminRole } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Mi cuenta",
};

export default async function CuentaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/cuenta");

  return (
    <div className="container-premium py-24 md:py-32">
      <h1 className="font-serif text-3xl font-bold md:text-4xl">Mi cuenta</h1>
      <p className="mt-2 text-text-muted">
        Hola, {session.user.name ?? session.user.email}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/favoritos"
          className="rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="font-serif text-xl font-semibold">Favoritos</h2>
          <p className="mt-2 text-sm text-text-muted">
            Productos que guardaste para comprar después.
          </p>
        </Link>
        <Link
          href="/carrito"
          className="rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="font-serif text-xl font-semibold">Carrito</h2>
          <p className="mt-2 text-sm text-text-muted">
            Revisa los productos listos para comprar.
          </p>
        </Link>
        {isAdminRole(session.user.role) && (
          <Link
            href="/admin"
            className="rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="font-serif text-xl font-semibold">Panel admin</h2>
            <p className="mt-2 text-sm text-text-muted">
              Gestiona productos, pedidos y contenido de la tienda.
            </p>
          </Link>
        )}
      </div>

      <div className="mt-10">
        <Button asChild variant="outline">
          <Link href="/productos">Seguir comprando</Link>
        </Button>
      </div>
    </div>
  );
}
