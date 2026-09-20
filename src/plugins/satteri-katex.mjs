import { defineMdastPlugin } from "satteri";
import katex from "katex";

// Render $...$ and $$...$$ into HTML at build time, so pages need no math JS.
// This has to run in the mdast phase: Astro's syntax highlighter is a hast
// plugin that runs first and would turn $$ blocks into highlighted code.
export default defineMdastPlugin({
  name: "katex",
  inlineMath: (node, ctx) => ctx.replaceNode(node, html(render(node, ctx, false))),
  math: (node, ctx) => ctx.replaceNode(node, html(`<div class="math-block">${render(node, ctx, true)}</div>`)),
});

function render(node, ctx, displayMode) {
  try {
    return katex.renderToString(node.value, { displayMode, throwOnError: true });
  } catch (e) {
    // A bad formula in one legacy article shouldn't fail the whole build, but it
    // must not pass unnoticed either: warn here, and let KaTeX print it in red.
    console.warn(`[katex] ${ctx.fileURL?.pathname ?? "?"}: ${node.value}\n  ${e.message}`);
    return katex.renderToString(node.value, { displayMode, throwOnError: false });
  }
}

const html = (value) => ({ type: "html", value });
