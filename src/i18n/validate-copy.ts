/** Web copy uses named single-brace replacement, not i18next plural resources. */
export function validateLocalizedCopy(
  copy: Record<string, unknown>,
  locales: readonly string[],
  sourceLocale: string,
): string[] {
  const issues: string[] = [];
  const fields = new Map<string, Map<string, Set<string>>>();
  for (const locale of locales) {
    if (!Object.hasOwn(copy, locale)) {
      issues.push(`${locale}: missing locale`);
      continue;
    }
    const root = copy[locale];
    if (!root || typeof root !== 'object' || Array.isArray(root)) {
      issues.push(`${locale}: invalid locale root`);
      continue;
    }
    const paths = new Map<string, Set<string>>();
    const visit = (value: unknown, path: string) => {
      if (typeof value === 'string') {
        if (!value.trim()) issues.push(`${locale}.${path}: empty text`);
        const variables = paths.get(path) ?? new Set<string>();
        for (const match of value.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)) {
          variables.add(match[1]);
        }
        paths.set(path, variables);
      } else if (Array.isArray(value)) {
        if (!value.length) issues.push(`${locale}.${path}: empty collection`);
        // Editorial paragraphs and heading line breaks vary by locale. Compare
        // field/variable coverage without treating line count as translation parity.
        for (const item of value) visit(item, `${path}[]`);
      } else if (value && typeof value === 'object') {
        const entries = Object.entries(value);
        if (!entries.length) {
          issues.push(`${locale}${path ? `.${path}` : ''}: empty object`);
        }
        for (const [key, item] of entries) {
          visit(item, path ? `${path}.${key}` : key);
        }
      }
    };
    visit(root, '');
    fields.set(locale, paths);
  }
  const source = fields.get(sourceLocale);
  const allPaths = new Set(
    [...fields.values()].flatMap((paths) => [...paths.keys()]),
  );
  for (const [locale, paths] of fields) {
    for (const path of allPaths) {
      const translated = paths.get(path);
      const variables = source?.get(path);
      if (!translated) issues.push(`${locale}.${path}: missing field`);
      else if (
        variables &&
        [...variables].sort().join(',') !== [...translated].sort().join(',')
      ) {
        issues.push(`${locale}.${path}: interpolation mismatch`);
      }
    }
  }
  return issues;
}
