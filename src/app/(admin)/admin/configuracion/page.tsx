import { requireAdmin } from "@/lib/admin/auth";
import { getAllSettingsMap } from "@/lib/admin/queries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { upsertSettingAction } from "@/actions/admin/settings";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getAllSettingsMap();

  const fields = [
    { key: "site.name", label: "Nombre de la tienda" },
    { key: "site.tagline", label: "Tagline" },
    { key: "site.description", label: "Descripción" },
    { key: "contact.email", label: "Correo" },
    { key: "contact.phone", label: "Teléfono" },
    { key: "contact.hours", label: "Horarios" },
    { key: "contact.whatsapp", label: "WhatsApp" },
    { key: "social.instagram", label: "Instagram" },
    { key: "social.facebook", label: "Facebook" },
  ];

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-bold">Configuración</h1>
      <p className="mt-1 mb-8 text-text-muted">
        Información general y comercial de la tienda.
      </p>

      <div className="space-y-4">
        {fields.map((field) => (
          <form
            key={field.key}
            action={async (formData) => {
              "use server";
              await upsertSettingAction(field.key, String(formData.get("value") ?? ""));
            }}
            className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">{field.label}</label>
              <Input name="value" defaultValue={settings[field.key] ?? ""} />
            </div>
            <Button type="submit">Guardar</Button>
          </form>
        ))}
      </div>
    </div>
  );
}
