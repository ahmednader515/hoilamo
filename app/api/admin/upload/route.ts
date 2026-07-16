import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadProductImageToR2 } from "@/lib/r2";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024; // 4MB

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "لم يتم توفير ملف" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "يجب ألا يتجاوز حجم الصورة 4 ميغابايت" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadProductImageToR2(
      buffer,
      file.type || "image/jpeg"
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("R2 upload error:", error);
    const message =
      error instanceof Error ? error.message : "فشل رفع الصورة";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
