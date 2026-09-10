"use client";

import { Fragment, useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  updateCustomerAction,
  deleteCustomerAction,
} from "@/actions/admin/customers";

export interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
  isTopBuyer: boolean;
}

interface CustomerTableProps {
  customers: CustomerRow[];
}

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function CustomerTable({ customers }: CustomerTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdate = (customerId: string, formData: FormData) => {
    startTransition(async () => {
      const result = await updateCustomerAction(customerId, formData);
      if (result?.error) {
        setError(result.error);
        setMessage(null);
        return;
      }

      setError(null);
      setMessage("Cliente actualizado correctamente.");
      setEditingId(null);
    });
  };

  const handleDelete = (customer: CustomerRow) => {
    const confirmed = window.confirm(
      `¿Eliminar a ${customer.name}? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteCustomerAction(customer.id);
      if (result?.error) {
        setError(result.error);
        setMessage(null);
        return;
      }

      setError(null);
      setMessage("Cliente eliminado correctamente.");
      if (editingId === customer.id) {
        setEditingId(null);
      }
    });
  };

  if (customers.length === 0) {
    return (
      <div className="p-8 text-center text-text-muted">
        No hay clientes registrados. Usa el botón &quot;Añadir cliente&quot; para empezar.
      </div>
    );
  }

  return (
    <div>
      {error && <p className="border-b border-beige-dark px-5 py-3 text-sm text-sale">{error}</p>}
      {message && !error && (
        <p className="border-b border-beige-dark px-5 py-3 text-sm text-olive">{message}</p>
      )}

      <table className="min-w-full text-sm">
        <thead className="bg-beige/60 text-left text-text-muted">
          <tr>
            <th className="px-5 py-4">Nombre</th>
            <th className="px-5 py-4">Email</th>
            <th className="px-5 py-4">Teléfono</th>
            <th className="px-5 py-4">Pedidos</th>
            <th className="px-5 py-4">Total comprado</th>
            <th className="px-5 py-4">Última compra</th>
            <th className="px-5 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <Fragment key={customer.id}>
              <tr className="border-t border-beige-dark/70">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span>{customer.name}</span>
                    {customer.isTopBuyer && (
                      <span className="rounded-full bg-olive/10 px-2 py-0.5 text-xs font-medium text-olive">
                        Top comprador
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">{customer.email}</td>
                <td className="px-5 py-4">{customer.phone ?? "—"}</td>
                <td className="px-5 py-4">{customer.orderCount}</td>
                <td className="px-5 py-4 font-medium">
                  {customer.totalSpent > 0 ? formatPrice(customer.totalSpent) : "—"}
                </td>
                <td className="px-5 py-4">{formatDate(customer.lastOrderAt)}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={pending}
                      onClick={() => {
                        setError(null);
                        setMessage(null);
                        setEditingId(editingId === customer.id ? null : customer.id);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={pending || customer.orderCount > 0}
                      onClick={() => handleDelete(customer)}
                      title={
                        customer.orderCount > 0
                          ? "No se puede eliminar un cliente con pedidos"
                          : "Eliminar cliente"
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                      Borrar
                    </Button>
                  </div>
                </td>
              </tr>

              {editingId === customer.id && (
                <tr className="border-t border-beige-dark/70 bg-beige/20">
                  <td colSpan={7} className="px-5 py-5">
                    <form
                      action={(formData) => handleUpdate(customer.id, formData)}
                      className="grid gap-4 lg:grid-cols-2"
                    >
                      <Input name="name" defaultValue={customer.name} placeholder="Nombre completo" required />
                      <Input
                        name="email"
                        type="email"
                        defaultValue={customer.email}
                        placeholder="Email"
                        required
                      />
                      <Input
                        name="phone"
                        defaultValue={customer.phone ?? ""}
                        placeholder="Teléfono (opcional)"
                      />
                      <Input
                        name="password"
                        type="password"
                        placeholder="Nueva contraseña (opcional)"
                      />

                      <div className="lg:col-span-2 flex gap-3">
                        <Button type="submit" disabled={pending}>
                          {pending ? "Guardando..." : "Guardar cambios"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
