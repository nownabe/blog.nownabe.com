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
  const where = ctx.fileURL?.pathname ?? "?";
  // KaTeX's own strict warnings name the offending character but not the file,
  // and fire once per character; report the formula once instead.
  const reported = new Set();
  const strict = (code, message) => {
    if (!reported.has(code)) {
      reported.add(code);
      warn(where, node.value, `${message} [${code}]`);
    }
    return "ignore";
  };
  try {
    return katex.renderToString(node.value, { displayMode, strict, throwOnError: true });
  } catch (e) {
    // A bad formula in one legacy article shouldn't fail the whole build, but it
    // must not pass unnoticed either: warn here, and let KaTeX print it in red.
    warn(where, node.value, e.message);
    return katex.renderToString(node.value, { displayMode, strict: "ignore", throwOnError: false });
  }
}

function warn(where, tex, message) {
  console.warn(`[katex] ${where}: ${tex}\n  ${message}`);
}

const html = (value) => ({ type: "html", value });
