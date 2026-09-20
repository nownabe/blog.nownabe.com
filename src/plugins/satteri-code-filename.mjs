import { defineMdastPlugin } from "satteri";

// esa/Qiita-style fences: ```go:hello.go
// Split into a real language for Shiki and a filename label above the block.
export default defineMdastPlugin({
  name: "code-filename",
  code(node, ctx) {
    if (!node.lang?.includes(":")) return;
    const [lang, ...rest] = node.lang.split(":");
    const filename = rest.join(":");
    ctx.replaceNode(node, [
      { type: "html", value: `<div class="code-filename">${escapeHtml(filename)}</div>` },
      { ...node, lang: lang || null },
    ]);
  },
});

function escapeHtml(s) {
  return s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
}
