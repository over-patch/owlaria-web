import type { Locale } from '../i18n/config';

type PlanSummary = {
  name: string;
  audience: string;
  price: string;
  detail: string;
  action: string;
};

type PlansCopy = {
  metadata: { title: string; description: string };
  title: string;
  heading: string;
  intro: string;
  compareAction: string;
  summaries: { free: PlanSummary; plus: PlanSummary };
  table: {
    caption: string;
    item: string;
    note: string;
    rows: { label: string; free: string; plus: string }[];
  };
  features: {
    title: string;
    more: string;
    action: string;
    items: string[];
  };
  conditionsTitle: string;
  conditions: { title: string; body: string }[];
  availabilityTitle: string;
  availabilityBody: string;
  supportTitle: string;
  supportBody: string;
  supportAction: string;
  teaser: { title: string; free: string; plus: string };
};

export const plansCopy: Record<Locale, PlansCopy> = {
  en: {
    metadata: {
      title: 'Plans & Pricing · Owlaria',
      description:
        'Compare Owlaria Free and Plus. Every feature is free with one library and up to 100 books. Plus removes both limits with a one-time purchase per OS.',
    },
    title: 'Plans & Pricing',
    heading: 'Every feature, free. More room with Plus.',
    intro:
      'Start with one library and up to 100 books. When your collection grows, Plus removes the library and book limits.',
    compareAction: 'Compare plans',
    summaries: {
      free: {
        name: 'Free',
        audience: 'Start with the books you have.',
        price: 'Free',
        detail: 'Every feature. Up to 100 books.',
        action: 'Get Owlaria',
      },
      plus: {
        name: 'Owlaria Plus',
        audience: 'Room for a growing collection.',
        price: 'One-time purchase',
        detail: 'Check the price in the app.',
        action: 'Purchase details',
      },
    },
    table: {
      caption: 'Compare Owlaria Free and Plus',
      item: 'What’s included',
      note: 'Plus requires separate purchases for iOS and macOS. Check the App Store price on the purchase screen in the app.',
      rows: [
        { label: 'Features', free: 'Every feature', plus: 'Every feature' },
        { label: 'Libraries', free: '1', plus: 'No limit' },
        { label: 'Books', free: 'Up to 100', plus: 'No limit' },
      ],
    },
    features: {
      title: 'Some of the features included in Free and Plus',
      more: 'These are just a few of the features available. Explore the features page for more.',
      action: 'View feature details',
      items: [
        'NAS and local folder access',
        'Search by title, author and tag',
        'Filter by reading state and rating',
        'Series management and next unread volume',
        'Single pages, two-page spreads and reading direction',
        'Saved reading position',
      ],
    },
    conditionsTitle: 'Before you choose Plus',
    conditions: [
      {
        title: 'One purchase. No subscription.',
        body: 'Owlaria Plus is a one-time in-app purchase that removes the library and book limits.',
      },
      {
        title: 'Separate purchases for each OS',
        body: 'Plus for iOS and Plus for macOS are separate products. To use Plus on both, purchase it separately on each OS. Purchases cannot be transferred or restored across operating systems.',
      },
      {
        title: 'Check the price in the app',
        body: 'Prices may vary by country or region. Check the App Store price shown on the purchase screen in Owlaria.',
      },
    ],
    availabilityTitle: 'Start with Owlaria.',
    availabilityBody:
      'Choose your platform. Every feature is included in Free.',
    supportTitle: 'Already purchased Plus?',
    supportBody:
      'Find guidance on restoring a purchase, requesting a refund, or a purchase not appearing in the app.',
    supportAction: 'Purchases, restores, and refunds',
    teaser: {
      title: 'Start free. Grow with Plus.',
      free: 'Every feature. One library. Up to 100 books.',
      plus: 'Plus removes the library and book limits with a one-time purchase per OS.',
    },
  },
  ja: {
    metadata: {
      title: 'プランと料金 · Owlaria',
      description:
        'Owlariaの無料版とPlusを比較。すべての機能を1ライブラリ・100冊まで無料で利用できます。PlusはOSごとの買い切りでライブラリ数と冊数の上限を解除します。',
    },
    title: 'プランと料金',
    heading: 'すべての機能を無料で。本が増えたらPlusへ。',
    intro:
      'まずは1ライブラリ・100冊まで無料で。コレクションが増えたら、Plusでライブラリ数と冊数の上限を解除できます。',
    compareAction: 'プランを比較する',
    summaries: {
      free: {
        name: '無料版',
        audience: 'まずは、手元の本ではじめる。',
        price: '無料',
        detail: 'すべての機能を100冊まで。',
        action: '入手方法を見る',
      },
      plus: {
        name: 'Owlaria Plus',
        audience: '本が増えても、上限を気にせず。',
        price: '買い切り',
        detail: '価格はアプリ内で確認。',
        action: '購入条件を確認',
      },
    },
    table: {
      caption: 'Owlariaの無料版とPlusの比較',
      item: '比較項目',
      note: 'PlusはiOS版・macOS版それぞれで購入が必要です。価格はアプリ内の購入画面でご確認ください。',
      rows: [
        { label: '機能', free: '全機能', plus: '全機能' },
        { label: 'ライブラリ', free: '1つまで', plus: '上限なし' },
        { label: '登録冊数', free: '100冊まで', plus: '上限なし' },
      ],
    },
    features: {
      title: '無料版・Plus共通の主な機能',
      more: 'ここで紹介したのは機能の一部です。ほかにも使える機能を、機能紹介ページでご覧いただけます。',
      action: '機能の詳細を見る',
      items: [
        'NAS・ローカルフォルダの読み込み',
        'タイトル・著者・タグ検索',
        '読書状態・評価での絞り込み',
        'シリーズ管理・未読巻への移動',
        '単ページ・見開き・読書方向の切り替え',
        '読書位置の保存',
      ],
    },
    conditionsTitle: 'Plusを選ぶ前に',
    conditions: [
      {
        title: '買い切り。サブスクリプションではありません。',
        body: 'Owlaria Plusは、ライブラリ数と冊数の上限を解除する買い切りのアプリ内課金です。',
      },
      {
        title: 'iOS版とmacOS版は別購入',
        body: 'iOS版とmacOS版のPlusは別商品です。両方でPlusを利用する場合は、それぞれのOSで購入が必要です。異なるOSへの購入の引き継ぎや復元はできません。',
      },
      {
        title: '価格はアプリ内で確認',
        body: '価格は国や地域によって異なる場合があります。Owlariaの購入画面に表示されるApp Store価格をご確認ください。',
      },
    ],
    availabilityTitle: 'Owlariaをはじめよう。',
    availabilityBody:
      'お使いのプラットフォームをお選びください。無料ですべての機能を利用できます。',
    supportTitle: 'Plusを購入済みの方へ',
    supportBody:
      '購入の復元、返金の申請、購入がアプリに反映されない場合の案内はこちら。',
    supportAction: '購入・復元・返金について',
    teaser: {
      title: 'まずは無料で。本が増えたらPlusへ。',
      free: '全機能・1ライブラリ・100冊まで無料。',
      plus: 'PlusはOSごとの買い切りで、ライブラリ数と冊数の上限を解除します。',
    },
  },
};
