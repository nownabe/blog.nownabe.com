import satori from "satori";
import sharp from "sharp";

// 1200×630 (1.91:1) is the one size every share target shows uncropped, so the same
// image serves og:image, the X large card and the list thumbnail.
export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;

const FONT_URL =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/zenmarugothic/ZenMaruGothic-Bold.ttf";

// Same palette as global.css; satori has no CSS variables.
const INK = "#1b1b1f";
const MUTED = "#6f7285";
const AURORA =
  "linear-gradient(90deg, #6d6ff5, #9293fe, #b6b9ff, #f0b3f7, #b6b9ff, #8ee7d9, #b6f0e6, #9293fe, #6d6ff5)";
const AURORA_TEXT =
  "linear-gradient(90deg, #5b5ce6, #9293fe, #d98bf0, #9293fe, #4fd3c2, #6d6ff5, #5b5ce6)";

let font: Promise<ArrayBuffer> | undefined;

// The site's display face, fetched once per build. Vendoring the ~5MB TTF was rejected to keep the repo small.
function loadFont(): Promise<ArrayBuffer> {
  font ??= fetch(FONT_URL).then((res) => {
    if (!res.ok) throw new Error(`Failed to fetch ${FONT_URL}: ${res.status}`);
    return res.arrayBuffer();
  });
  return font;
}

function el(type: string, style: Record<string, unknown>, children?: unknown) {
  return { type, props: { style, children } };
}

export interface CardProps {
  title: string;
  date?: string;
}

export async function renderCard({ title, date }: CardProps): Promise<Buffer> {
  const svg = await satori(
    el(
      "div",
      {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px 0",
        // A faint aurora tint keeps the card from dissolving into white paper when shown as a thumbnail.
        backgroundImage: "linear-gradient(135deg, #f2f2ff 0%, #ffffff 50%, #eefaf7 100%)",
        color: INK,
        fontFamily: "Zen Maru Gothic",
      },
      [
        el(
          "div",
          {
            display: "flex",
            alignItems: "flex-end",
            fontSize: 48,
            lineHeight: 1,
            letterSpacing: "-0.01em",
          },
          [
            "nownab",
            // The dot sits on the baseline like a period; flex-end aligns to the descender, so lift it by that much.
            el("div", {
              width: 15,
              height: 15,
              margin: "0 3px 4px",
              borderRadius: 8,
              backgroundImage: AURORA_TEXT,
            }),
            "log",
          ],
        ),
        el(
          "div",
          {
            fontSize: 72,
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
            // The longest title (49 chars) wraps to 4 lines at this size; anything longer is cut with an ellipsis.
            lineClamp: 4,
          },
          title,
        ),
        el("div", { display: "flex", flexDirection: "column" }, [
          el(
            "div",
            { height: 48, fontSize: 36, color: MUTED, marginBottom: 32 },
            date ?? "the nownabe's life log",
          ),
          el("div", { height: 10, margin: "0 -80px", backgroundImage: AURORA }),
        ]),
      ],
    ),
    {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      fonts: [{ name: "Zen Maru Gothic", data: await loadFont(), weight: 700, style: "normal" }],
    },
  );
  return sharp(Buffer.from(svg)).png().toBuffer();
}
