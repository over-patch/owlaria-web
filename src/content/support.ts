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
  },
};
