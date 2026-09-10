import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { parseBenefitsJson } from "@/lib/product-benefits";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="p-8">
      <h1 className="mb-6 font-serif text-3xl font-bold">Editar producto</h1>
      <ProductForm
        categories={categories}
        product={{
          ...product,
          price: Number(product.price),
          salePrice: product.salePrice ? Number(product.salePrice) : null,
          weight: product.weight ? Number(product.weight) : null,
          benefits: parseBenefitsJson(product.benefits),
        }}
      />
    </div>
  );
}
