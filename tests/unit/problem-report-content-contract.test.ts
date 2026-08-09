import { describe, expect, it } from 'vitest';

import { purchaseSupportCopy } from '../../src/content/purchases';
import { supportHubCopy } from '../../src/content/support';
import { assertProblemReportContentContract } from './helpers/problem-report-content-contract';

describe('problem-report content contract', () => {
  it('accepts the published English and Japanese guidance', () => {
    expect(() =>
      assertProblemReportContentContract(purchaseSupportCopy, supportHubCopy),
    ).not.toThrow();
  });

  it('rejects a web-form link in the purchase problem-report FAQ', () => {
    const purchases = structuredClone(purchaseSupportCopy);
    const problemReport = purchases.en.faq.find(
      ({ id }) => id === 'problem-report',
    );

    expect(problemReport).toBeDefined();
    problemReport?.paragraphs.push([
      {
        kind: 'link',
        value: 'Open the web form',
        href: 'https://example.com/support-form',
      },
    ]);

    expect(() =>
      assertProblemReportContentContract(purchases, supportHubCopy),
    ).toThrow('Problem-report guidance must not contain links');
  });

  it.each([
    ['en', 'We will reply to every report.'],
    ['en', 'We can provide individual replies.'],
    ['en', 'You will receive an investigation result.'],
    ['ja', '問題報告へ個別返信します。'],
    ['ja', '個別返信や調査結果の通知を行います。'],
    ['ja', '調査結果をお知らせします。'],
    ['ja', '修正時期をご案内します。'],
  ] as const)(
    'rejects a contradictory %s response promise',
    (locale, promise) => {
      const supportHub = structuredClone(supportHubCopy);
      supportHub[locale].problemReport.paragraphs.push(promise);

      expect(() =>
        assertProblemReportContentContract(purchaseSupportCopy, supportHub),
      ).toThrow('Problem-report guidance must preserve the canonical policy');
    },
  );

  it('rejects a contradictory promise in the purchase responsibility section', () => {
    const purchases = structuredClone(purchaseSupportCopy);
    purchases.en.responsibility.paragraphs.push(
      'Owlaria will reply with an investigation result.',
    );

    expect(() =>
      assertProblemReportContentContract(purchases, supportHubCopy),
    ).toThrow('Problem-report guidance must preserve the canonical policy');
  });
});
