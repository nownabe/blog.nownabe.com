import assert from "node:assert/strict";
import sharp from "sharp";
import { CARD_HEIGHT, CARD_WIDTH, renderCard } from "./card";

const png = await renderCard({
  title: "Kubernetes クラスタを自宅に構築した話 (Raspberry Pi 4 ×3 台)",
  date: "2026.09.20",
});
const { width, height, format } = await sharp(png).metadata();
assert.equal(format, "png");
assert.equal(width, CARD_WIDTH);
assert.equal(height, CARD_HEIGHT);
console.log("card: ok");
