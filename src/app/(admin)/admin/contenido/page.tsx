import { requireAdmin } from "@/lib/admin/auth";
import { getJsonSetting } from "@/lib/admin/queries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveSiteContentAction } from "@/actions/admin/settings";

export default async function AdminContentPage() {
  await requireAdmin();

  const hero = await getJsonSetting("content.hero", {
    title: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    image: "",
  });
  const about = await getJsonSetting("content.about", {
    title: "",
    description: "",
    history: "",
    image: "",
  });
  const contact = await getJsonSetting("content.contact", {
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    hours: "",
    instagram: "",
    facebook: "",
  });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Contenido del sitio</h1>
        <p className="mt-1 text-text-muted">
          Edita textos del hero, nosotros y contacto sin tocar código.
        </p>
      </div>

      {[
        { key: "hero" as const, title: "Hero", data: hero },
        { key: "about" as const, title: "Nosotros", data: about },
        { key: "contact" as const, title: "Contacto", data: contact },
      ].map((section) => (
        <form
          key={section.key}
          action={async (formData) => {
            "use server";
            const content = Object.fromEntries(formData.entries()) as Record<string, string>;
            await saveSiteContentAction(section.key, content);
          }}
          className="space-y-4 rounded-3xl bg-white p-6 shadow-sm"
        >
          <h2 className="font-serif text-xl font-semibold">{section.title}</h2>
          {Object.entries(section.data).map(([field, value]) => (
            <div key={field}>
              <label className="mb-1 block text-sm capitalize">{field}</label>
              {field === "description" || field === "history" ? (
                <textarea
                  name={field}
                  defaultValue={value}
                  className="min-h-24 w-full rounded-xl border border-beige-dark px-4 py-3 text-sm"
                />
              ) : (
                <Input name={field} defaultValue={value} />
              )}
            </div>
          ))}
          <Button type="submit">Guardar {section.title.toLowerCase()}</Button>
        </form>
      ))}
    </div>
  );
}
