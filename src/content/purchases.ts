import type { Locale } from '../i18n/config';

export const purchaseFaqIds = [
  'price',
  'platforms',
  'restore',
  'refund',
  'after-refund',
  'problem-report',
] as const;

export type PurchaseFaqId = (typeof purchaseFaqIds)[number];

type TextPart = {
  kind: 'text';
  value: string;
};

type LinkPart = {
  kind: 'link';
  value: string;
  href: string;
};

export type PurchaseTextPart = TextPart | LinkPart;

export type PurchaseFaq = {
  id: PurchaseFaqId;
  question: string;
  paragraphs: PurchaseTextPart[][];
};

export type PurchaseSupportCopy = {
  metadata: {
    title: string;
    description: string;
  };
  eyebrow: string;
  title: string;
  introduction: string[];
  contentsLabel: string;
  contentsHint: string;
  faq: PurchaseFaq[];
  responsibility: {
    title: string;
    paragraphs: string[];
  };
  externalLinkLabel: string;
  backToTop: string;
  links: {
    restore: string;
    refunds: string;
    requestRefund: string;
  };
};

const text = (value: string): TextPart => ({ kind: 'text', value });
const link = (value: string, href: string): LinkPart => ({
  kind: 'link',
  value,
  href,
});

const links = {
  en: {
    restore: 'https://support.apple.com/en-us/108096',
    refunds: 'https://support.apple.com/en-us/118223',
    requestRefund: 'https://reportaproblem.apple.com/',
  },
  ja: {
    restore: 'https://support.apple.com/ja-jp/108096',
    refunds: 'https://support.apple.com/ja-jp/118223',
    requestRefund: 'https://reportaproblem.apple.com/',
  },
} as const;

