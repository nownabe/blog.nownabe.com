import { defineMdastPlugin } from "satteri";
import { nameToEmoji } from "gemoji";

// Hugo's enableEmoji turned :tada: into 🎉; older articles rely on it.
export default defineMdastPlugin({
  name: "emoji-shortcodes",
  text(node, ctx) {
    if (!node.value.includes(":")) return;
    const value = node.value.replace(
      /:([a-z0-9_+-]+):/g,
      (match, name) => nameToEmoji[name] ?? match,
    );
    if (value !== node.value) ctx.replaceNode(node, { ...node, value });
  },
});
