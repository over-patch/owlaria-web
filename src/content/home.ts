import type { Locale } from '../i18n/config';

export type PlatformId = 'macos' | 'ios';

export type Platform = {
  id: PlatformId;
  symbol: string;
  storeUrl?: string;
};

export type PlatformAction =
  | {
      kind: 'link';
      label: string;
      href: string;
    }
  | {
      kind: 'pending';
      label: string;
    };

export type HomeCopy = {
  metadata: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
    proofPoints: string[];
    sourceLabel: string;
    protectionLabel: string;
    deviceLabel: string;
  };
  capabilities: {
    eyebrow: string;
    heading: string;
    body: string;
    action: string;
    items: Array<{
      title: string;
      body: string;
    }>;
  };
  features: {
    eyebrow: string;
    heading: string;
    items: Array<{
      number: string;
      title: string;
      body: string;
    }>;
  };
  platforms: {
    eyebrow: string;
    heading: string;
    body: string;
    purchaseNote: string;
    comingSoon: string;
    labels: Record<PlatformId, { name: string; detail: string }>;
  };
  closing: {
    eyebrow: string;
    heading: string;
    body: string;
  };
};

export const platforms: Platform[] = [
  { id: 'macos', symbol: 'macOS' },
  { id: 'ios', symbol: 'iOS' },
];

export const platformAction = (
  platform: Platform,
  storeLabel: string,
  pendingLabel: string,
): PlatformAction =>
  platform.storeUrl
    ? { kind: 'link', label: storeLabel, href: platform.storeUrl }
    : { kind: 'pending', label: pendingLabel };

