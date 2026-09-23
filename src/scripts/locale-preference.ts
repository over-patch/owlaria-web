import { serializeLocalePreference } from '../i18n/locale-preference';

for (const link of document.querySelectorAll('[data-locale-preference]')) {
  if (!(link instanceof HTMLAnchorElement)) continue;

  const locale = link.dataset.localePreference;
  if (locale !== 'en' && locale !== 'ja') continue;

  link.addEventListener('click', () => {
    document.cookie = serializeLocalePreference(
      locale,
      window.location.protocol === 'https:',
    );
  });
}
