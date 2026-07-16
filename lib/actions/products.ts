"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

const productSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  description: z.string().optional(),
  price: z.coerce.number().positive("يجب أن يكون السعر موجبًا"),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  hoverImageUrl: z.string().optional().nullable(),
  active: z.coerce.boolean().optional(),
});

export type ProductFormState = {
  error?: string;
  success?: boolean;
};

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId") || null,
    imageUrl: formData.get("imageUrl") || null,
    hoverImageUrl: formData.get("hoverImageUrl") || null,
    active: formData.get("active") === "on",
  });
}

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "إدخال غير صالح" };
  }

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      price: parsed.data.price,
      stock: parsed.data.stock,
      categoryId: parsed.data.categoryId || null,
      imageUrl: parsed.data.imageUrl || null,
      hoverImageUrl: parsed.data.hoverImageUrl || null,
      active: parsed.data.active ?? true,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/menu");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "إدخال غير صالح" };
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return { error: "المنتج غير موجود" };

  let slug = existing.slug;
  if (existing.name !== parsed.data.name) {
    const baseSlug = slugify(parsed.data.name);
    slug = baseSlug;
    let counter = 1;
    while (
      await prisma.product.findFirst({
        where: { slug, NOT: { id } },
      })
    ) {
      slug = `${baseSlug}-${counter++}`;
    }
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      price: parsed.data.price,
      stock: parsed.data.stock,
      categoryId: parsed.data.categoryId || null,
      imageUrl: parsed.data.imageUrl || null,
      hoverImageUrl: parsed.data.hoverImageUrl || null,
      active: parsed.data.active ?? true,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/menu");
  revalidatePath(`/menu/${slug}`);
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/menu");
  revalidatePath("/");
}

export async function toggleProductActive(id: string) {
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("المنتج غير موجود");

  await prisma.product.update({
    where: { id },
    data: { active: !product.active },
  });

  revalidatePath("/admin/products");
  revalidatePath("/menu");
  revalidatePath("/");
}
