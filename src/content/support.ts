import type { Locale } from '../i18n/config';

type SupportHubCopy = {
  metadata: {
    title: string;
    description: string;
  };
  eyebrow: string;
  title: string;
  introduction: string;
  resourcesLabel: string;
  purchases: {
    label: string;
    title: string;
    description: string;
    action: string;
  };
  problemReport: {
    label: string;
    title: string;
    paragraphs: string[];
  };
};

export const supportHubCopy: Record<Locale, SupportHubCopy> = {
  en: {
    metadata: {
      title: 'Support · Owlaria',
      description:
        'Find official Owlaria guidance for purchases, restores, and refunds.',
    },
    eyebrow: 'Owlaria Support',
    title: 'How can we help?',
    introduction:
      'Start with the topic closest to what you need. Verified guidance is available in English and Japanese.',
    resourcesLabel: 'Support topics',
    purchases: {
      label: 'Available now',
      title: 'Purchases, restores, and refunds',
      description:
        'Learn about Owlaria Plus, separate iOS and macOS purchases, Restore Purchases, and Apple refunds.',
      action: 'View purchase guidance',
    },
    problemReport: {
      label: 'In the app',
      title: 'Report an app problem',
      paragraphs: [
        'To report an app-side issue, open Settings > Information > Report a problem in Owlaria. Supported billing errors may also show Report this problem.',
        'This is a one-way problem report and feedback channel. It does not collect contact details, provide individual replies or investigation-result notices, or promise a fix or its timing.',
        'You can review diagnostics before sending and choose whether to include them each time. A category and description are enough to report without diagnostics.',
      ],
    },
  },
  ja: {
    metadata: {
      title: 'サポート · Owlaria',
      description: 'Owlariaの購入・復元・返金に関する公式サポート情報です。',
    },
    eyebrow: 'Owlariaサポート',
    title: 'お困りのことは？',
    introduction:
      '知りたい内容に近い項目からご確認ください。確認済みの案内を日本語と英語で公開しています。',
    resourcesLabel: 'サポート項目',
    purchases: {
      label: '公開中',
      title: '購入・復元・返金について',
      description:
        'Owlaria Plus、iOS版とmacOS版の別購入、購入の復元、Appleへの返金申請をご案内します。',
      action: '購入について確認する',
    },
    problemReport: {
      label: 'アプリ内',
      title: 'アプリの問題を報告する',
      paragraphs: [
        'アプリ側の問題を報告するには、OwlariaでSettings > Information > Report a problemを開いてください。対応する課金エラーでは、Report this problemが表示される場合もあります。',
        'これは一方向の問題報告・フィードバック受付です。連絡先情報を収集せず、個別返信や調査結果の通知、修正の実施や時期を約束しません。',
        '診断情報は送信前に確認し、送信ごとに含めるか選択できます。診断情報を含めず、カテゴリーと問題の説明だけでも報告できます。',
      ],
    },
  },
};
