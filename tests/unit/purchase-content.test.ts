import { describe, expect, it } from 'vitest';

import { purchaseSupportCopy } from '../../src/content/purchases';
import { supportHubCopy } from '../../src/content/support';

const expectedFaqIds = [
  'price',
  'platforms',
  'restore',
  'refund',
  'after-refund',
  'problem-report',
] as const;

function localeText(locale: 'en' | 'ja'): string {
  const page = purchaseSupportCopy[locale];

  return [
    page.title,
    ...page.introduction,
    ...page.faq.flatMap((item) => [
      item.question,
      ...item.paragraphs.flatMap((paragraph) =>
        paragraph.map((part) => part.value),
      ),
    ]),
    page.responsibility.title,
    ...page.responsibility.paragraphs,
  ].join(' ');
}

describe('purchase support content', () => {
  it('publishes the same stable FAQ structure in English and Japanese', () => {
    for (const locale of ['en', 'ja'] as const) {
      expect(purchaseSupportCopy[locale].faq.map(({ id }) => id)).toEqual(
        expectedFaqIds,
      );
    }
  });

  it('describes a one-time purchase without hard-coded prices or unrelated stores', () => {
    const combinedText = `${localeText('en')} ${localeText('ja')}`;

    expect(localeText('en')).toContain('one-time in-app purchase');
    expect(localeText('en')).toContain('not a subscription');
    expect(localeText('ja')).toContain('買い切りのアプリ内課金');
    expect(localeText('ja')).toContain('サブスクリプションではありません');
    expect(combinedText).not.toMatch(
      /(?:[$€£¥]\s?\d|\d[\d,.]*\s?(?:USD|JPY|円|ドル))/i,
    );
    expect(combinedText).not.toMatch(/Google Play|Stripe|Web購入/i);
  });

  it('makes platform purchase and restore boundaries explicit in both locales', () => {
    expect(localeText('en')).toContain('separate products');
    expect(localeText('en')).toContain(
      'An iOS purchase cannot be transferred or restored on macOS',
    );
    expect(localeText('en')).toContain(
      'the same operating system and the same Apple Account used for the original purchase',
    );
    expect(localeText('ja')).toContain('別の商品');
    expect(localeText('ja')).toContain('移行・復元することはできません');
    expect(localeText('ja')).toContain(
      '購入したときと同じOS、同じApple Accountを使用していること',
    );
  });

  it('assigns refunds to Apple and preserves existing user data', () => {
    expect(localeText('en')).toContain(
      'Apple handles refund requests, eligibility reviews, approvals, processing, and status updates',
    );
    expect(localeText('en')).toContain(
      'existing libraries and books are not deleted or made unavailable',
    );
    expect(localeText('en')).toContain(
      'cannot add more libraries or books until you are within the limit',
    );
    expect(localeText('ja')).toContain(
      '返金申請の受付、審査、承認、処理、進捗確認はAppleが行います',
    );
    expect(localeText('ja')).toContain(
      '既存のライブラリや本は削除されず、閲覧できなくなることもありません',
    );
    expect(localeText('ja')).toContain(
      '上限内になるまで新しいライブラリや本を追加できません',
    );
  });

  it('uses locale-specific official Apple support links', () => {
    expect(purchaseSupportCopy.en.links).toEqual({
      restore: 'https://support.apple.com/en-us/108096',
      refunds: 'https://support.apple.com/en-us/118223',
      requestRefund: 'https://reportaproblem.apple.com/',
    });
    expect(purchaseSupportCopy.ja.links).toEqual({
      restore: 'https://support.apple.com/ja-jp/108096',
      refunds: 'https://support.apple.com/ja-jp/118223',
      requestRefund: 'https://reportaproblem.apple.com/',
    });
  });

  it('publishes the implemented in-app problem-report routes in both locales', () => {
    for (const locale of ['en', 'ja'] as const) {
      expect(localeText(locale)).toContain(
        'Settings > Information > Report a problem',
      );
      expect(localeText(locale)).toContain('Report this problem');
    }

    expect(localeText('en')).toContain(
      'billing category and diagnostic context already selected',
    );
    expect(localeText('ja')).toContain(
      '課金カテゴリーと診断コンテキストが設定されたフォーム',
    );

    expect(supportHubCopy.en.problemReport.title).toBe('Report an app problem');
    expect(supportHubCopy.ja.problemReport.title).toBe(
      'アプリの問題を報告する',
    );
  });

  it('defines a one-way intake without contact collection or response promises', () => {
    expect(localeText('en')).toContain(
      'a one-way problem report and feedback channel, not individual support',
    );
    expect(localeText('en')).toContain(
      'does not collect your name, email address, reply preference, subject, or attachments',
    );
    expect(localeText('en')).toContain(
      'do not promise an individual reply, notice of investigation results, a fix, or a time when a fix will be available',
    );
    expect(localeText('ja')).toContain(
      '個別サポートではなく、一方向の問題報告・フィードバック受付',
    );
    expect(localeText('ja')).toContain(
      '氏名、メールアドレス、返信希望、件名、添付ファイルは収集しません',
    );
    expect(localeText('ja')).toContain(
      '個別返信、調査結果の通知、修正の実施や時期を約束しません',
    );

    const publicCopy = JSON.stringify({ purchaseSupportCopy, supportHubCopy });
    expect(publicCopy).not.toMatch(/contact us|お問い合わせフォーム/i);
    expect(publicCopy).not.toMatch(/mailto:/i);
    expect(JSON.stringify(supportHubCopy)).not.toMatch(/https?:\/\//i);
  });

  it('makes diagnostics optional per submission and explains Support ID', () => {
    expect(localeText('en')).toContain(
      'A category and description are required',
    );
    expect(localeText('en')).toContain(
      'Support ID, version, build, platform, OS version, locale, and billing error context',
    );
    expect(localeText('en')).toContain(
      'Diagnostics are sent only when you choose to include them for that submission',
    );
    expect(localeText('en')).toContain(
      'only a category and description, without diagnostics',
    );
    expect(localeText('en')).toContain('current RevenueCat App User ID');
    expect(localeText('en')).toContain(
      'not your Apple Account or an Owlaria account',
    );
    expect(localeText('en')).toContain(
      'do not normally need to enter it manually',
    );
    expect(localeText('en')).toContain(
      'report without a Support ID if one cannot be obtained',
    );
    expect(localeText('en')).toContain(
      'reference number can be used to confirm the submission',
    );
    expect(localeText('en')).toContain(
      'questions about accessing or deleting the submitted data',
    );

    expect(localeText('ja')).toContain('カテゴリーと問題の説明は必須です');
    expect(localeText('ja')).toContain(
      'Support ID、バージョン、ビルド、プラットフォーム、OSバージョン、ロケール、課金エラーコンテキスト',
    );
    expect(localeText('ja')).toContain(
      '診断情報は送信前に確認でき、送信ごとに含めることを選んだ場合だけ送信されます',
    );
    expect(localeText('ja')).toContain(
      '診断情報を含めず、カテゴリーと問題の説明だけでも報告できます',
    );
    expect(localeText('ja')).toContain('現在のRevenueCat App User ID');
    expect(localeText('ja')).toContain(
      'Apple AccountやOwlariaのアカウントではありません',
    );
    expect(localeText('ja')).toContain('通常は手入力する必要はありません');
    expect(localeText('ja')).toContain(
      '取得できない場合もSupport IDなしで報告できます',
    );
    expect(localeText('ja')).toContain(
      '受付番号は、送信の確認と、送信データへのアクセス・削除に関する質問時の参照',
    );
  });

  it('includes problem reporting in Support hub metadata', () => {
    expect(supportHubCopy.en.metadata.description).toContain(
      'reporting app problems',
    );
    expect(supportHubCopy.ja.metadata.description).toContain('問題報告');
  });

  it('keeps the one-way and diagnostic-consent boundaries in the Support hub', () => {
    const english = supportHubCopy.en.problemReport.paragraphs.join(' ');
    const japanese = supportHubCopy.ja.problemReport.paragraphs.join(' ');

    expect(english).toContain('one-way problem report and feedback channel');
    expect(english).toContain('does not collect contact details');
    expect(english).toContain('provide individual replies');
    expect(english).toContain('choose whether to include them each time');
    expect(japanese).toContain('一方向の問題報告・フィードバック受付');
    expect(japanese).toContain('連絡先情報を収集せず');
    expect(japanese).toContain('個別返信や調査結果の通知');
    expect(japanese).toContain('送信ごとに含めるか選択できます');
  });

  it('keeps refund decisions with Apple and limits reports to app-side state', () => {
    expect(localeText('en')).toContain(
      'Do not use the Owlaria problem-report form to request a refund or challenge an Apple decision',
    );
    expect(localeText('ja')).toContain(
      '返金申請やAppleの判断についてOwlariaの問題報告フォームを使用しないでください',
    );
  });
});
