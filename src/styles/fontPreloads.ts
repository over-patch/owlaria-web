import interLatinFont from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
import japaneseFont69 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-69-wght-normal.woff2?url';
import japaneseFont74 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-74-wght-normal.woff2?url';
import japaneseFont81 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-81-wght-normal.woff2?url';
import japaneseFont88 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-88-wght-normal.woff2?url';
import japaneseFont90 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-90-wght-normal.woff2?url';
import japaneseFont92 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-92-wght-normal.woff2?url';
import japaneseFont93 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-93-wght-normal.woff2?url';
import japaneseFont94 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-94-wght-normal.woff2?url';
import japaneseFont95 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-95-wght-normal.woff2?url';
import japaneseFont96 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-96-wght-normal.woff2?url';
import japaneseFont97 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-97-wght-normal.woff2?url';
import japaneseFont98 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-98-wght-normal.woff2?url';
import japaneseFont99 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-99-wght-normal.woff2?url';
import japaneseFont100 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-100-wght-normal.woff2?url';
import japaneseFont101 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-101-wght-normal.woff2?url';
import japaneseFont102 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-102-wght-normal.woff2?url';
import japaneseFont103 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-103-wght-normal.woff2?url';
import japaneseFont104 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-104-wght-normal.woff2?url';
import japaneseFont105 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-105-wght-normal.woff2?url';
import japaneseFont106 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-106-wght-normal.woff2?url';
import japaneseFont107 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-107-wght-normal.woff2?url';
import japaneseFont108 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-108-wght-normal.woff2?url';
import japaneseFont109 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-109-wght-normal.woff2?url';
import japaneseFont110 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-110-wght-normal.woff2?url';
import japaneseFont111 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-111-wght-normal.woff2?url';
import japaneseFont112 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-112-wght-normal.woff2?url';
import japaneseFont113 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-113-wght-normal.woff2?url';
import japaneseFont114 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-114-wght-normal.woff2?url';
import japaneseFont115 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-115-wght-normal.woff2?url';
import japaneseFont116 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-116-wght-normal.woff2?url';
import japaneseFont117 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-117-wght-normal.woff2?url';
import japaneseFont118 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-118-wght-normal.woff2?url';
import japaneseFont119 from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-119-wght-normal.woff2?url';
import japaneseLatinFont from '@fontsource-variable/noto-sans-jp/files/noto-sans-jp-latin-wght-normal.woff2?url';

const japaneseFonts = {
  69: japaneseFont69,
  74: japaneseFont74,
  81: japaneseFont81,
  88: japaneseFont88,
  90: japaneseFont90,
  92: japaneseFont92,
  93: japaneseFont93,
  94: japaneseFont94,
  95: japaneseFont95,
  96: japaneseFont96,
  97: japaneseFont97,
  98: japaneseFont98,
  99: japaneseFont99,
  100: japaneseFont100,
  101: japaneseFont101,
  102: japaneseFont102,
  103: japaneseFont103,
  104: japaneseFont104,
  105: japaneseFont105,
  106: japaneseFont106,
  107: japaneseFont107,
  108: japaneseFont108,
  109: japaneseFont109,
  110: japaneseFont110,
  111: japaneseFont111,
  112: japaneseFont112,
  113: japaneseFont113,
  114: japaneseFont114,
  115: japaneseFont115,
  116: japaneseFont116,
  117: japaneseFont117,
  118: japaneseFont118,
  119: japaneseFont119,
} as const;

type JapaneseFontSubset = keyof typeof japaneseFonts;

const japanesePreloads = (...subsets: JapaneseFontSubset[]) => [
  ...subsets.map((subset) => japaneseFonts[subset]),
  japaneseLatinFont,
];

const sharedJapanesePreloads = japanesePreloads(
  113,
  114,
  115,
  116,
  117,
  118,
  119,
);

const japanesePreloadsByPathname: Record<string, string[]> = {
  '/': japanesePreloads(
    90,
    93,
    106,
    107,
    108,
    109,
    110,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
  ),
  '/features/': japanesePreloads(
    88,
    93,
    96,
    100,
    102,
    103,
    104,
    105,
    106,
    109,
    110,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
  ),
  '/support/': japanesePreloads(
    94,
    100,
    101,
    102,
    103,
    105,
    106,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
  ),
  '/support/purchases/': japanesePreloads(
    88,
    100,
    103,
    104,
    108,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
  ),
  '/privacy/': japanesePreloads(
    93,
    95,
    97,
    98,
    102,
    103,
    105,
    106,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
  ),
  '/terms/': japanesePreloads(
    69,
    74,
    81,
    92,
    93,
    94,
    99,
    103,
    105,
    106,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
  ),
  '/releases/': japanesePreloads(100, 107, 110, 113, 115, 116, 117, 118, 119),
};

export function getLocaleFontPreloads(
  locale: 'en' | 'ja',
  pathname: string,
): string[] {
  if (locale === 'en') return [interLatinFont];
  if (pathname.startsWith('/releases/')) {
    return japanesePreloadsByPathname['/releases/'];
  }

  return japanesePreloadsByPathname[pathname] ?? sharedJapanesePreloads;
}
