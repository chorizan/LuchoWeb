"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { createCategoryAction } from "@/actions/admin/categories";

interface CategoryCreateFormProps {
  defaultSortOrder: number;
}

export function CategoryCreateForm({ defaultSortOrder }: CategoryCreateFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = (formData: FormData) => {
    if (uploading) {
      setError("Espera a que termine de subir la imagen.");
      return;
    }

    startTransition(async () => {
      const result = await createCategoryAction(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setError(null);
    });
  };

  return (
    <form action={handleSubmit} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm lg:grid-cols-2">
      <h2 className="lg:col-span-2 font-serif text-xl font-semibold">Nueva categoría</h2>
      <Input name="name" placeholder="Nombre" required />
      <Input name="slug" placeholder="slug (opcional)" />
      <Input name="description" placeholder="Descripción" className="lg:col-span-2" />
      <div className="lg:col-span-2">
        <ImageUploadField
          name="image"
          label="Imagen de categoría"
          onUploadingChange={setUploading}
        />
      </div>
      <Input name="sortOrder" type="number" defaultValue={defaultSortOrder} placeholder="Orden" />
      <select name="status" defaultValue="ACTIVE" className="h-11 rounded-xl border border-beige-dark px-4 text-sm">
        <option value="ACTIVE">Activa</option>
        <option value="INACTIVE">Inactiva</option>
      </select>
      {error && <p className="lg:col-span-2 text-sm text-sale">{error}</p>}
      <div className="lg:col-span-2">
        <Button type="submit" disabled={pending || uploading}>
          {uploading ? "Espera la imagen..." : pending ? "Creando..." : "Crear categoría"}
        </Button>
      </div>
    </form>
  );
}
