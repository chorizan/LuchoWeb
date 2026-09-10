import { NextResponse } from "next/server";
import { auth, isAdminRole } from "@/auth";
import { saveUploadedImage } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }

    const url = await saveUploadedImage(file);
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al subir imagen";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
