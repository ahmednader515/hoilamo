/** Prefer original files for remote (R2) product photos to avoid Next.js recompression. */
export function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}
