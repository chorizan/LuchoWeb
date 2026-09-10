import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";
import type { OrderData } from "./types";
import { DELIVERY_LABELS, PAYMENT_LABELS } from "./types";

const COLORS = {
  olive: [85, 107, 47] as [number, number, number],
  oliveDark: [61, 79, 34] as [number, number, number],
  beige: [245, 241, 232] as [number, number, number],
  text: [34, 34, 34] as [number, number, number],
  muted: [102, 102, 102] as [number, number, number],
  sale: [214, 60, 47] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

export function generateOrderPdf(order: OrderData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 0;

  // Header band
  doc.setFillColor(...COLORS.olive);
  doc.rect(0, 0, pageWidth, 42, "F");

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(siteConfig.name, margin, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Comprobante de Pedido", margin, 28);
  doc.text(siteConfig.contact.email, margin, 35);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(order.orderNumber, pageWidth - margin, 18, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const dateStr = new Date(order.createdAt).toLocaleString("es-PE", {
    dateStyle: "long",
    timeStyle: "short",
  });
  doc.text(dateStr, pageWidth - margin, 26, { align: "right" });
  doc.text("PENDIENTE DE CONFIRMACIÓN", pageWidth - margin, 34, {
    align: "right",
  });

  y = 52;

  // Customer section
  doc.setTextColor(...COLORS.olive);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL CLIENTE", margin, y);
  y += 8;

  doc.setTextColor(...COLORS.text);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const customerLines = [
    `Nombre: ${order.customer.firstName} ${order.customer.lastName}`,
    `Correo: ${order.customer.email}`,
    `Celular: ${order.customer.phone}`,
  ];

  customerLines.forEach((line) => {
    doc.text(line, margin, y);
    y += 6;
  });

  y += 4;

  // Address section
  doc.setTextColor(...COLORS.olive);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DIRECCIÓN DE ENTREGA", margin, y);
  y += 8;

  doc.setTextColor(...COLORS.text);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const addressLines = [
    order.customer.street,
    `${order.customer.district}, ${order.customer.province}`,
    order.customer.department,
  ];
  if (order.customer.reference) {
    addressLines.push(`Ref: ${order.customer.reference}`);
  }

  addressLines.forEach((line) => {
    doc.text(line, margin, y);
    y += 6;
  });

  y += 6;

  // Products table
  doc.setTextColor(...COLORS.olive);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DETALLE DEL PEDIDO", margin, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Producto", "Cant.", "Precio unit.", "Subtotal"]],
    body: order.items.map((item) => {
      const unitPrice = item.salePrice ?? item.price;
      return [
        item.name,
        String(item.quantity),
        formatPrice(unitPrice),
        formatPrice(unitPrice * item.quantity),
      ];
    }),
    headStyles: {
      fillColor: COLORS.olive,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.text,
    },
    alternateRowStyles: {
      fillColor: COLORS.beige,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { halign: "center", cellWidth: 20 },
      2: { halign: "right", cellWidth: 35 },
      3: { halign: "right", cellWidth: 35 },
    },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Totals box
  const boxX = pageWidth - margin - 70;
  doc.setFillColor(...COLORS.beige);
  doc.roundedRect(boxX, y, 70, 36, 3, 3, "F");

  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(9);
  doc.text("Subtotal:", boxX + 5, y + 10);
  doc.text("Envío:", boxX + 5, y + 18);
  doc.setTextColor(...COLORS.text);
  doc.text(formatPrice(order.subtotal), boxX + 65, y + 10, { align: "right" });
  doc.text(
    order.shipping === 0 ? "Gratis" : formatPrice(order.shipping),
    boxX + 65,
    y + 18,
    { align: "right" }
  );

  doc.setDrawColor(...COLORS.olive);
  doc.line(boxX + 5, y + 22, boxX + 65, y + 22);

  doc.setTextColor(...COLORS.olive);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL:", boxX + 5, y + 30);
  doc.setTextColor(...COLORS.sale);
  doc.text(formatPrice(order.total), boxX + 65, y + 30, { align: "right" });

  y += 46;

  // Delivery & payment
  doc.setTextColor(...COLORS.olive);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("ENTREGA Y PAGO", margin, y);
  y += 8;

  doc.setTextColor(...COLORS.text);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Método de entrega: ${DELIVERY_LABELS[order.customer.deliveryMethod] ?? order.customer.deliveryMethod}`,
    margin,
    y
  );
  y += 6;
  doc.text(
    `Método de pago: ${PAYMENT_LABELS[order.customer.paymentMethod] ?? order.customer.paymentMethod}`,
    margin,
    y
  );

  if (order.customer.notes) {
    y += 8;
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(9);
    doc.text(`Observaciones: ${order.customer.notes}`, margin, y, {
      maxWidth: pageWidth - margin * 2,
    });
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setDrawColor(...COLORS.beige);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(8);
  doc.text(
    `${siteConfig.name} · ${siteConfig.contact.phone}${siteConfig.contact.address ? ` · ${siteConfig.contact.address}` : ""}`,
    pageWidth / 2,
    footerY,
    { align: "center" }
  );
  doc.text(
    "Gracias por confiar en productos artesanales premium del Perú.",
    pageWidth / 2,
    footerY + 5,
    { align: "center" }
  );

  return doc;
}

export function downloadOrderPdf(order: OrderData): void {
  const doc = generateOrderPdf(order);
  doc.save(`${order.orderNumber}.pdf`);
}
