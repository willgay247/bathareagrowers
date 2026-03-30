const STORAGE_BASE = "https://fgjdlgslkwfgfzidfpyz.supabase.co/storage/v1/object/public/cms-images/";
const RENDER_BASE = "https://fgjdlgslkwfgfzidfpyz.supabase.co/storage/v1/render/image/public/cms-images/";

/**
 * Build a Supabase Storage image URL with optional on-the-fly transforms.
 * Pass a filename (just the file, not full URL) or a full storage URL.
 */
export function imageUrl(
  filenameOrUrl: string,
  opts?: { width?: number; height?: number; quality?: number }
): string {
  // If it's a full URL, extract the filename
  const filename = filenameOrUrl.startsWith("http")
    ? filenameOrUrl.replace(STORAGE_BASE, "")
    : filenameOrUrl;

  if (!opts) return `${STORAGE_BASE}${filename}`;

  const params = new URLSearchParams();
  if (opts.width) params.set("width", String(opts.width));
  if (opts.height) params.set("height", String(opts.height));
  params.set("quality", String(opts.quality ?? 75));
  return `${RENDER_BASE}${filename}?${params}`;
}

/** Helper to build a srcSet string for responsive images */
export function imageSrcSet(
  filename: string,
  widths: number[],
  quality = 75
): string {
  return widths
    .map((w) => `${imageUrl(filename, { width: w, quality })} ${w}w`)
    .join(", ");
}
