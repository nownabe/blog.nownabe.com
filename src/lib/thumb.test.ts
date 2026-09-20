import assert from "node:assert/strict";
import sharp from "sharp";
import { renderThumb, THUMB_HEIGHT, THUMB_WIDTH } from "./thumb";

const banner = await sharp({
  create: { width: 1200, height: 630, channels: 3, background: "#6d6ff5" },
})
  .png()
  .toBuffer();
const { width, height, format } = await sharp(await renderThumb(banner)).metadata();
assert.equal(format, "webp");
assert.equal(width, THUMB_WIDTH);
assert.equal(height, THUMB_HEIGHT);
console.log("thumb: ok");
