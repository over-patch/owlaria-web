import { describe, expect, it } from 'vitest';

import {
  privacyPolicyCopy,
  termsCopy,
  type LegalBlock,
  type LegalDocumentCopy,
} from '../../src/content/legal';

function blockText(block: LegalBlock): string {
  if (block.kind === 'paragraph') return block.text;
  if (block.kind === 'list') return block.items.join(' ');
  if (block.kind === 'links') {
    return block.items.map(({ label, href }) => `${label} ${href}`).join(' ');
  }
  return `${block.title} ${block.blocks.map(blockText).join(' ')}`;
}

function documentText(copy: LegalDocumentCopy): string {
  return [
    copy.title,
    copy.effectiveDate,
    copy.updatedDate,
    ...copy.sections.flatMap((section) => [
      section.title,
      ...section.blocks.map(blockText),
    ]),
  ].join(' ');
}

describe('legal public copy', () => {
  it('keeps the English and Japanese document structures aligned', () => {
    for (const copy of [privacyPolicyCopy, termsCopy]) {
      expect(copy.en.sections.map(({ id }) => id)).toEqual(
        copy.ja.sections.map(({ id }) => id),
      );
    }
  });

  it('publishes the agreed effective date without placeholders', () => {
    expect(privacyPolicyCopy.en.effectiveDate).toBe('August 15, 2026');
    expect(privacyPolicyCopy.ja.effectiveDate).toBe('2026年8月15日');
    expect(termsCopy.en.effectiveDate).toBe('August 15, 2026');
    expect(termsCopy.ja.effectiveDate).toBe('2026年8月15日');

    const copy = JSON.stringify({ privacyPolicyCopy, termsCopy });
    expect(copy).not.toMatch(/\[(?:YYYY|Month)|being prepared|準備しています/);
  });

  it('states the current problem-report retention and private handoff boundaries', () => {
    const en = documentText(privacyPolicyCopy.en);
    const ja = documentText(privacyPolicyCopy.ja);

    expect(en).toContain('do not set a fixed retention period');
    expect(en).toContain('Private GitHub Issue');
    expect(en).toContain(
      'problem description, platform, operating-system version, application version, billing state',
    );
    expect(en).toContain(
      'we do not transfer the Support ID or any other field from the optional diagnostic payload to GitHub',
    );
    expect(ja).toContain('固定の保存期間や自動削除を設定しません');
    expect(ja).toContain('非公開GitHub Issue');
    expect(ja).toContain(
      '問題報告本文、プラットフォーム、OSバージョン、アプリバージョン、課金状態',
    );
    expect(ja).toContain(
      'Support IDその他の任意の診断情報の送信項目はGitHubへ転記しません',
    );
  });

  it.each([
    [
      'en',
      'In the Owlaria app, diagnostic inclusion is on by default when the form opens. You can review the information and turn it off before submitting.',
    ],
    [
      'ja',
      'Owlariaアプリでは、フォームを開いた時点で診断情報の添付がONになっています。送信前に内容を確認し、OFFへ変更できます。',
    ],
  ] as const)(
    'explains the app diagnostic default and opt-out in %s',
    (locale, explanation) => {
      const collection = privacyPolicyCopy[locale].sections.find(
        ({ id }) => id === 'information',
      );
      expect(collection).toBeDefined();
      expect(collection?.blocks.map(blockText).join(' ')).toContain(
        explanation,
      );
    },
  );

  it('translates Japanese legal instructions while retaining product names and identifiers', () => {
    const ja = [privacyPolicyCopy.ja, termsCopy.ja].map(documentText).join(' ');

    expect(ja).toContain('生ログ');
    expect(ja).toContain('無料版とOwlaria Plus');
    expect(ja).toContain('買い切りのアプリ内購入');
    expect(ja).toContain('購入の復元');
    expect(ja).not.toMatch(
      /diagnostic|license|\bRestore\b|\bFree\b|\bbackup\b|\bdata source\b/,
    );
    expect(ja).toContain('Support ID');
    expect(ja).toContain('Apple Account');
  });

  it('names the operator, providers, privacy contact, and request disclosure', () => {
    for (const locale of ['en', 'ja'] as const) {
      const text = documentText(privacyPolicyCopy[locale]);

      expect(text).toContain('overpatch');
      expect(text).toContain('Apple');
      expect(text).toContain('RevenueCat');
      expect(text).toContain('Google / Firebase');
      expect(text).toContain('GitHub');
      expect(text).toContain('overpatch.ch@gmail.com');
    }

    expect(documentText(privacyPolicyCopy.en)).toContain(
      'provided without delay upon a valid request',
    );
    expect(documentText(privacyPolicyCopy.ja)).toContain(
      '有効な請求に応じて遅滞なく提供します',
    );
  });

  it('uses the Standard EULA and preserves general-audience minor access', () => {
    const en = documentText(termsCopy.en);
    const ja = documentText(termsCopy.ja);

    expect(en).toContain('Apple Standard EULA');
    expect(en).toContain('general-audience application');
    expect(en).toContain('parent or legal guardian');
    expect(ja).toContain('Apple Standard EULA');
    expect(ja).toContain('全年齢の一般ユーザー');
    expect(ja).toContain('親権者その他の法定代理人');
  });

  it('identifies the personal Apple contract holder as an overpatch member', () => {
    expect(documentText(termsCopy.en)).toContain(
      'personally held by one of the members who jointly operates overpatch',
    );
    expect(documentText(termsCopy.ja)).toContain(
      'overpatchを共同運営する構成員の一人が個人として保有する',
    );
  });

  it('does not publish internal legal-review risk acceptance', () => {
    const publicCopy = JSON.stringify({ privacyPolicyCopy, termsCopy });

    expect(publicCopy).not.toMatch(/legal review|法務review|予算上の理由/i);
  });
});

it('keeps translated provider destinations independent of the browser language', () => {
  expect(documentText(privacyPolicyCopy.en)).toContain(
    'https://policies.google.com/privacy?hl=en',
  );
  expect(documentText(privacyPolicyCopy.en)).toContain(
    'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
  );
  expect(documentText(privacyPolicyCopy.ja)).toContain(
    'https://policies.google.com/privacy?hl=ja',
  );
  expect(documentText(privacyPolicyCopy.ja)).toContain(
    'https://docs.github.com/ja/site-policy/privacy-policies/github-general-privacy-statement',
  );
});
