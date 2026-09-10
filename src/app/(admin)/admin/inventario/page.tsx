import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { getInventoryStatus } from "@/lib/catalog/mappers";
import { updateStockAction } from "@/actions/admin/products";

export default async function AdminInventoryPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ stock: "asc" }, { name: "asc" }],
  });

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-bold">Inventario</h1>
      <p className="mt-1 mb-8 text-text-muted">
        Control de stock con estados automáticos.
      </p>

      <div className="overflow-hidden rounded-3xl border border-beige-dark bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-beige/60 text-left text-text-muted">
            <tr>
              <th className="px-5 py-4">Producto</th>
              <th className="px-5 py-4">Categoría</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Precio</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4">Actualizar</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const status = getInventoryStatus(product.stock);
              return (
                <tr key={product.id} className="border-t border-beige-dark/70">
                  <td className="px-5 py-4 font-medium">{product.name}</td>
                  <td className="px-5 py-4">{product.category.name}</td>
                  <td className="px-5 py-4">{product.stock}</td>
                  <td className="px-5 py-4">
                    {formatPrice(Number(product.salePrice ?? product.price))}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        status === "Agotado"
                          ? "text-sale"
                          : status === "Bajo stock"
                            ? "text-gold"
                            : "text-olive"
                      }
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <form
                      action={async (formData) => {
                        "use server";
                        const stock = Number(formData.get("stock"));
                        await updateStockAction(product.id, stock);
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        name="stock"
                        type="number"
                        defaultValue={product.stock}
                        className="h-9 w-20 rounded-lg border border-beige-dark px-2"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-olive px-3 py-2 text-xs text-white"
                      >
                        Guardar
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
