import assert from "node:assert/strict";
import { markdownToHtml } from "satteri";
import katex from "./satteri-katex.mjs";

const render = (md) => markdownToHtml(md, { features: { math: true }, mdastPlugins: [katex] }).html;

// Inline math has to stay inside its paragraph: an mdast `html` node keeps it
// there, while a raw splice would re-parse as a block and cut the sentence in two.
assert.match(render("* $X_i$: 同じ確率分布に従う\n"), /<li><span class="katex">.*<\/span>: 同じ確率分布に従う<\/li>/s);

const display = render("$$\nf(x) = 0\n$$\n");
assert.match(display, /^<div class="math-block"><span class="katex-display">/);
// Astro's highlighter turns any surviving math code block into a <pre>.
assert.doesNotMatch(display, /<pre|language-math/);

const captureWarnings = (md) => {
  const warnings = [];
  const warn = console.warn;
  console.warn = (m) => warnings.push(m);
  try {
    return { html: render(md), warnings };
  } finally {
    console.warn = warn;
  }
};

// A broken formula renders in red instead of failing the build.
const broken = captureWarnings("$\\frac{1}$\n");
assert.match(broken.html, /katex-error/);
assert.equal(broken.warnings.length, 1);

// Japanese belongs in \text{}; bare Japanese warns once for the whole formula,
// not once per character the way KaTeX's own strict warnings do.
const bare = captureWarnings("$精度 = 1$\n");
assert.equal(bare.warnings.length, 1);
assert.match(bare.warnings[0], /unicodeTextInMathMode/);
assert.deepEqual(captureWarnings("$\\text{精度} = 1$\n").warnings, []);

// Dollars outside math are left alone.
assert.doesNotMatch(render("US\\$0.05 per hour\n"), /katex/);

console.log("satteri-katex: ok");
