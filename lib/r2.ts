import {
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getR2Client() {
  const accountId = requiredEnv("R2_ACCOUNT_ID");
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

export function getR2PublicUrl(key: string) {
  const base = requiredEnv("R2_PUBLIC_URL").replace(/\/$/, "");
  return `${base}/${key}`;
}

export const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const VIDEO_TYPES = ["video/mp4", "video/webm"] as const;

export type UploadKind = "product" | "logo" | "hero";

const KIND_PREFIX: Record<UploadKind, string> = {
  product: "products",
  logo: "brand",
  hero: "hero",
};

function extensionFor(contentType: string) {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "video/mp4":
      return "mp4";
    case "video/webm":
      return "webm";
    default:
      return "bin";
  }
}

async function putObject(key: string, file: Buffer, contentType: string) {
  const client = getR2Client();
  const bucket = requiredEnv("R2_BUCKET_NAME");

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  return {
    publicUrl: getR2PublicUrl(key),
    key,
  };
}

/** Server-side upload for product / logo images */
export async function uploadImageToR2(
  file: Buffer,
  contentType: string,
  kind: "product" | "logo" = "product"
) {
  if (!IMAGE_TYPES.includes(contentType as (typeof IMAGE_TYPES)[number])) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed");
  }

  const key = `${KIND_PREFIX[kind]}/${randomUUID()}.${extensionFor(contentType)}`;
  return putObject(key, file, contentType);
}

/** @deprecated Prefer uploadImageToR2 — kept for existing product upload callers */
export async function uploadProductImageToR2(
  file: Buffer,
  contentType: string
) {
  return uploadImageToR2(file, contentType, "product");
}

/** Presigned PUT for large hero videos (client uploads directly to R2) */
export async function createPresignedHeroUpload(contentType: string) {
  if (!VIDEO_TYPES.includes(contentType as (typeof VIDEO_TYPES)[number])) {
    throw new Error("Only MP4 and WebM videos are allowed");
  }

  const key = `${KIND_PREFIX.hero}/${randomUUID()}.${extensionFor(contentType)}`;
  const client = getR2Client();
  const bucket = requiredEnv("R2_BUCKET_NAME");

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 600 });

  return {
    uploadUrl,
    publicUrl: getR2PublicUrl(key),
    key,
  };
}
