import type { Root, Element } from "hast";
import { visit } from "unist-util-visit";

/**
 * Rehype plugin that appends a <button data-copy-btn> to every
 * <figure data-rehype-pretty-code-figure> element.
 * Must run AFTER rehype-pretty-code in the plugin chain.
 */
export function rehypeCopyButton() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (
        node.tagName === "figure" &&
        "dataRehypePrettyCodeFigure" in (node.properties ?? {})
      ) {
        node.children.push({
          type: "element",
          tagName: "button",
          properties: { "data-copy-btn": "" },
          children: [{ type: "text", value: "Copy" }],
        });
      }
    });
  };
}
