import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";
import { toggleProductStatusAction, deleteProductAction } from "@/actions/admin/products";

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Productos</h1>
          <p className="mt-1 text-text-muted">
            Administra el catálogo sin modificar código.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="h-4 w-4" />
            Agregar producto
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-beige-dark bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-beige/60 text-left text-text-muted">
            <tr>
              <th className="px-5 py-4">Producto</th>
              <th className="px-5 py-4">Categoría</th>
              <th className="px-5 py-4">Precio</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-beige-dark/70">
                <td className="px-5 py-4 font-medium">{product.name}</td>
                <td className="px-5 py-4">{product.category.name}</td>
                <td className="px-5 py-4">
                  {formatPrice(Number(product.salePrice ?? product.price))}
                </td>
                <td className="px-5 py-4">{product.stock}</td>
                <td className="px-5 py-4">{product.status}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/productos/${product.id}`}>
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </Link>
                    </Button>
                    <form action={toggleProductStatusAction.bind(null, product.id)}>
                      <Button size="sm" variant="outline" type="submit">
                        {product.status === "PUBLISHED" ? "Desactivar" : "Activar"}
                      </Button>
                    </form>
                    <form action={deleteProductAction.bind(null, product.id)}>
                      <Button size="sm" variant="outline" type="submit">
                        Eliminar
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
