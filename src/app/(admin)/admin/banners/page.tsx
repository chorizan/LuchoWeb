import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  createBannerAction,
  toggleBannerAction,
  deleteBannerAction,
} from "@/actions/admin/settings";

export default async function AdminBannersPage() {
  await requireAdmin();
  const banners = await prisma.banner.findMany({
    orderBy: [{ position: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Banners</h1>
        <p className="mt-1 text-text-muted">Administra banners promocionales.</p>
      </div>

      <form action={createBannerAction} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm lg:grid-cols-2">
        <h2 className="lg:col-span-2 font-serif text-xl font-semibold">Nuevo banner</h2>
        <Input name="title" placeholder="Título" required />
        <Input name="subtitle" placeholder="Subtítulo" />
        <textarea
          name="description"
          placeholder="Descripción"
          className="lg:col-span-2 min-h-24 rounded-xl border border-beige-dark px-4 py-3 text-sm"
        />
        <div className="lg:col-span-2">
          <ImageUploadField name="image" label="Imagen del banner" />
        </div>
        <Input name="link" placeholder="Enlace" />
        <Input name="buttonText" placeholder="Texto del botón" />
        <select name="position" defaultValue="HERO" className="h-11 rounded-xl border border-beige-dark px-4 text-sm">
          <option value="HERO">Hero</option>
          <option value="PROMO">Promo</option>
          <option value="SIDEBAR">Sidebar</option>
          <option value="FOOTER">Footer</option>
        </select>
        <Input name="sortOrder" type="number" defaultValue={0} />
        <label className="flex items-center gap-2 text-sm lg:col-span-2">
          <input type="checkbox" name="isActive" defaultChecked className="rounded" />
          Activo
        </label>
        <div className="lg:col-span-2">
          <Button type="submit">Crear banner</Button>
        </div>
      </form>

      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="rounded-3xl border border-beige-dark bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{banner.title}</p>
                <p className="text-sm text-text-muted">{banner.subtitle}</p>
                <p className="mt-2 text-xs text-text-muted">
                  {banner.position} · Orden {banner.sortOrder} ·{" "}
                  {banner.isActive ? "Activo" : "Inactivo"}
                </p>
              </div>
              <div className="flex gap-2">
                <form action={toggleBannerAction.bind(null, banner.id)}>
                  <Button type="submit" variant="outline" size="sm">
                    {banner.isActive ? "Desactivar" : "Activar"}
                  </Button>
                </form>
                <form action={deleteBannerAction.bind(null, banner.id)}>
                  <Button type="submit" variant="outline" size="sm">
                    Eliminar
                  </Button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
