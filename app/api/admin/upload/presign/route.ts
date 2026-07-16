import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPresignedHeroUpload, VIDEO_TYPES } from "@/lib/r2";

export const runtime = "nodejs";

const MAX_BYTES = 80 * 1024 * 1024; // 80MB

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      contentType?: string;
      size?: number;
    };

    const contentType = body.contentType || "";
    const size = typeof body.size === "number" ? body.size : 0;

    if (!VIDEO_TYPES.includes(contentType as (typeof VIDEO_TYPES)[number])) {
      return NextResponse.json(
        { error: "يُسمح فقط بملفات MP4 و WebM" },
        { status: 400 }
      );
    }

    if (size <= 0 || size > MAX_BYTES) {
      return NextResponse.json(
        { error: "يجب أن يكون حجم الفيديو بين 1 بايت و 80 ميغابايت" },
        { status: 400 }
      );
    }

    const result = await createPresignedHeroUpload(contentType);
    return NextResponse.json(result);
  } catch (error) {
    console.error("R2 presign error:", error);
    const message =
      error instanceof Error ? error.message : "فشل تجهيز رابط الرفع";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
