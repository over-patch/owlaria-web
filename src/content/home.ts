import type { Locale } from '../i18n/config';

export type PlatformId = 'macos' | 'ios';

export type Platform = {
  id: PlatformId;
  storeUrl?: string;
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
    previewAlt: string;
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

export const platforms: Platform[] = [{ id: 'macos' }, { id: 'ios' }];

export const platformHref = (platform: Platform): string | undefined =>
  platform.storeUrl;

export const homeCopy: Record<Locale, HomeCopy> = {
  en: {
    metadata: {
      title: 'Owlaria — Your library. Reimagined.',
      description:
        'Bring the books you care about into one focused library with Owlaria for macOS and iOS.',
    },
    hero: {
      eyebrow: 'A new perspective on your books',
      heading: 'Your library. Reimagined.',
      body: 'Bring the books you care about into one focused library—designed to feel at home on macOS and iOS.',
      previewAlt: 'Owlaria displaying a library of books',
    },
    features: {
      eyebrow: 'Made for your collection',
      heading: 'Less friction. More room for every book.',
      items: [
        {
          number: '01',
          title: 'One calm library',
          body: 'Keep the books that matter to you in a focused space built for browsing.',
        },
        {
          number: '02',
          title: 'Sources, brought together',
          body: 'Build your collection from the sources you choose without losing sight of the whole.',
        },
        {
          number: '03',
          title: 'Designed for Apple platforms',
          body: 'A clear, responsive experience shaped for macOS and iOS from the start.',
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
      eyebrow: 'Your next chapter',
      heading: 'A better place for every book you keep.',
      body: 'Owlaria is being prepared for its first release on macOS and iOS.',
    },
  },
  ja: {
    metadata: {
      title: 'Owlaria — 本棚の未来を、ここから。',
      description:
        '大切な本をひとつの心地よいライブラリへ。OwlariaはmacOSとiOSに登場します。',
    },
    hero: {
      eyebrow: '本との向き合い方を、新しく',
      heading: '本棚の未来を、ここから。',
      body: '大切な本を、ひとつの心地よいライブラリへ。macOSとiOSのために生まれた、新しい読書の居場所です。',
      previewAlt: '本のライブラリを表示するOwlariaの画面',
    },
    features: {
      eyebrow: 'コレクションのための設計',
      heading: '探す手間を減らして、本と出会う余白を。',
      items: [
        {
          number: '01',
          title: '心地よい、ひとつの本棚',
          body: '大切な本を見渡しやすく、落ち着いて楽しめる場所にまとめます。',
        },
        {
          number: '02',
          title: '選んだソースを、ひとつに',
          body: '使いたいソースから集めながら、コレクション全体をすっきり見渡せます。',
        },
        {
          number: '03',
          title: 'Appleプラットフォームのために',
          body: 'macOSとiOS、それぞれで自然に使える明快な体験を目指しました。',
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
      eyebrow: '次の一冊へ',
      heading: '大切な本に、もっとふさわしい居場所を。',
      body: 'OwlariaはmacOSとiOSでの初回リリースに向けて準備中です。',
    },
  },
};
