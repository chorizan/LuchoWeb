"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  createProductAction,
  updateProductAction,
} from "@/actions/admin/products";
import type { ProductBenefit } from "@/types";
import { serializeBenefitsText } from "@/lib/product-benefits";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
  product?: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    categoryId: string;
    shortDesc?: string | null;
    longDesc?: string | null;
    price: number | string;
    salePrice?: number | string | null;
    stock: number;
    weight?: number | string | null;
    weightUnit?: string | null;
    origin?: string | null;
    brand?: string | null;
    brandLogo?: string | null;
    mainImage?: string | null;
    tags: string[];
    highlights: string[];
    benefits?: ProductBenefit[] | null;
    uses: string[];
    nutritionalInfo: string[];
    isFeatured: boolean;
    sortOrder: number;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    blockPurchaseWhenOutOfStock: boolean;
  };
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const isUploading = uploadingCount > 0;

  const handleUploadingChange = (uploading: boolean) => {
    setUploadingCount((count) => Math.max(0, count + (uploading ? 1 : -1)));
  };

  const handleSubmit = (formData: FormData) => {
    if (isUploading) {
      setError("Espera a que termine de subir la imagen.");
      return;
    }

    startTransition(async () => {
      const result = product
        ? await updateProductAction(product.id, formData)
        : await createProductAction(formData);

      if (result.error) {
        setError(result.error);
        setSuccess(false);
        return;
      }

      if (product) {
        setError(null);
        setSuccess(true);
        router.refresh();
        return;
      }

      router.push("/admin/productos");
      router.refresh();
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-semibold">Información básica</h2>
          <Input name="name" defaultValue={product?.name} placeholder="Nombre" required />
          <Input name="slug" defaultValue={product?.slug} placeholder="slug-del-producto" required />
          <Input name="sku" defaultValue={product?.sku} placeholder="SKU" required />
          <select
            name="categoryId"
            defaultValue={product?.categoryId ?? categories[0]?.id}
            className="h-11 w-full rounded-xl border border-beige-dark bg-white px-4 text-sm"
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <textarea
            name="shortDesc"
            defaultValue={product?.shortDesc ?? ""}
            placeholder="Descripción corta"
            className="min-h-24 w-full rounded-xl border border-beige-dark px-4 py-3 text-sm"
          />
          <textarea
            name="longDesc"
            defaultValue={product?.longDesc ?? ""}
            placeholder="Descripción completa"
            className="min-h-40 w-full rounded-xl border border-beige-dark px-4 py-3 text-sm"
          />
        </div>

        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-semibold">Precio e inventario</h2>
          <Input
            name="price"
            type="number"
            step="0.01"
            defaultValue={product ? Number(product.price) : ""}
            placeholder="Precio"
            required
          />
          <Input
            name="salePrice"
            type="number"
            step="0.01"
            defaultValue={product?.salePrice ? Number(product.salePrice) : ""}
            placeholder="Precio promocional"
          />
          <Input
            name="stock"
            type="number"
            defaultValue={product?.stock ?? 0}
            placeholder="Stock"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              name="weight"
              type="number"
              step="0.01"
              defaultValue={product?.weight ? Number(product.weight) : ""}
              placeholder="Peso"
            />
            <Input
              name="weightUnit"
              defaultValue={product?.weightUnit ?? "kg"}
              placeholder="Unidad"
            />
          </div>
          <Input name="origin" defaultValue={product?.origin ?? ""} placeholder="Origen" />
          <Input name="brand" defaultValue={product?.brand ?? ""} placeholder="Marca" />
          <Input
            name="sortOrder"
            type="number"
            defaultValue={product?.sortOrder ?? 0}
            placeholder="Orden"
          />
          <select
            name="status"
            defaultValue={product?.status ?? "DRAFT"}
            className="h-11 w-full rounded-xl border border-beige-dark bg-white px-4 text-sm"
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="ARCHIVED">Archivado</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={product?.isFeatured}
              className="rounded"
            />
            Producto destacado
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="blockPurchaseWhenOutOfStock"
              defaultChecked={product?.blockPurchaseWhenOutOfStock ?? true}
              className="rounded"
            />
            Bloquear compra cuando esté agotado
          </label>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-semibold">Imagen</h2>
          <ImageUploadField
            name="mainImage"
            defaultValue={product?.mainImage ?? ""}
            label="Imagen principal"
            onUploadingChange={handleUploadingChange}
          />
          <ImageUploadField
            name="brandLogo"
            defaultValue={product?.brandLogo ?? ""}
            label="Logo de marca (opcional)"
            onUploadingChange={handleUploadingChange}
          />
        </div>

        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-semibold">Beneficios y detalle</h2>
          <textarea
            name="benefits"
            defaultValue={serializeBenefitsText(
              (product?.benefits as ProductBenefit[] | null | undefined) ?? []
            )}
            placeholder={"Beneficios (uno por línea)\nFormato: Título | Descripción\nEj: Energía natural | Aporta minerales esenciales del jugo de caña"}
            className="min-h-32 w-full rounded-xl border border-beige-dark px-4 py-3 text-sm"
          />
          <Input
            name="tags"
            defaultValue={product?.tags.join(", ") ?? ""}
            placeholder="Tags separados por coma"
          />
          <Input
            name="highlights"
            defaultValue={product?.highlights.join(", ") ?? ""}
            placeholder="Destacados separados por coma (también se usan si no hay beneficios)"
          />
          <textarea
            name="uses"
            defaultValue={product?.uses.join("\n") ?? ""}
            placeholder="Usos recomendados (uno por línea)"
            className="min-h-24 w-full rounded-xl border border-beige-dark px-4 py-3 text-sm"
          />
          <textarea
            name="nutritionalInfo"
            defaultValue={product?.nutritionalInfo.join("\n") ?? ""}
            placeholder="Información del producto (etiquetas, una por línea)"
            className="min-h-24 w-full rounded-xl border border-beige-dark px-4 py-3 text-sm"
          />
        </div>
      </div>

      {error && <p className="text-sm text-sale">{error}</p>}
      {success && !error && (
        <p className="text-sm text-olive">Producto guardado correctamente.</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending || isUploading}>
          {isUploading
            ? "Espera la imagen..."
            : pending
              ? "Guardando..."
              : product
                ? "Guardar cambios"
                : "Publicar producto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
