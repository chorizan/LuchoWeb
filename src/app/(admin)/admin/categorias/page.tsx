import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryCreateForm } from "@/components/admin/category-create-form";
import { CategoryEditForm } from "@/components/admin/category-edit-form";
import {
  deleteCategoryAction,
  toggleCategoryStatusAction,
} from "@/actions/admin/categories";

function CategoryActions({
  id,
  status,
  canDelete,
}: {
  id: string;
  status: string;
  canDelete: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <form action={toggleCategoryStatusAction.bind(null, id)}>
        <Button type="submit" variant="outline">
          {status === "ACTIVE" ? "Desactivar" : "Activar"}
        </Button>
      </form>
      {canDelete && (
        <form action={deleteCategoryAction.bind(null, id)}>
          <Button type="submit" variant="outline">
            Eliminar
          </Button>
        </form>
      )}
    </div>
  );
}

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Categorías</h1>
        <p className="mt-1 text-text-muted">
          Crea y organiza las categorías visibles en la tienda.
        </p>
      </div>

      <CategoryCreateForm defaultSortOrder={categories.length} />

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="rounded-3xl border border-beige-dark bg-white p-6 shadow-sm space-y-4">
            <CategoryEditForm category={category} />
            <CategoryActions
              id={category.id}
              status={category.status}
              canDelete={category._count.products === 0}
            />
            <p className="text-xs text-text-muted">
              {category._count.products} productos asociados
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
