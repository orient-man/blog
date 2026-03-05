import createMDX from "@next/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

/**
 * Inline JS version of the rehypeCopyButton plugin for next.config.mjs.
 * The TypeScript source lives in src/lib/rehype-copy-button.ts and is used
 * by the evaluate() pipeline (bundled by Next.js). This copy is identical
 * in behaviour but written as plain ESM for direct use by the config loader.
 */
function rehypeCopyButton() {
  return (tree) => {
    visit(tree, "element", (node) => {
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

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  theme: {
    dark: "github-dark",
    light: "github-light",
  },
  keepBackground: false,
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions], rehypeCopyButton],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default withMDX(nextConfig);
