import { describe, expect, it } from 'vitest';

import { homeCopy, platformAction, platforms } from '../../src/content/home';

describe('homepage content', () => {
  it('leads with turning existing folders into a comic library', () => {
    expect(homeCopy.en.hero.heading).toBe(
      'Keep your folders. Build the comic library you want.',
    );
    expect(homeCopy.ja.hero.heading).toBe(
      'フォルダはそのまま。理想のコミックライブラリへ。',
    );
    expect(homeCopy.en.hero.eyebrow).toBe(
      'A comic library that does not clutter your storage',
    );
    expect(homeCopy.ja.hero.eyebrow).toBe('保存先を汚さないコミックライブラリ');
    expect(homeCopy.en.hero.benefits).toEqual([
      {
        title: 'Add your folders as they are',
        body: 'Add NAS and local folders to Owlaria without changing their structure.',
      },
      {
        title: 'Keep your storage uncluttered',
        body: 'Owlaria keeps tags, series, ratings, and covers separate from your storage, without changing folders or writing extra management files.',
      },
    ]);
    expect(homeCopy.ja.hero.benefits).toEqual([
      {
        title: '今のフォルダをそのまま登録',
        body: 'NASやローカルフォルダを、構成を変えずにOwlariaへ登録できます。',
      },
      {
        title: 'フォルダは汚さない',
        body: 'タグ・シリーズ・評価・表紙などはOwlariaの中で管理。ファイルやフォルダ構成を変えず、余計な管理ファイルも書き込みません。',
      },
    ]);
    expect(homeCopy.ja.hero.heading).not.toBe(homeCopy.en.hero.heading);
  });

  it('keeps the homepage focused by omitting a duplicate product story', () => {
    expect('productStory' in homeCopy.en).toBe(false);
    expect('productStory' in homeCopy.ja).toBe(false);
  });

  it('uses descriptive localized search titles', () => {
    expect(homeCopy.en.metadata.title).toBe(
      'Owlaria — Comic Library for NAS & Local Folders',
    );
    expect(homeCopy.ja.metadata.title).toBe(
      'Owlaria — NAS・ローカル対応コミックライブラリ',
    );
  });

  it('offers useful next steps in the hero', () => {
    expect(homeCopy.en.hero.actions).toEqual({
      features: 'Explore features',
      purchases: 'See Free and Plus',
    });
    expect(homeCopy.ja.hero.actions).toEqual({
      features: '機能を見る',
      purchases: '無料範囲とPlusを見る',
    });
  });

  it('leads with the three concrete Owlaria advantages', () => {
    expect(homeCopy.en.features.heading).toBe(
      'Keep your folders. Organize and read your way.',
    );
    expect(homeCopy.ja.features.heading).toBe(
      'フォルダはそのまま。整理も、読み方も、思いどおりに。',
    );
    expect(homeCopy.en.features.items.map(({ title }) => title)).toEqual([
      'Add folders as they are',
      'Organize without touching files',
    ]);
    expect(homeCopy.ja.features.items.map(({ title }) => title)).toEqual([
      'フォルダをそのまま登録',
      '原本に触れずに整理',
    ]);
    expect(homeCopy.ja.features.reader).toEqual({
      number: '03',
      title: 'コミックに合わせて読み方を選択',
      body: '作品やその日の読み方に合わせて、表示スタイルをいつでも切り替えられます。',
      modes: [
        {
          title: '作品に合わせた読み方向',
          options: ['右開き', '左開き', '縦読み'],
        },
        {
          title: 'ページの表示方法',
          options: ['単ページ', '見開き'],
        },
        {
          title: '連続スクロール表示',
          options: ['連続スクロール'],
        },
      ],
    });
  });

  it('describes the localized macOS screenshot showcase', () => {
    expect(homeCopy.en.screenshotShowcase).toEqual({
      eyebrow: 'See Owlaria in action',
      heading: 'When you read, nothing gets in the way.',
      body: 'Switch between single pages and spreads to suit each comic.',
      placeholderLabel: 'A comic spread in the Owlaria viewer on macOS',
    });
    expect(homeCopy.ja.screenshotShowcase).toEqual({
      eyebrow: '実際のアプリ画面',
      heading: '読むときは、作品だけに集中。',
      body: '単ページも見開きも、作品に合わせて心地よく表示できます。',
      placeholderLabel: 'macOS版Owlariaビューアで表示したコミックの見開き',
    });
  });

  it('describes localized product screenshots in the hero', () => {
    expect(homeCopy.en.hero.preview).toEqual({
      label: 'Owlaria product preview',
      desktopLabel: 'Mac library screenshot',
      mobileLabel: 'iPhone library screenshot',
    });
    expect(homeCopy.ja.hero.preview).toEqual({
      label: 'Owlariaのアプリ画面',
      desktopLabel: 'Mac版ライブラリ画面',
      mobileLabel: 'iPhone版ライブラリ画面',
    });
  });

  it('states the supported formats and password-protected archive formats', () => {
    expect(homeCopy.en.compatibility).toEqual({
      eyebrow: 'Compatibility',
      heading: 'Open the files you already have.',
      body: [
        'Add archives to your library and start reading without converting files or extracting them into folders first.',
      ],
      formats: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7', 'LZH', 'PDF'],
      passwordLabel: 'Password-protected archives',
      passwordFormats: 'ZIP · CBZ · RAR · CBR · 7Z · CB7',
    });
    expect(homeCopy.ja.compatibility).toEqual({
      eyebrow: '対応形式',
      heading: 'いつものファイルを、そのまま開ける。',
      body: [
        'ファイルを変換したり、アーカイブを展開したりせず、ライブラリに登録してそのまま閲覧できます。',
      ],
      formats: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7', 'LZH', 'PDF'],
      passwordLabel: 'パスワード付きアーカイブにも対応',
      passwordFormats: 'ZIP · CBZ · RAR · CBR · 7Z · CB7',
    });
  });

  it('uses the established design claim instead of an absolute guarantee', () => {
    expect(JSON.stringify(homeCopy)).not.toMatch(
      /never rewrites|never modifies|一切変更|絶対に変更/i,
    );
  });

  it('links the broader capability teaser to the localized feature catalog', () => {
    expect(homeCopy.en.capabilities.action).toBe('Explore every feature');
    expect(homeCopy.ja.capabilities.action).toBe('すべての機能を見る');
    expect(homeCopy.en.capabilities.body).toEqual([
      'Find what you want, even among thousands of books.',
      'Keep series together, protect private libraries, and see how your reading changes over time.',
    ]);
    expect(homeCopy.ja.capabilities.body).toEqual([
      '何千冊の中からでも、読みたい一冊をすぐに見つけられます。',
      'シリーズをまとめ、プライベートな本棚を守り、読書の変化を振り返れます。',
    ]);
    expect(homeCopy.en.capabilities.items).toHaveLength(4);
    expect(homeCopy.ja.capabilities.items).toHaveLength(4);
  });

  it('keeps unavailable Store destinations as non-link data', () => {
    expect(platforms.map((platform) => platform.id)).toEqual(['macos', 'ios']);
    expect(
      platforms.map((platform) =>
        platformAction(platform, 'Store', 'Coming soon'),
      ),
    ).toEqual([
      { kind: 'pending', label: 'Coming soon' },
      { kind: 'pending', label: 'Coming soon' },
    ]);
  });

  it('creates a Store link action only when a confirmed URL exists', () => {
    expect(
      platformAction(
        {
          id: 'macos',
          storeUrl: 'https://apps.apple.com/app/owlaria/id123456789',
        },
        'Mac App Store',
        'Coming soon',
      ),
    ).toEqual({
      kind: 'link',
      label: 'Mac App Store',
      href: 'https://apps.apple.com/app/owlaria/id123456789',
    });
  });

  it('leads with free access while keeping paid upgrades platform-specific', () => {
    expect(homeCopy.en.platforms.freeNote).toBe(
      'Use every feature free with one library and up to 100 books.',
    );
    expect(homeCopy.en.platforms.purchaseNote).toBe(
      'Owlaria Plus removes the library and book limits with a one-time purchase for each operating system. Check the App Store price shown in the app.',
    );
    expect(homeCopy.ja.platforms.freeNote).toBe(
      'すべての機能を1ライブラリ・100冊まで無料で利用できます。',
    );
    expect(homeCopy.ja.platforms.purchaseNote).toBe(
      'Owlaria Plusは、ライブラリ数と冊数の上限を解除するOSごとの買い切りです。価格はアプリ内のApp Store表示をご確認ください。',
    );
    expect(homeCopy.en.platforms.heroFreeNote).toBe(
      'Free: 1 library · 100 books',
    );
    expect(homeCopy.ja.platforms.heroFreeNote).toBe(
      '無料：1ライブラリ・100冊まで',
    );
  });

  it('assigns a meaningful icon to every capability card', () => {
    for (const locale of ['en', 'ja'] as const) {
      expect(
        homeCopy[locale].capabilities.items.map((item) => item.icon),
      ).toEqual(['search', 'tracking', 'privacy', 'statistics']);
    }
  });

  it('announces Windows and Android without presenting them as available', () => {
    expect(homeCopy.en.platforms.futurePlatforms).toEqual([
      'Windows',
      'Android',
    ]);
    expect(homeCopy.ja.platforms.futurePlatforms).toEqual([
      'Windows',
      'Android',
    ]);
    expect(homeCopy.en.platforms.futureLabel).toBe('Also planned');
    expect(homeCopy.ja.platforms.futureLabel).toBe('今後登場予定');
  });

  it('ends the homepage with the platform section instead of a duplicate closing panel', () => {
    expect('closing' in homeCopy.en).toBe(false);
    expect('closing' in homeCopy.ja).toBe(false);
  });
});
