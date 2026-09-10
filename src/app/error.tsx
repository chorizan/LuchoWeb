"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-3xl font-bold">Algo salió mal</h1>
      <p className="mt-3 max-w-md text-text-muted">
        Ocurrió un error al cargar esta página. Intenta recargar.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()}>Reintentar</Button>
        <Button variant="outline" onClick={() => window.location.assign("/")}>
          Ir al inicio
        </Button>
      </div>
    </div>
  );
}
