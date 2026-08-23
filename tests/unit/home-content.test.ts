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
        title: 'Organize inside Owlaria',
        body: 'Manage tags, series, ratings, covers, and more separately from your storage.',
      },
      {
        title: 'Keep your storage uncluttered',
        body: 'Your files and folder structure stay unchanged, with no extra management files written alongside them.',
      },
    ]);
    expect(homeCopy.ja.hero.benefits).toEqual([
      {
        title: '今のフォルダをそのまま登録',
        body: 'NASやローカルフォルダを、構成を変えずにOwlariaへ登録できます。',
      },
      {
        title: '整理はOwlariaの中だけで',
        body: 'タグ・シリーズ・評価・表紙などを、保存先とは切り離して管理できます。',
      },
      {
        title: '保存先を汚さない',
        body: 'ファイルやフォルダ構成を変えず、余計な管理ファイルも書き込みません。',
      },
    ]);
    expect(homeCopy.ja.hero.heading).not.toBe(homeCopy.en.hero.heading);
  });

  it('explains how untouched folders become a library', () => {
    expect(homeCopy.en.productStory).toMatchObject({
      heading: 'Keep your folders. Add the organization they deserve.',
      source: {
        locations: ['NAS 1', 'NAS 2', 'LOCAL'],
        title: 'Your existing folders',
        body: 'Files and folder structure stay unchanged',
      },
      organization: {
        title: 'Organize in Owlaria',
        body: [
          'Manage tags, series, ratings, and covers in the app.',
          'Browse, search, and read across every source as one library.',
        ],
      },
      connectorLabels: ['Reference as-is'],
    });
    expect(homeCopy.ja.productStory).toMatchObject({
      heading: 'フォルダはそのまま。整理はOwlariaの中で。',
      source: {
        locations: ['NAS 1', 'NAS 2', 'LOCAL'],
        title: '複数の保存先',
        body: 'ファイルもフォルダ構成もそのまま',
      },
      organization: {
        title: 'Owlariaで統合整理',
        body: [
          'タグ・シリーズ・評価・表紙をアプリ内で管理。',
          '保存場所をまたいだひとつの本棚として、一覧・検索・閲覧できます。',
        ],
      },
      connectorLabels: ['登録'],
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
      title: 'マンガに合わせて読み方を選択',
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

  it('reserves a localized macOS screenshot showcase', () => {
    expect(homeCopy.en.screenshotShowcase).toEqual({
      eyebrow: 'See Owlaria in action',
      heading: 'Keep your storage. Transform how you browse.',
      body: 'This space will show the macOS library where tags, series, and covers make your collection easier to explore.',
      placeholderLabel: 'macOS library screenshot',
    });
    expect(homeCopy.ja.screenshotShowcase).toEqual({
      eyebrow: '実際のアプリ画面',
      heading: '保存先はそのまま。見え方は、ここまで変わる。',
      body: 'タグやシリーズで整理し、表紙から探せるmacOSのライブラリ画面をここで紹介します。',
      placeholderLabel: 'macOSライブラリ画面のスクリーンショット',
    });
  });

  it('reserves localized product screenshots in the hero', () => {
    expect(homeCopy.en.hero.preview).toEqual({
      label: 'Owlaria product preview',
      desktopLabel: 'Mac library screenshot',
      mobileLabel: 'iPhone reader screenshot',
      replacementNote: 'Product screenshots coming soon',
    });
    expect(homeCopy.ja.hero.preview).toEqual({
      label: 'Owlariaのアプリ画面',
      desktopLabel: 'Mac版ライブラリ画面',
      mobileLabel: 'iPhone版ビューア画面',
      replacementNote: '正式なアプリ画面に差し替え予定',
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
      passwordLabel: 'パスワード付きアーカイブ対応',
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
      'Core features are free to use.',
    );
    expect(homeCopy.en.platforms.purchaseNote).toBe(
      'Paid features are purchased separately on Mac and iPhone.',
    );
    expect(homeCopy.ja.platforms.freeNote).toBe(
      '基本機能は無料で利用できます。',
    );
    expect(homeCopy.ja.platforms.purchaseNote).toBe(
      '有料機能はMac版とiPhone版でそれぞれ別に購入できます。',
    );
    expect(homeCopy.en.platforms.body).toBe(
      'On Mac and iPhone, starting free.',
    );
    expect(homeCopy.ja.platforms.body).toBe('MacとiPhoneで、基本無料から。');
    expect(homeCopy.en.platforms.heroFreeNote).toBe('Free to start at launch');
    expect(homeCopy.ja.platforms.heroFreeNote).toBe('基本無料で提供予定');
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