export const purchaseSupportCopy: Record<Locale, PurchaseSupportCopy> = {
  en: {
    metadata: {
      title: 'Owlaria Plus purchases, restores, and refunds · Owlaria Support',
      description:
        'Learn about Owlaria Plus pricing, separate iOS and macOS purchases, Restore Purchases, Apple refunds, and purchase support.',
    },
    eyebrow: 'Support / Purchases',
    title: 'Owlaria Plus purchases, restores, and refunds',
    introduction: [
      'You can use every Owlaria feature for free with up to one library and 100 books.',
      'Owlaria Plus is a one-time in-app purchase that removes the library and book limits. It is not a subscription.',
    ],
    contentsLabel: 'On this page',
    contentsHint: 'Choose the question closest to what you need.',
    faq: [
      {
        id: 'price',
        question: 'How much does Owlaria Plus cost?',
        paragraphs: [
          [
            text(
              'The price may vary by country or region. Check the App Store price shown on the purchase screen in Owlaria.',
            ),
          ],
        ],
      },
      {
        id: 'platforms',
        question: 'Does one purchase cover both iOS and macOS?',
        paragraphs: [
          [
            text(
              'No. Owlaria Plus for iOS and Owlaria Plus for macOS are separate products. To use Plus on both platforms, you must purchase it separately on each platform. An iOS purchase cannot be transferred or restored on macOS, and a macOS purchase cannot be transferred or restored on iOS.',
            ),
          ],
        ],
      },
      {
        id: 'restore',
        question: 'How do I restore my purchase?',
        paragraphs: [
          [
            text(
              'Make sure you are using the same operating system and the same Apple Account used for the original purchase. Then select “Restore Purchases” from the Owlaria settings or purchase screen.',
            ),
          ],
          [
            text(
              'You can use the same steps after reinstalling Owlaria or on another device running the same operating system. See Apple’s guide to ',
            ),
            link('restoring in-app purchases', links.en.restore),
            text(' for more information.'),
          ],
        ],
      },
      {
        id: 'refund',
        question: 'How do I request a refund?',
        paragraphs: [
          [
            text('Sign in to '),
            link('reportaproblem.apple.com', links.en.requestRefund),
            text(
              ', select the purchase and reason, and submit your request to Apple. For current instructions and eligibility information, see Apple’s ',
            ),
            link('refund guide', links.en.refunds),
            text('.'),
          ],
          [
            text(
              'Apple handles refund requests, eligibility reviews, approvals, processing, and status updates. Owlaria and overpatch cannot accept, approve, guarantee, or process a refund.',
            ),
          ],
        ],
      },
      {
        id: 'after-refund',
        question: 'What happens to my data after a refund?',
        paragraphs: [
          [
            text(
              'When a refund or purchase revocation is reflected in Owlaria, your access returns to the Free tier. Your existing libraries and books are not deleted or made unavailable. If you are over a Free-tier limit, you cannot add more libraries or books until you are within the limit.',
            ),
          ],
        ],
      },
      {
        id: 'problem-report',
        question:
          'What should I do if a purchase, restore, or completed refund is not reflected in Owlaria?',
        paragraphs: [
          [
            text(
              'If a purchase, restore, or refund already processed by Apple is not reflected in Owlaria, you can send a problem report in the app. Open Settings > Information > Report a problem.',
            ),
          ],
          [
            text(
              'For supported billing errors, select “Report this problem” in the error message to open the form with the billing category and diagnostic context already selected.',
            ),
          ],
          [
            text(
              'The form is a one-way problem report and feedback channel, not individual support. It does not collect your name, email address, reply preference, subject, or attachments. We do not promise an individual reply, notice of investigation results, a fix, or a time when a fix will be available.',
            ),
          ],
          [
            text(
              'A category and description are required. Before sending, you can review diagnostic information such as Support ID, version, build, platform, OS version, locale, and billing error context. Diagnostics are sent only when you choose to include them for that submission. You can report with only a category and description, without diagnostics.',
            ),
          ],
          [
            text(
              'When available, Support ID shows the current RevenueCat App User ID. It is not your Apple Account or an Owlaria account. You do not normally need to enter it manually, and you can report without a Support ID if one cannot be obtained.',
            ),
          ],
          [
            text(
              'After a successful submission, the reference number can be used to confirm the submission and as a reference for questions about accessing or deleting the submitted data.',
            ),
          ],
        ],
      },
    ],
    responsibility: {
      title: 'Who handles refunds?',
      paragraphs: [
        'For refund decisions, billing questions, or the status of an Apple refund, contact Apple.',
        'Use Owlaria’s problem-report form only for app-side problems, such as a purchase, restore, or refund already processed by Apple not being reflected in the app. Do not use the Owlaria problem-report form to request a refund or challenge an Apple decision.',
      ],
    },
    externalLinkLabel: 'Opens an Apple website in a new tab',
    backToTop: 'Back to page contents',
    links: links.en,
  },
  ja: {
    metadata: {
      title: 'Owlaria Plusの購入・復元・返金について · Owlariaサポート',
      description:
        'Owlaria Plusの価格、iOS版とmacOS版の別購入、購入の復元、Appleへの返金申請、購入サポートをご案内します。',
    },
    eyebrow: 'サポート / 購入について',
    title: 'Owlaria Plusの購入・復元・返金について',
    introduction: [
      'Owlariaは、すべての機能を1ライブラリ・100冊まで無料で利用できます。',
      'Owlaria Plusは、ライブラリ数と冊数の上限を解除する買い切りのアプリ内課金です。サブスクリプションではありません。',
    ],
    contentsLabel: 'このページの内容',
    contentsHint: '知りたい内容に近い質問を選んでください。',
    faq: [
      {
        id: 'price',
        question: 'Owlaria Plusはいくらですか？',
        paragraphs: [
          [
            text(
              '価格は国や地域などによって異なる場合があります。アプリの購入画面に表示されるApp Storeの価格をご確認ください。',
            ),
          ],
        ],
      },
      {
        id: 'platforms',
        question: '1回の購入でiOS版とmacOS版の両方を利用できますか？',
        paragraphs: [
          [
            text(
              'いいえ。iOS版とmacOS版のOwlaria Plusは別の商品です。両方でPlusを利用する場合は、それぞれで購入が必要です。iOS版の購入をmacOS版へ、またはmacOS版の購入をiOS版へ移行・復元することはできません。',
            ),
          ],
        ],
      },
      {
        id: 'restore',
        question: '購入を復元するにはどうすればよいですか？',
        paragraphs: [
          [
            text(
              '購入したときと同じOS、同じApple Accountを使用していることを確認し、Owlariaの設定画面または購入画面から「購入を復元（Restore Purchases）」を選択してください。',
            ),
          ],
          [
            text(
              '再インストール後や、同じOSの別の端末でも同じ手順で復元できます。Appleの詳しい案内は',
            ),
            link('AppやApp内課金を再ダウンロード・復元する', links.ja.restore),
            text('をご確認ください。'),
          ],
        ],
      },
      {
        id: 'refund',
        question: '返金を申請するにはどうすればよいですか？',
        paragraphs: [
          [
            link('reportaproblem.apple.com', links.ja.requestRefund),
            text(
              'へサインインし、返金を希望する購入と理由を選択してAppleへ申請してください。詳しい条件と最新の手順は、Appleの',
            ),
            link('返金手続きの案内', links.ja.refunds),
            text('をご確認ください。'),
          ],
          [
            text(
              '返金申請の受付、審査、承認、処理、進捗確認はAppleが行います。Owlariaおよびoverpatchでは、返金の受付・承認・保証・処理を行うことはできません。',
            ),
          ],
        ],
      },
      {
        id: 'after-refund',
        question: '返金後、データはどうなりますか？',
        paragraphs: [
          [
            text(
              '返金または購入の取り消しがOwlariaへ反映されると、利用状態は無料版へ戻ります。既存のライブラリや本は削除されず、閲覧できなくなることもありません。無料版の上限を超えている場合は、上限内になるまで新しいライブラリや本を追加できません。',
            ),
          ],
        ],
      },
      {
        id: 'problem-report',
        question:
          '購入・復元・Appleで処理済みの返金がOwlariaへ反映されない場合はどうすればよいですか？',
        paragraphs: [
          [
            text(
              '購入、復元、またはAppleで処理済みの返金がOwlariaへ反映されない場合は、アプリ内から問題を報告できます。Settings > Information > Report a problemを開いてください。',
            ),
          ],
          [
            text(
              '対応する課金エラーでは、エラー表示の「Report this problem」を選ぶと、課金カテゴリーと診断コンテキストが設定されたフォームを開けます。',
            ),
          ],
          [
            text(
              'フォームは個別サポートではなく、一方向の問題報告・フィードバック受付です。氏名、メールアドレス、返信希望、件名、添付ファイルは収集しません。個別返信、調査結果の通知、修正の実施や時期を約束しません。',
            ),
          ],
          [
            text(
              'カテゴリーと問題の説明は必須です。Support ID、バージョン、ビルド、プラットフォーム、OSバージョン、ロケール、課金エラーコンテキストなどの診断情報は送信前に確認でき、送信ごとに含めることを選んだ場合だけ送信されます。診断情報を含めず、カテゴリーと問題の説明だけでも報告できます。',
            ),
          ],
          [
            text(
              'Support IDは、取得できる場合に表示される現在のRevenueCat App User IDです。Apple AccountやOwlariaのアカウントではありません。通常は手入力する必要はありません。取得できない場合もSupport IDなしで報告できます。',
            ),
          ],
          [
            text(
              '送信に成功すると表示される受付番号は、送信の確認と、送信データの確認・削除に関する相談時の参照に利用できます。',
            ),
          ],
        ],
      },
    ],
    responsibility: {
      title: '返金についてはどこへ問い合わせればよいですか？',
      paragraphs: [
        '返金そのもの、請求内容、Appleでの返金状況については、Appleへお問い合わせください。',
        'Owlariaの問題報告フォームは、購入・復元・Appleで処理済みの返金がアプリへ反映されない場合など、アプリ側の問題にだけ使用してください。返金申請やAppleの判断についてOwlariaの問題報告フォームを使用しないでください。',
      ],
    },
    externalLinkLabel: 'AppleのWebサイトを新しいタブで開きます',
    backToTop: 'ページ内の目次へ戻る',
    links: links.ja,
  },
};
