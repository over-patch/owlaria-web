const headingSelector = 'h1, h2, h3, h4, h5, h6';

const japaneseJoiners = new Set([
  'が',
  'から',
  'か',
  'し',
  'で',
  'て',
  'と',
  'な',
  'など',
  'に',
  'について',
  'の',
  'は',
  'へ',
  'まで',
  'も',
  'や',
  'よ',
  'より',
  'を',
]);

const addBreaksToTextNode = (
  textNode: Text,
  segmenter: Intl.Segmenter,
): void => {
  const text = textNode.data;
  const breakOffsets = Array.from(segmenter.segment(text))
    .filter(
      ({ index, isWordLike, segment }) =>
        index > 0 &&
        isWordLike &&
        !japaneseJoiners.has(segment) &&
        !/\s/u.test(text[index - 1] ?? ''),
    )
    .map(({ index }) => index);

  if (breakOffsets.length === 0) return;

  const fragment = document.createDocumentFragment();
  let start = 0;
  for (const offset of breakOffsets) {
    fragment.append(text.slice(start, offset));
    const breakOpportunity = document.createElement('wbr');
    breakOpportunity.dataset.autoHeadingBreak = '';
    fragment.append(breakOpportunity);
    start = offset;
  }
  fragment.append(text.slice(start));
  textNode.replaceWith(fragment);
};

export const applySemanticHeadingFallback = (): void => {
  const root = document.documentElement;
  if (
    root.lang !== 'ja' ||
    CSS.supports('word-break', 'auto-phrase') ||
    root.dataset.headingWrapFallback
  ) {
    return;
  }

  if (!('Segmenter' in Intl)) {
    root.dataset.headingWrapFallback = 'standard';
    root.style.setProperty('--heading-word-break', 'normal');
    return;
  }

  const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
  for (const heading of document.querySelectorAll(headingSelector)) {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
    for (const textNode of textNodes) addBreaksToTextNode(textNode, segmenter);
  }

  root.style.setProperty('--heading-word-break', 'keep-all');
  root.dataset.headingWrapFallback = 'segmented';
};

applySemanticHeadingFallback();
