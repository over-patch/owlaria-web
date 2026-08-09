type PurchaseContent =
  typeof import('../../../src/content/purchases').purchaseSupportCopy;
type SupportHubContent =
  typeof import('../../../src/content/support').supportHubCopy;

const locales = ['en', 'ja'] as const;

const canonicalPolicy = {
  en: {
    question:
      'What should I do if a purchase, restore, or completed refund is not reflected in Owlaria?',
    faqParagraphs: [
      'If a purchase, restore, or refund already processed by Apple is not reflected in Owlaria, you can send a problem report in the app. Open Settings > Information > Report a problem.',
      'For supported billing errors, select “Report this problem” in the error message to open the form with the billing category and diagnostic context already selected.',
      'The form is a one-way problem report and feedback channel, not individual support. It does not collect your name, email address, reply preference, subject, or attachments. We do not promise an individual reply, notice of investigation results, a fix, or a time when a fix will be available.',
      'A category and description are required. Before sending, you can review diagnostic information such as Support ID, version, build, platform, OS version, locale, and billing error context. Diagnostics are sent only when you choose to include them for that submission. You can report with only a category and description, without diagnostics.',
      'When available, Support ID shows the current RevenueCat App User ID. It is not your Apple Account or an Owlaria account. You do not normally need to enter it manually, and you can report without a Support ID if one cannot be obtained.',
      'After a successful submission, the reference number can be used to confirm the submission and as a reference for questions about accessing or deleting the submitted data.',
    ],
    responsibilityParagraphs: [
      'For refund decisions, billing questions, or the status of an Apple refund, contact Apple.',
      'Use Owlaria’s problem-report form only for app-side problems, such as a purchase, restore, or refund already processed by Apple not being reflected in the app. Do not use the Owlaria problem-report form to request a refund or challenge an Apple decision.',
    ],
    hubTitle: 'Report an app problem',
    hubParagraphs: [
      'To report an app-side issue, open Settings > Information > Report a problem in Owlaria. Supported billing errors may also show Report this problem.',
      'This is a one-way problem report and feedback channel. It does not collect contact details, provide individual replies or investigation-result notices, or promise a fix or its timing.',
      'You can review diagnostics before sending and choose whether to include them each time. A category and description are enough to report without diagnostics.',
    ],
  },
  ja: {
    question:
      '購入・復元・Appleで処理済みの返金がOwlariaへ反映されない場合はどうすればよいですか？',
    faqParagraphs: [
      '購入、復元、またはAppleで処理済みの返金がOwlariaへ反映されない場合は、アプリ内から問題を報告できます。Settings > Information > Report a problemを開いてください。',
      '対応する課金エラーでは、エラー表示の「Report this problem」を選ぶと、課金カテゴリーと診断コンテキストが設定されたフォームを開けます。',
      'フォームは個別サポートではなく、一方向の問題報告・フィードバック受付です。氏名、メールアドレス、返信希望、件名、添付ファイルは収集しません。個別返信、調査結果の通知、修正の実施や時期を約束しません。',
      'カテゴリーと問題の説明は必須です。Support ID、バージョン、ビルド、プラットフォーム、OSバージョン、ロケール、課金エラーコンテキストなどの診断情報は送信前に確認でき、送信ごとに含めることを選んだ場合だけ送信されます。診断情報を含めず、カテゴリーと問題の説明だけでも報告できます。',
      'Support IDは、取得できる場合に表示される現在のRevenueCat App User IDです。Apple AccountやOwlariaのアカウントではありません。通常は手入力する必要はありません。取得できない場合もSupport IDなしで報告できます。',
      '送信に成功すると表示される受付番号は、送信の確認と、送信データへのアクセス・削除に関する質問時の参照に利用できます。',
    ],
    responsibilityParagraphs: [
      '返金そのもの、請求内容、Appleでの返金状況については、Appleへお問い合わせください。',
      'Owlariaの問題報告フォームは、購入・復元・Appleで処理済みの返金がアプリへ反映されない場合など、アプリ側の問題にだけ使用してください。返金申請やAppleの判断についてOwlariaの問題報告フォームを使用しないでください。',
    ],
    hubTitle: 'アプリの問題を報告する',
    hubParagraphs: [
      'アプリ側の問題を報告するには、OwlariaでSettings > Information > Report a problemを開いてください。対応する課金エラーでは、Report this problemが表示される場合もあります。',
      'これは一方向の問題報告・フィードバック受付です。連絡先情報を収集せず、個別返信や調査結果の通知、修正の実施や時期を約束しません。',
      '診断情報は送信前に確認し、送信ごとに含めるか選択できます。診断情報を含めず、カテゴリーと問題の説明だけでも報告できます。',
    ],
  },
} as const;

export function assertProblemReportContentContract(
  purchases: PurchaseContent,
  supportHub: SupportHubContent,
): void {
  for (const locale of locales) {
    const faq = purchases[locale].faq.find(({ id }) => id === 'problem-report');

    if (!faq) {
      throw new Error('Problem-report FAQ is required');
    }

    const parts = faq.paragraphs.flat();
    const hub = supportHub[locale].problemReport;
    const combinedText = [
      ...parts.map(({ value }) => value),
      ...hub.paragraphs,
    ].join(' ');

    if (
      parts.some(({ kind }) => kind === 'link') ||
      /(?:https?:\/\/|mailto:)/i.test(combinedText)
    ) {
      throw new Error('Problem-report guidance must not contain links');
    }

    const actualPolicy = {
      question: faq.question,
      faqParagraphs: faq.paragraphs.map((paragraph) =>
        paragraph.map(({ value }) => value).join(''),
      ),
      responsibilityParagraphs: purchases[locale].responsibility.paragraphs,
      hubTitle: hub.title,
      hubParagraphs: hub.paragraphs,
    };

    if (
      JSON.stringify(actualPolicy) !== JSON.stringify(canonicalPolicy[locale])
    ) {
      throw new Error(
        'Problem-report guidance must preserve the canonical policy',
      );
    }
  }
}
