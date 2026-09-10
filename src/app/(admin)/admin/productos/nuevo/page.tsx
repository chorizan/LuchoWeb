import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="p-8">
      <h1 className="mb-6 font-serif text-3xl font-bold">Agregar producto</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
