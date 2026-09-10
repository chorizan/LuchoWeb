"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { BannerPosition } from "@prisma/client";
import { z } from "zod";

export async function upsertSettingAction(key: string, value: string) {
  await requireAdmin();
  await prisma.settings.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  revalidatePath("/admin/configuracion");
  revalidatePath("/admin/contenido");
  revalidatePath("/");
  revalidatePath("/contacto");
  revalidatePath("/nosotros");
}

export async function saveSiteContentAction(
  section: "hero" | "about" | "contact",
  content: Record<string, string>
) {
  await requireAdmin();
  await upsertSettingAction(`content.${section}`, JSON.stringify(content));
}

const bannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image: z.string().min(1),
  link: z.string().optional(),
  buttonText: z.string().optional(),
  position: z.enum(["HERO", "PROMO", "SIDEBAR", "FOOTER"]).default("HERO"),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().optional(),
});

export async function createBannerAction(formData: FormData) {
  await requireAdmin();

  const parsed = bannerSchema.safeParse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || undefined,
    description: formData.get("description") || undefined,
    image: formData.get("image"),
    link: formData.get("link") || undefined,
    buttonText: formData.get("buttonText") || undefined,
    position: formData.get("position") || "HERO",
    sortOrder: formData.get("sortOrder") || 0,
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) return;

  await prisma.banner.create({
    data: {
      ...parsed.data,
      position: parsed.data.position as BannerPosition,
      isActive: parsed.data.isActive ?? true,
    },
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function toggleBannerAction(id: string) {
  await requireAdmin();
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) return;

  await prisma.banner.update({
    where: { id },
    data: { isActive: !banner.isActive },
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function deleteBannerAction(id: string) {
  await requireAdmin();
  await prisma.banner.delete({ where: { id } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
}
