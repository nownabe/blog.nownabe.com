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

// A broken formula renders in red instead of failing the build.
const warnings = [];
const warn = console.warn;
console.warn = (m) => warnings.push(m);
const broken = render("$\\frac{1}$\n");
console.warn = warn;
assert.match(broken, /katex-error/);
assert.equal(warnings.length, 1);

// Dollars outside math are left alone.
assert.doesNotMatch(render("US\\$0.05 per hour\n"), /katex/);

console.log("satteri-katex: ok");
