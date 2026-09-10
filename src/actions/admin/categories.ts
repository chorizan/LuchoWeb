"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { CategoryStatus } from "@prisma/client";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
    description: formData.get("description") || undefined,
    image: formData.get("image") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    status: formData.get("status") || "ACTIVE",
  });

  if (!parsed.success) {
    return { error: "Datos inválidos. Revisa nombre y slug." };
  }

  const imageValue = String(formData.get("image") ?? "").trim();

  try {
    await prisma.category.create({
      data: {
        ...parsed.data,
        image: imageValue || undefined,
        status: parsed.data.status as CategoryStatus,
      },
    });
  } catch {
    return { error: "No se pudo crear la categoría. Verifica que el slug no esté duplicado." };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
  revalidatePath("/productos");
  return { success: true };
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    image: formData.get("image") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    status: formData.get("status") || "ACTIVE",
  });

  if (!parsed.success) {
    return { error: "Datos inválidos. Revisa nombre y slug." };
  }

  const imageValue = String(formData.get("image") ?? "").trim();

  try {
    await prisma.category.update({
      where: { id },
      data: {
        ...parsed.data,
        image: imageValue || null,
        status: parsed.data.status as CategoryStatus,
      },
    });
  } catch {
    return { error: "No se pudo guardar la categoría. Verifica que el slug no esté duplicado." };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
  revalidatePath("/productos");
  return { success: true };
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return;
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
  return;
}

export async function toggleCategoryStatusAction(id: string) {
  await requireAdmin();
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return;

  await prisma.category.update({
    where: { id },
    data: {
      status:
        category.status === CategoryStatus.ACTIVE
          ? CategoryStatus.INACTIVE
          : CategoryStatus.ACTIVE,
    },
  });

  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
  return;
}
