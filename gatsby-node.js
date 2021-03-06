const fs = require("fs");
const nimblRenderer = require("nimbl-renderer");
const crypto = require("crypto");
const frontmatter = require("front-matter");
const createHeadings = require("./generateHeadings");

let md = null;
const defaultSettings = {
  isPreview: false,
  html: true,
  linkify: false,
  typographer: false,
  breaks: true,
  checkbox: true,
  anchor: true,
  toc: true,
  tocLevels: [1, 2, 3, 4],
  katex: true,
  smartarrows: true,
  alert: true,
  note: true,
  spoiler: true,
  url: true,
  video: true,
  graph: true,
  highlighter: true,
  reviewQuestion: true
};

exports.onCreateNode = ({ node, boundActionCreators }, pluginOptions) => {
  const { createNode, createNodeField } = boundActionCreators;
  if (md === null) {
    md = nimblRenderer(
      pluginOptions.mdSettings || defaultSettings,
      pluginOptions.dir || "."
    );
  }

  if (node.internal.mediaType === "text/markdown") {
    const fileContent = fs.readFileSync(node.absolutePath, "UTF-8");
    const parsedMarkdown = frontmatter(fileContent);

    const html = md.render(parsedMarkdown.body);

    createNode({
      id: node.id + " >>> Nimbl",
      html,
      frontmatter: parsedMarkdown.attributes,
      parent: node.id,
      children: [],
      headings: createHeadings(parsedMarkdown.body, md),
      internal: {
        type: "NimblRenderedHTML",
        contentDigest: crypto
          .createHash(`md5`)
          .update(fileContent)
          .digest(`hex`)
      }
    });
  }
};
