type Locale = 'en' | 'ja';

type ProblemReportPart = {
  kind: string;
  value: string;
  href?: string;
};

type PurchaseContent = Record<
  Locale,
  {
    faq: Array<{
      id: string;
      paragraphs: ProblemReportPart[][];
    }>;
  }
>;

type SupportHubContent = Record<
  Locale,
  {
    problemReport: {
      paragraphs: string[];
    };
  }
>;

export function assertProblemReportContentContract(
  purchases: PurchaseContent,
  supportHub: SupportHubContent,
): void {
  const forbiddenPromises: Record<Locale, RegExp[]> = {
    en: [
      /\bwe (?:will|can) (?:reply|respond|notify|investigate|fix)\b/i,
      /\byou will receive (?:a |an )?(?:reply|response|investigation result|fix)\b/i,
      /\bwe (?:promise|guarantee) (?:a |an )?(?:reply|response|investigation result|fix)\b/i,
    ],
    ja: [
      /(?:個別)?(?:返信|回答)(?:します|いたします|を行います|をお送りします)/,
      /調査結果を?(?:通知|案内|お知らせ)(?:します|いたします)/,
      /修正を?(?:保証|実施)(?:します|いたします)/,
      /修正時期(?:を|をご)?(?:通知|案内|お知らせ)(?:します|いたします)/,
    ],
  };

  for (const locale of ['en', 'ja'] as const) {
    const faq = purchases[locale].faq.find(({ id }) => id === 'problem-report');

    if (!faq) {
      throw new Error('Problem-report FAQ is required');
    }

    const parts = faq.paragraphs.flat();
    const combinedText = [
      ...parts.map(({ value }) => value),
      ...supportHub[locale].problemReport.paragraphs,
    ].join(' ');

    if (
      parts.some(({ kind, href }) => kind === 'link' || href !== undefined) ||
      /(?:https?:\/\/|mailto:)/i.test(combinedText)
    ) {
      throw new Error('Problem-report guidance must not contain links');
    }

    if (
      forbiddenPromises[locale].some((pattern) => pattern.test(combinedText))
    ) {
      throw new Error(
        'Problem-report guidance must not promise a response or fix',
      );
    }
  }
}
