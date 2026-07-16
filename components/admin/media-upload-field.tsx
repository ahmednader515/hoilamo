"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type MediaKind = "logo" | "hero";

type Props = {
  name: string;
  label: string;
  kind: MediaKind;
  hint?: string;
  defaultValue?: string | null;
};

export function MediaUploadField({
  name,
  label,
  kind,
  hint,
  defaultValue,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isVideo = kind === "hero";

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      if (isVideo) {
        const presignRes = await fetch("/api/admin/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentType: file.type || "video/mp4",
            size: file.size,
          }),
        });
        const presign = await presignRes.json();
        if (!presignRes.ok) {
          throw new Error(presign.error || "فشل تجهيز الرفع");
        }

        const putRes = await fetch(presign.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type || "video/mp4" },
          body: file,
        });
        if (!putRes.ok) {
          throw new Error(
            "فشل الرفع إلى R2 — تأكد من إعداد CORS على الـ bucket"
          );
        }

        setUrl(presign.publicUrl);
      } else {
        const body = new FormData();
        body.append("file", file);
        body.append("kind", "logo");

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body,
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "فشل الرفع");
        }
        setUrl(data.publicUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل الرفع");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {hint && <p className="text-xs text-amber-900/50">{hint}</p>}

      <input type="hidden" name={name} value={url} />

      <div className="flex w-fit flex-col gap-3">
        <div
          className={
            isVideo
              ? "relative h-36 w-56 shrink-0 overflow-hidden rounded-lg border border-amber-900/15 bg-amber-50"
              : "relative h-36 w-36 shrink-0 overflow-hidden rounded-lg border border-amber-900/15 bg-amber-50"
          }
        >
          {url ? (
            <>
              {isVideo ? (
                <video
                  src={url}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <Image
                  src={url}
                  alt={label}
                  fill
                  sizes="144px"
                  className="object-contain p-2"
                  unoptimized={url.startsWith("http")}
                />
              )}
              <button
                type="button"
                onClick={() => setUrl("")}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                aria-label={`إزالة ${label}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-amber-900/30">
              {isVideo ? (
                <Video className="h-8 w-8" />
              ) : (
                <ImagePlus className="h-8 w-8" />
              )}
            </div>
          )}
        </div>

        <div className="flex w-full flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={
              isVideo
                ? "video/mp4,video/webm"
                : "image/jpeg,image/png,image/webp,image/gif"
            }
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جارٍ الرفع…
              </>
            ) : url ? (
              isVideo ? "استبدال الفيديو" : "استبدال الشعار"
            ) : (
              "رفع إلى R2"
            )}
          </Button>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
