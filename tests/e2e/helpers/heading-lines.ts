// Measure text rather than element height: a word can split inside an h1 that
// still fits its container and passes ordinary overflow checks.
export const measureHeadingLines = (heading: HTMLElement | SVGElement) => {
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const lines: { top: number; left: number; right: number; text: string }[] =
    [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    let offset = 0;
    for (const character of node.textContent ?? '') {
      const range = document.createRange();
      range.setStart(node, offset);
      offset += character.length;
      range.setEnd(node, offset);
      const box = range.getBoundingClientRect();
      if (!character.trim() || box.width === 0 || box.height === 0) continue;
      let line = lines.find(({ top }) => Math.abs(top - box.top) < 2);
      if (!line) {
        line = { top: box.top, left: box.left, right: box.right, text: '' };
        lines.push(line);
      }
      line.left = Math.min(line.left, box.left);
      line.right = Math.max(line.right, box.right);
      line.text += character;
    }
  }
  return lines
    .sort((a, b) => a.top - b.top)
    .map((line) => ({
      text: line.text,
      width: line.right - line.left,
      left: line.left,
      right: line.right,
    }));
};
