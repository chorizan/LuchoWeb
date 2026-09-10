"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCustomerAction } from "@/actions/admin/customers";

export function CustomerCreateForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createCustomerAction(formData);
      if (result?.error) {
        setError(result.error);
        setSuccess(false);
        return;
      }

      setError(null);
      setSuccess(true);
      setOpen(false);
    });
  };

  return (
    <div className="mb-8">
      {!open ? (
        <Button type="button" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Añadir cliente
        </Button>
      ) : (
        <form
          action={handleSubmit}
          className="grid gap-4 rounded-3xl border border-beige-dark bg-white p-6 shadow-sm lg:grid-cols-2"
        >
          <div className="lg:col-span-2 flex items-center justify-between gap-4">
            <h2 className="font-serif text-xl font-semibold">Nuevo cliente</h2>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError(null);
              }}
              className="rounded-full p-2 text-text-muted hover:bg-beige/60 hover:text-text"
              aria-label="Cerrar formulario"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Input name="name" placeholder="Nombre completo" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="phone" placeholder="Teléfono (opcional)" />
          <Input
            name="password"
            type="password"
            placeholder="Contraseña (opcional, para login)"
          />

          {error && <p className="lg:col-span-2 text-sm text-sale">{error}</p>}

          <div className="lg:col-span-2 flex gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Guardando..." : "Registrar cliente"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {success && !open && (
        <p className="mt-4 text-sm text-olive">Cliente registrado correctamente.</p>
      )}
    </div>
  );
}
