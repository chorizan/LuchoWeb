"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadFieldProps {
  name?: string;
  label?: string;
  defaultValue?: string;
  onChange?: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export function ImageUploadField({
  name = "mainImage",
  label = "Imagen",
  defaultValue = "",
  onChange,
  onUploadingChange,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [storedValue, setStoredValue] = useState(defaultValue);
  const [preview, setPreview] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStoredValue(defaultValue);
    setPreview(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const clearBlobPreview = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  };

  const updateStoredValue = (url: string) => {
    clearBlobPreview();
    setStoredValue(url);
    setPreview(url);
    onChange?.(url);
  };

  const setUploadingState = (value: boolean) => {
    setUploading(value);
    onUploadingChange?.(value);
  };

  const handleUpload = async (file: File) => {
    setUploadingState(true);
    setError(null);

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/pjpeg",
      "image/png",
      "image/x-png",
      "image/webp",
    ];

    if (
      file.type &&
      !allowedTypes.includes(file.type.toLowerCase()) &&
      !allowedExtensions.includes(extension)
    ) {
      setError("Formato no permitido. Usa JPG, PNG o WebP.");
      setUploadingState(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5 MB.");
      setUploadingState(false);
      return;
    }

    const previousUrl = storedValue;
    const localPreview = URL.createObjectURL(file);
    blobUrlRef.current = localPreview;
    setPreview(localPreview);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 30000);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
        signal: controller.signal,
      });

      let data: { url?: string; error?: string } = {};
      try {
        data = (await response.json()) as { url?: string; error?: string };
      } catch {
        throw new Error("Respuesta inválida del servidor al subir la imagen");
      }

      if (!response.ok) {
        throw new Error(data.error ?? "Error al subir la imagen");
      }
      if (!data.url) {
        throw new Error("No se recibió la URL de la imagen");
      }

      updateStoredValue(data.url);
    } catch (err) {
      updateStoredValue(previousUrl);
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("La subida tardó demasiado. Intenta de nuevo.");
      } else if (err instanceof TypeError) {
        setError("No se pudo conectar con el servidor. Recarga la página e intenta de nuevo.");
      } else {
        setError(err instanceof Error ? err.message : "Error al subir imagen");
      }
    } finally {
      window.clearTimeout(timeoutId);
      setUploadingState(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-text">{label}</label>
      <input type="hidden" name={name} value={storedValue} readOnly />

      {preview ? (
        <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-beige-dark bg-gray-light">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Vista previa"
            className="h-full w-full object-contain p-3"
          />
          <button
            type="button"
            onClick={() => updateStoredValue("")}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-text-muted shadow-sm hover:text-text"
            aria-label="Quitar imagen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-beige-dark bg-beige/40 text-sm text-text-muted">
          Sin imagen seleccionada
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleUpload(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Subiendo..." : "Subir imagen"}
        </Button>
        <Input
          value={storedValue}
          onChange={(event) => updateStoredValue(event.target.value)}
          placeholder="URL de imagen (opcional)"
          className="flex-1"
        />
      </div>
      {error && <p className="text-sm text-sale">{error}</p>}
      {uploading && !error && (
        <p className="text-sm text-text-muted">Optimizando imagen...</p>
      )}
    </div>
  );
}