export const homeCopy: Record<Locale, HomeCopy> = {
  en: {
    metadata: {
      title: 'Owlaria — Read comics from your NAS',
      description:
        'Read and organize comics from your NAS with a viewer designed not to modify the original files. Built for macOS and iOS.',
    },
    hero: {
      eyebrow: 'A Read-Only comic viewer for your collection',
      heading: 'Your comics on NAS. Ready when you are.',
      body: 'Owlaria connects to the collection you already have, keeps organization separate from your original files, and gives you a comic-first reading experience on macOS and iOS.',
      proofPoints: ['SMB NAS', 'Read-Only by design', 'ZIP / CBZ / PDF'],
      sourceLabel: 'Your NAS or local folders',
      protectionLabel: 'Read-Only by design.',
      deviceLabel: 'Read on macOS and iOS',
    },
    features: {
      eyebrow: 'Why Owlaria',
      heading: 'Your collection stays yours.',
      items: [
        {
          number: '01',
          title: 'Read-Only by design',
          body: 'Owlaria is designed without operations that rename, move, delete, or write sidecar files beside your comics. Titles, tags, series, ratings, and custom covers live only inside the app.',
        },
        {
          number: '02',
          title: 'Start reading without the wait',
          body: 'Open supported remote ZIP, CBZ, and PDF books from the parts you need first, while Owlaria prepares nearby pages in the background.',
        },
        {
          number: '03',
          title: 'Read comics your way',
          body: 'Choose right-to-left, left-to-right, or vertical reading, then switch between single pages, spreads, and continuous scrolling.',
        },
      ],
    },
    capabilities: {
      eyebrow: 'Beyond the reader',
      heading: 'Built for a comic library that keeps growing.',
      body: 'Find a title in thousands, keep series together, protect private libraries, and see how your reading changes over time.',
      action: 'Explore every feature',
      items: [
        {
          title: 'Powerful library search',
          body: 'Search and filter by title, author, series, tags, rating, reading state, and more.',
        },
        {
          title: 'Smart file tracking',
          body: 'Keep your app metadata when a source file is moved or renamed.',
        },
        {
          title: 'Private libraries',
          body: 'Lock selected libraries and unlock them with Touch ID or Face ID.',
        },
        {
          title: 'Reading insights',
          body: 'Review reading time, finished books, pages, and activity trends.',
        },
      ],
    },
    platforms: {
      eyebrow: 'Choose your platform',
      heading: 'Owlaria, where your library lives.',
      body: 'Owlaria is coming to macOS and iOS.',
      purchaseNote:
        'The macOS and iOS editions are separate products and require a separate purchase.',
      comingSoon: 'Coming soon',
      labels: {
        macos: { name: 'Owlaria for macOS', detail: 'Mac App Store' },
        ios: { name: 'Owlaria for iOS', detail: 'App Store' },
      },
    },
    closing: {
      eyebrow: 'Your collection, protected',
      heading: 'Keep the archive. Change the experience.',
      body: 'Owlaria is being prepared for its first release on macOS and iOS.',
    },
  },
  ja: {
    metadata: {
      title: 'Owlaria — NASの漫画を、そのまま読む',
      description:
        'NASにあるコミックを、原本を変更しないよう設計されたビューアで整理・閲覧。macOSとiOSに対応します。',
    },
    hero: {
      eyebrow: 'コレクションを守るRead-Onlyコミックビューア',
      heading: 'NASに置いた漫画を、そのまま、すぐ読む。',
      body: 'Owlariaは、いまあるコレクションへ直接つながり、整理情報を原本とは別に保存し、macOSとiOSに漫画のための読書体験を届けます。',
      proofPoints: ['SMB NAS対応', 'Read-Only設計', 'ZIP / CBZ / PDF'],
      sourceLabel: 'NAS・ローカルフォルダ',
      protectionLabel: '原本を守るRead-Only設計',
      deviceLabel: 'macOS・iOSで読む',
    },
    features: {
      eyebrow: 'Owlariaを選ぶ理由',
      heading: 'コレクションは、あなたのもののまま。',
      items: [
        {
          number: '01',
          title: '原本を守るRead-Only設計',
          body: '原本に対する名前変更・移動・削除や、サイドカーファイルの書き込み操作を持たない設計です。タイトル、タグ、シリーズ、評価、表紙の編集はOwlariaの中だけに保存します。',
        },
        {
          number: '02',
          title: '待たずに読み始める',
          body: '対応するリモートのZIP・CBZ・PDFは、必要な部分から取得。近くのページをバックグラウンドで準備します。',
        },
        {
          number: '03',
          title: '読み方を妥協しない',
          body: '右開き・左開き・縦読みを選び、単ページ・見開き・連続スクロールをいつでも切り替えられます。',
        },
      ],
    },
    capabilities: {
      eyebrow: 'ビューアの、その先へ',
      heading: '増え続けるコレクションのために。',
      body: '何千冊からでも見つけやすく。シリーズをまとめ、プライベートな本棚を守り、読書の変化を振り返れます。',
      action: 'すべての機能を見る',
      items: [
        {
          title: '細かな検索と絞り込み',
          body: 'タイトル、作者、シリーズ、タグ、評価、読書状態などから探せます。',
        },
        {
          title: 'ファイル移動を追跡',
          body: '保存場所や名前が変わっても、Owlaria内のメタデータを維持します。',
        },
        {
          title: 'プライベートライブラリ',
          body: '選んだライブラリをロックし、Touch IDやFace IDで解除できます。',
        },
        {
          title: '読書を振り返る統計',
          body: '読書時間、読了冊数、ページ数、アクティビティの傾向を確認できます。',
        },
      ],
    },
    platforms: {
      eyebrow: 'プラットフォームを選ぶ',
      heading: 'Owlariaを、あなたの本棚がある場所へ。',
      body: 'OwlariaはmacOSとiOSに登場します。',
      purchaseNote: 'macOS版とiOS版は別商品で、それぞれ別々の購入が必要です。',
      comingSoon: '近日公開',
      labels: {
        macos: { name: 'Owlaria for macOS', detail: 'Mac App Store' },
        ios: { name: 'Owlaria for iOS', detail: 'App Store' },
      },
    },
    closing: {
      eyebrow: 'コレクションを守る',
      heading: '原本はそのまま。読書体験だけを変える。',
      body: 'OwlariaはmacOSとiOSでの初回リリースに向けて準備中です。',
    },
  },
};
