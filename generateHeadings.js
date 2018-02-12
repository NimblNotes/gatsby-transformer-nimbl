function createHeadingsList(md, mdRenderer) {
  const lines = md.split("\n");
  let headings = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("#")) {
      let countLevel = 0;
      while (lines[i][countLevel] === "#") countLevel++;
      headings.push({
        depth: countLevel,
        value: mdRenderer.render(lines[i].slice(countLevel + 1))
      });
    }
  }

  return headings;
}

module.exports = createHeadingsList;
