import sharp from "sharp";

// 2× the 192×108 slot in PostEntry.astro so the thumbnail stays crisp on hi-DPI screens.
export const THUMB_WIDTH = 384;
export const THUMB_HEIGHT = 216;

export function renderThumb(banner: string | Buffer): Promise<Buffer> {
  return sharp(banner)
    .resize(THUMB_WIDTH, THUMB_HEIGHT, { fit: "cover" })
    .webp({ quality: 80 })
    .toBuffer();
}
