import { describe, expect, it } from 'vitest';

import { PROBLEM_REPORT_CATEGORIES } from '../../src/lib/problem-report';
import { problemReportCopy } from '../../src/content/problem-report';

function allText(locale: 'en' | 'ja') {
  const copy = problemReportCopy[locale];
  return JSON.stringify(copy);
}

describe('Web problem-report content', () => {
  it('publishes matching category keys in English and Japanese', () => {
    for (const locale of ['en', 'ja'] as const) {
      expect(Object.keys(problemReportCopy[locale].categories)).toEqual(
        PROBLEM_REPORT_CATEGORIES,
      );
    }
  });

  it('states the one-way, no-reply, and no-fix-guarantee boundary', () => {
    expect(allText('en')).toContain('one-way');
    expect(allText('en')).toContain('individual reply');
    expect(allText('en')).toContain('guarantee');
    expect(allText('ja')).toContain('一方向');
    expect(allText('ja')).toContain('個別返信');
    expect(allText('ja')).toContain('保証');
  });

  it('warns against every prohibited kind of information', () => {
    for (const phrase of [
      'name',
      'email',
      'Apple Account',
      'Support ID',
      'file path',
      'book or library',
      'raw log',
      'receipt',
      'transaction ID',
      'credential',
    ]) {
      expect(allText('en')).toContain(phrase);
    }
    for (const phrase of [
      '氏名',
      'メール',
      'Apple Account',
      'Support ID',
      'ファイルパス',
      '書籍・ライブラリ',
      'raw log',
      'receipt',
      'transaction ID',
      'credential',
    ]) {
      expect(allText('ja')).toContain(phrase);
    }
  });

  it('links privacy and explains the diagnostic-capable in-app alternative', () => {
    expect(problemReportCopy.en.privacy.linkLabel).toBe('Privacy Policy');
    expect(problemReportCopy.ja.privacy.linkLabel).toBe('プライバシーポリシー');
    expect(allText('en')).toContain('diagnostic information');
    expect(allText('en')).toContain(
      'Settings > Information > Report a problem',
    );
    expect(allText('ja')).toContain('診断情報');
    expect(allText('ja')).toContain(
      'Settings > Information > Report a problem',
    );
  });

  it('has localized validation, transport, success, and copy states', () => {
    for (const locale of ['en', 'ja'] as const) {
      const copy = problemReportCopy[locale];
      expect(Object.keys(copy.errors)).toEqual([
        'validation',
        'suspended',
        'payload_too_large',
        'rate_limited',
        'server',
        'timeout',
        'offline',
      ]);
      expect(copy.success.referenceLabel).not.toBe('');
      expect(copy.success.copy).not.toBe('');
      expect(copy.success.copied).not.toBe('');
      expect(copy.noScript).not.toBe('');
    }
  });
});
