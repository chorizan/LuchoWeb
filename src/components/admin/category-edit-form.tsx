"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { updateCategoryAction } from "@/actions/admin/categories";

interface CategoryEditFormProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    sortOrder: number;
    status: string;
  };
}

export function CategoryEditForm({ category }: CategoryEditFormProps) {
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (formData: FormData) => {
    if (uploading) {
      setError("Espera a que termine de subir la imagen.");
      return;
    }

    startTransition(async () => {
      const result = await updateCategoryAction(category.id, formData);
      if (result?.error) {
        setError(result.error);
        setSuccess(false);
        return;
      }
      setError(null);
      setSuccess(true);
    });
  };

  return (
    <form action={handleSubmit} className="grid gap-4 lg:grid-cols-2">
      <Input name="name" defaultValue={category.name} required />
      <Input name="slug" defaultValue={category.slug} required />
      <Input
        name="description"
        defaultValue={category.description ?? ""}
        className="lg:col-span-2"
      />
      <div className="lg:col-span-2">
        <ImageUploadField
          name="image"
          defaultValue={category.image ?? ""}
          label="Imagen"
          onUploadingChange={setUploading}
        />
      </div>
      <Input name="sortOrder" type="number" defaultValue={category.sortOrder} />
      <select
        name="status"
        defaultValue={category.status}
        className="h-11 rounded-xl border border-beige-dark px-4 text-sm"
      >
        <option value="ACTIVE">Activa</option>
        <option value="INACTIVE">Inactiva</option>
      </select>
      {error && <p className="lg:col-span-2 text-sm text-sale">{error}</p>}
      {success && !error && (
        <p className="lg:col-span-2 text-sm text-olive">Categoría guardada correctamente.</p>
      )}
      <div className="lg:col-span-2">
        <Button type="submit" disabled={pending || uploading}>
          {uploading ? "Espera la imagen..." : pending ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
