"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { OrderStatus, PaymentMethod, DeliveryMethod } from "@prisma/client";
import { z } from "zod";

const orderInputSchema = z.object({
  orderNumber: z.string(),
  customer: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    street: z.string(),
    district: z.string(),
    province: z.string(),
    department: z.string(),
    reference: z.string().optional(),
    notes: z.string().optional(),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      sku: z.string(),
      price: z.number(),
      quantity: z.number().int().positive(),
    })
  ),
  subtotal: z.number(),
  shippingCost: z.number(),
  total: z.number(),
  paymentMethod: z.enum(["transfer", "cash_on_delivery"]),
  deliveryMethod: z.enum(["pickup", "standard", "express"]),
});

export async function createOrderAction(input: z.infer<typeof orderInputSchema>) {
  const parsed = orderInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Datos de pedido inválidos" };
  }

  const data = parsed.data;

  try {
    const user = await prisma.user.upsert({
      where: { email: data.customer.email.toLowerCase() },
      update: { name: `${data.customer.firstName} ${data.customer.lastName}` },
      create: {
        email: data.customer.email.toLowerCase(),
        name: `${data.customer.firstName} ${data.customer.lastName}`,
        role: "CUSTOMER",
      },
    });

    const customer = await prisma.customer.upsert({
      where: { userId: user.id },
      update: { phone: data.customer.phone },
      create: { userId: user.id, phone: data.customer.phone },
    });

    const address = await prisma.address.create({
      data: {
        customerId: customer.id,
        firstName: data.customer.firstName,
        lastName: data.customer.lastName,
        phone: data.customer.phone,
        street: data.customer.street,
        district: data.customer.district,
        province: data.customer.province,
        department: data.customer.department,
        reference: data.customer.reference,
        isDefault: true,
      },
    });

    const paymentMap: Record<string, PaymentMethod> = {
      transfer: PaymentMethod.TRANSFER,
      cash_on_delivery: PaymentMethod.CASH_ON_DELIVERY,
    };

    const deliveryMap: Record<string, DeliveryMethod> = {
      pickup: DeliveryMethod.PICKUP,
      standard: DeliveryMethod.STANDARD,
      express: DeliveryMethod.EXPRESS,
    };

    const order = await prisma.order.create({
      data: {
        orderNumber: data.orderNumber,
        customerId: customer.id,
        addressId: address.id,
        status: OrderStatus.PENDING,
        paymentMethod: paymentMap[data.paymentMethod],
        deliveryMethod: deliveryMap[data.deliveryMethod],
        subtotal: data.subtotal,
        shippingCost: data.shippingCost,
        total: data.total,
        notes: data.customer.notes,
        items: {
          create: await Promise.all(
            data.items.map(async (item) => {
              const product = await prisma.product.findFirst({
                where: {
                  OR: [
                    { id: item.productId },
                    { slug: item.productId },
                    { sku: item.sku },
                  ],
                },
              });

              return {
                productId: product?.id ?? item.productId,
                name: item.name,
                sku: item.sku,
                price: item.price,
                quantity: item.quantity,
                total: item.price * item.quantity,
              };
            })
          ),
        },
      },
    });

    for (const item of data.items) {
      const product = await prisma.product.findFirst({
        where: {
          OR: [{ id: item.productId }, { slug: item.productId }, { slug: item.sku }],
        },
      });
      if (product) {
        await prisma.product.update({
          where: { id: product.id },
          data: { stock: Math.max(0, product.stock - item.quantity) },
        });
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/pedidos");
    revalidatePath("/admin/inventario");
    revalidatePath("/admin/clientes");
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("createOrderAction", error);
    return { error: "No se pudo registrar el pedido" };
  }
}

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  await requireAdmin();
  await prisma.order.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
}
