import type { Locale } from '../i18n/config';

export type RouteKey = 'home' | 'support' | 'purchases' | 'releases';

type PageCopy = {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  body: string;
};

type SiteCopy = {
  skipToContent: string;
  navigationLabel: string;
  menuOpen: string;
  menuClose: string;
  features: string;
  support: string;
  releases: string;
  comingSoon: string;
  language: string;
  languageName: string;
  footer: {
    product: string;
    support: string;
    legal: string;
    home: string;
    features: string;
    purchases: string;
    privacy: string;
    terms: string;
  };
  pages: Record<RouteKey, PageCopy>;
};

export const siteCopy: Record<Locale, SiteCopy> = {
  en: {
    skipToContent: 'Skip to content',
    navigationLabel: 'Primary navigation',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    features: 'Features',
    support: 'Support',
    releases: 'Release Notes',
    comingSoon: 'Coming soon',
    language: 'Language',
    languageName: '日本語',
    footer: {
      product: 'Product',
      support: 'Support',
      legal: 'Legal',
      home: 'Overview',
      features: 'Features',
      purchases: 'Purchases',
      privacy: 'Privacy',
      terms: 'Terms',
    },
    pages: {
      home: {
        title: 'Owlaria',
        description: 'A focused new home for the books that matter to you.',
        eyebrow: 'Owlaria for the web',
        heading: 'A new home for Owlaria is taking shape.',
        body: 'The shared foundation is ready. The complete product story arrives in the next stage.',
      },
      support: {
        title: 'Support · Owlaria',
        description:
          'Find official Owlaria guidance for purchases, restores, and refunds.',
        eyebrow: 'Owlaria Support',
        heading: 'How can we help?',
        body: 'Start with the support topic closest to what you need.',
      },
      purchases: {
        title:
          'Owlaria Plus purchases, restores, and refunds · Owlaria Support',
        description:
          'Learn about Owlaria Plus purchases, Restore Purchases, and Apple refunds.',
        eyebrow: 'Support / Purchases',
        heading: 'Owlaria Plus purchase support',
        body: 'Guidance for purchases, restores, and refunds.',
      },
      releases: {
        title: 'Release Notes · Owlaria',
        description: 'Public release notes for Owlaria.',
        eyebrow: 'Release Notes',
        heading: 'Release notes are being prepared.',
        body: 'Reviewed product updates will appear here.',
      },
    },
  },
  ja: {
    skipToContent: '本文へ移動',
    navigationLabel: 'メインナビゲーション',
    menuOpen: 'メニューを開く',
    menuClose: 'メニューを閉じる',
    features: '機能',
    support: 'サポート',
    releases: 'リリースノート',
    comingSoon: '近日公開',
    language: '言語',
    languageName: 'English',
    footer: {
      product: 'プロダクト',
      support: 'サポート',
      legal: '法的情報',
      home: '概要',
      features: '機能',
      purchases: '購入について',
      privacy: 'プライバシー',
      terms: '利用規約',
    },
    pages: {
      home: {
        title: 'Owlaria',
        description: '大切な本のための、心地よい新しい居場所です。',
        eyebrow: 'Owlaria for the web',
        heading: 'Owlariaの新しい場所を、つくっています。',
        body: '共通基盤が整いました。プロダクトの全体像は次のステージでお届けします。',
      },
      support: {
        title: 'サポート · Owlaria',
        description: 'Owlariaの購入・復元・返金に関する公式サポート情報です。',
        eyebrow: 'Owlariaサポート',
        heading: 'お困りのことは？',
        body: '知りたい内容に近いサポート項目からご確認ください。',
      },
      purchases: {
        title: 'Owlaria Plusの購入・復元・返金について · Owlariaサポート',
        description:
          'Owlaria Plusの購入、購入の復元、Appleへの返金申請をご案内します。',
        eyebrow: 'サポート / 購入について',
        heading: 'Owlaria Plusの購入サポート',
        body: '購入・復元・返金についてご案内します。',
      },
      releases: {
        title: 'リリースノート · Owlaria',
        description: 'Owlariaの公開リリースノートです。',
        eyebrow: 'リリースノート',
        heading: 'リリースノートを準備しています。',
        body: 'レビュー済みのプロダクト更新情報を、こちらで公開します。',
      },
    },
  },
};

type ReleasePageCopy = {
  indexTitle: string;
  description: string;
  detailTitle: string;
  detailDescription: string;
  eyebrow: string;
  indexHeading: string;
  indexBody: string;
  listLabel: string;
  versionLabel: string;
  publishedLabel: string;
  platformsLabel: string;
  platforms: Record<'macos' | 'ios', string>;
  emptyHeading: string;
  emptyBody: string;
  backToIndex: string;
};

export const releasePageCopy: Record<Locale, ReleasePageCopy> = {
  en: {
    indexTitle: 'Release Notes · Owlaria',
    description: 'Reviewed public release notes for Owlaria on macOS and iOS.',
    detailTitle: 'Owlaria {version} Release Notes',
    detailDescription: 'What changed in Owlaria {version} for {platforms}.',
    eyebrow: 'Release Notes',
    indexHeading: 'Owlaria release notes',
    indexBody:
      'Follow the latest reviewed improvements across Owlaria for macOS and iOS.',
    listLabel: 'Published releases',
    versionLabel: 'Version',
    publishedLabel: 'Published',
    platformsLabel: 'Platforms',
    platforms: { macos: 'macOS', ios: 'iOS' },
    emptyHeading: 'No release notes yet',
    emptyBody:
      'Reviewed updates will appear here after they are published for Owlaria.',
    backToIndex: 'All release notes',
  },
  ja: {
    indexTitle: 'リリースノート · Owlaria',
    description: 'macOS・iOS版Owlariaのレビュー済み公開リリースノートです。',
    detailTitle: 'Owlaria {version} リリースノート',
    detailDescription: '{platforms}版Owlaria {version}の変更内容です。',
    eyebrow: 'リリースノート',
    indexHeading: 'Owlaria リリースノート',
    indexBody: 'macOS・iOS版Owlariaのレビュー済みの改善内容をお知らせします。',
    listLabel: '公開済みリリース',
    versionLabel: 'バージョン',
    publishedLabel: '公開日',
    platformsLabel: '対応プラットフォーム',
    platforms: { macos: 'macOS', ios: 'iOS' },
    emptyHeading: '公開済みのリリースはまだありません',
    emptyBody:
      'レビュー済みの更新情報をこちらで公開します。公開までしばらくお待ちください。',
    backToIndex: 'リリースノート一覧',
  },
};
