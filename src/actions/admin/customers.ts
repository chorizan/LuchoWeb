"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";

const customerSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional(),
});

function parseCustomerFormData(formData: FormData) {
  const passwordValue = String(formData.get("password") ?? "").trim();

  return customerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    password: passwordValue || undefined,
  });
}

export async function createCustomerAction(formData: FormData) {
  await requireAdmin();

  const parsed = parseCustomerFormData(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const email = parsed.data.email.toLowerCase();

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser && existingUser.role !== "CUSTOMER") {
      return { error: "Este email pertenece a un usuario administrativo." };
    }

    const passwordHash = parsed.data.password
      ? await bcrypt.hash(parsed.data.password, 10)
      : existingUser?.passwordHash ?? null;

    const user = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: parsed.data.name,
            role: "CUSTOMER",
            ...(passwordHash ? { passwordHash } : {}),
          },
        })
      : await prisma.user.create({
          data: {
            email,
            name: parsed.data.name,
            role: "CUSTOMER",
            passwordHash,
          },
        });

    await prisma.customer.upsert({
      where: { userId: user.id },
      update: { phone: parsed.data.phone ?? null },
      create: {
        userId: user.id,
        phone: parsed.data.phone ?? null,
      },
    });

    revalidatePath("/admin/clientes");
    return { success: true };
  } catch {
    return { error: "No se pudo registrar el cliente." };
  }
}

export async function updateCustomerAction(customerId: string, formData: FormData) {
  await requireAdmin();

  const parsed = parseCustomerFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const email = parsed.data.email.toLowerCase();

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: { user: true },
    });

    if (!customer) {
      return { error: "Cliente no encontrado." };
    }

    if (customer.user.role !== "CUSTOMER") {
      return { error: "Este usuario no es un cliente." };
    }

    const emailOwner = await prisma.user.findUnique({ where: { email } });
    if (emailOwner && emailOwner.id !== customer.userId) {
      return { error: "Ya existe otro usuario con ese email." };
    }

    const passwordHash = parsed.data.password
      ? await bcrypt.hash(parsed.data.password, 10)
      : undefined;

    await prisma.user.update({
      where: { id: customer.userId },
      data: {
        name: parsed.data.name,
        email,
        ...(passwordHash ? { passwordHash } : {}),
      },
    });

    await prisma.customer.update({
      where: { id: customerId },
      data: { phone: parsed.data.phone ?? null },
    });

    revalidatePath("/admin/clientes");
    return { success: true };
  } catch {
    return { error: "No se pudo actualizar el cliente." };
  }
}

export async function deleteCustomerAction(customerId: string) {
  await requireAdmin();

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: { _count: { select: { orders: true } } },
    });

    if (!customer) {
      return { error: "Cliente no encontrado." };
    }

    if (customer._count.orders > 0) {
      return {
        error: "No se puede eliminar un cliente con pedidos registrados.",
      };
    }

    await prisma.user.delete({ where: { id: customer.userId } });

    revalidatePath("/admin/clientes");
    return { success: true };
  } catch {
    return { error: "No se pudo eliminar el cliente." };
  }
}
