import { describe, expect, it } from 'vitest';

import { purchaseSupportCopy } from '../../src/content/purchases';
import { supportHubCopy } from '../../src/content/support';

const expectedFaqIds = [
  'price',
  'platforms',
  'restore',
  'refund',
  'after-refund',
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

  it('does not publish contact-form or Support ID guidance before the app flow is ready', () => {
    const publicCopy = JSON.stringify({ purchaseSupportCopy, supportHubCopy });

    expect(publicCopy).not.toMatch(/support form|Support ID/i);
    expect(publicCopy).not.toMatch(/問い合わせフォーム|診断情報|自動添付/i);
  });
});
