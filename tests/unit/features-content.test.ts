import { describe, expect, it } from 'vitest';

import { featurePageCopy } from '../../src/content/features';

describe('feature page content', () => {
  it('organizes both locales around the same six product stories', () => {
    expect(featurePageCopy.en.sections.map(({ id }) => id)).toEqual([
      'sources',
      'organize',
      'library',
      'viewer',
      'statistics',
      'settings',
    ]);
    expect(featurePageCopy.ja.sections.map(({ id }) => id)).toEqual(
      featurePageCopy.en.sections.map(({ id }) => id),
    );

    for (const [
      index,
      englishSection,
    ] of featurePageCopy.en.sections.entries()) {
      const japaneseSection = featurePageCopy.ja.sections[index];

      expect(japaneseSection?.id).toBe(englishSection.id);
      expect(japaneseSection?.platforms).toEqual(englishSection.platforms);
      expect(japaneseSection?.items).toHaveLength(englishSection.items.length);
      expect(
        japaneseSection?.items.map(({ platforms }) => platforms ?? null),
      ).toEqual(englishSection.items.map(({ platforms }) => platforms ?? null));
    }
  });

  it('uses concise chapter labels in the feature index', () => {
    expect(featurePageCopy.en.sections.map(({ label }) => label)).toEqual([
      'Sources',
      'Organize',
      'Library',
      'Viewer',
      'Statistics',
      'Settings',
    ]);
    expect(featurePageCopy.ja.sections.map(({ label }) => label)).toEqual([
      'フォルダ',
      '整理',
      'ライブラリ',
      'ビューア',
      '統計',
      '設定',
    ]);
  });

  it('leads with the product value established on the landing page', () => {
    expect(featurePageCopy.ja.hero.heading).toBe(
      'フォルダはそのまま。整理も、読み方も、思いどおりに。',
    );
    expect(featurePageCopy.ja.hero.mobileLines).toEqual([
      'フォルダはそのまま。',
      '整理も、読み方も、',
      '思いどおりに。',
    ]);
    expect('highlights' in featurePageCopy.ja.hero).toBe(false);
  });

  it('publishes archive formats as individual extensions', () => {
    expect(featurePageCopy.en.formats.archive).toEqual([
      'ZIP',
      'CBZ',
      'RAR',
      'CBR',
      '7Z',
      'CB7',
      'LZH',
      'PDF',
    ]);
    expect(featurePageCopy.ja.formats.archive).toEqual(
      featurePageCopy.en.formats.archive,
    );
    expect(JSON.stringify(featurePageCopy)).not.toMatch(/EPUB/i);
  });

  it('lists exactly the password-protected archive formats that can be opened', () => {
    expect(featurePageCopy.en.formats.passwordArchive).toEqual([
      'ZIP',
      'CBZ',
      'RAR',
      'CBR',
      '7Z',
      'CB7',
    ]);
    expect(featurePageCopy.ja.formats.passwordArchive).toEqual(
      featurePageCopy.en.formats.passwordArchive,
    );
  });

  it('marks future platforms as planned and explains the free tier', () => {
    expect(featurePageCopy.en.availability.currentPlatforms).toEqual([
      'Mac',
      'iPhone',
    ]);
    expect(featurePageCopy.en.availability.futurePlatforms).toEqual([
      'Windows',
      'Android',
    ]);
    expect(featurePageCopy.ja.availability.freeNote).toBe(
      'すべての機能を1ライブラリ・100冊まで無料で利用できます。',
    );
    expect(featurePageCopy.ja.availability.purchaseNote).toContain('買い切り');
    expect(featurePageCopy.ja.availability.futureLabel).toBe('登場予定');
  });

  it('publishes the supported SMB environment in both locales', () => {
    expect(featurePageCopy.en.environment).toEqual({
      eyebrow: 'Supported environment',
      heading: 'Bring your NAS library into Owlaria.',
      body: 'Use shared folders on your network from Mac and iPhone.',
      smbVersion: 'Supports SMB 2.0 or later',
    });
    expect(featurePageCopy.ja.environment).toEqual({
      eyebrow: '対応環境',
      heading: 'NASのコミックを、そのままライブラリへ。',
      body: 'ネットワーク上の共有フォルダを、MacとiPhoneから利用できます。',
      smbVersion: 'SMB 2.0以降に対応',
    });
  });

  it('labels feature availability for Mac and iPhone', () => {
    for (const locale of ['en', 'ja'] as const) {
      for (const section of featurePageCopy[locale].sections) {
        expect(section.platforms).toEqual(['mac', 'iphone']);
        for (const item of section.items) {
          expect(item.platforms ?? section.platforms).toEqual(
            expect.arrayContaining(['mac']),
          );
        }
      }
    }

    const englishViewer = featurePageCopy.en.sections.find(
      ({ id }) => id === 'viewer',
    );
    const japaneseSettings = featurePageCopy.ja.sections.find(
      ({ id }) => id === 'settings',
    );

    expect(englishViewer?.temporaryViewer?.platforms).toEqual(['mac']);
    expect(
      japaneseSettings?.items.find(
        ({ title }) => title === 'キーボードショートカット',
      )?.platforms,
    ).toEqual(['mac']);
  });

  it('describes the available product screenshots', () => {
    expect(
      featurePageCopy.en.sections.find(({ id }) => id === 'library')?.preview,
    ).toEqual({
      platform: 'MAC',
      title: 'Series detail screen for Bookshop Above the Clouds',
      image: '/screenshots/owlaria-series-macos.webp',
    });
    expect(
      featurePageCopy.ja.sections.find(({ id }) => id === 'library')?.preview,
    ).toEqual({
      platform: 'MAC',
      title: 'Bookshop Above the Cloudsのシリーズ詳細画面',
      image: '/screenshots/owlaria-series-macos.webp',
    });
    expect(
      featurePageCopy.en.sections.find(({ id }) => id === 'viewer')?.preview,
    ).toEqual({
      platform: 'MAC',
      title: 'Viewer controls over a two-page comic spread',
      image: '/screenshots/owlaria-viewer-macos-controls.webp',
    });
    expect(
      featurePageCopy.ja.sections.find(({ id }) => id === 'viewer')?.preview,
    ).toEqual({
      platform: 'MAC',
      title: 'コミックの見開きにビューア操作を表示した画面',
      image: '/screenshots/owlaria-viewer-macos-controls.webp',
    });
  });

  it('provides clear next steps after the feature catalog', () => {
    expect(featurePageCopy.ja.availability.actions).toEqual({
      purchases: '無料範囲とPlusを見る',
      releases: 'リリース情報を見る',
      overview: '概要へ戻る',
    });
    expect(featurePageCopy.en.availability.actions).toEqual({
      purchases: 'See Free and Plus details',
      releases: 'View release information',
      overview: 'Back to overview',
    });
  });

  it('uses コミック consistently in Japanese product copy', () => {
    expect(JSON.stringify(featurePageCopy.ja)).toContain('コミック');
    expect(JSON.stringify(featurePageCopy.ja)).not.toMatch(/漫画/);
  });

  it('describes Read-Only as a design property instead of an absolute guarantee', () => {
    expect(JSON.stringify(featurePageCopy)).not.toMatch(
      /never rewrites|never modifies|一切変更|絶対に変更/i,
    );
  });

  it('keeps source management separate from viewer delivery features', () => {
    const englishSources = featurePageCopy.en.sections.find(
      ({ id }) => id === 'sources',
    );
    const japaneseSources = featurePageCopy.ja.sections.find(
      ({ id }) => id === 'sources',
    );
    const englishViewer = featurePageCopy.en.sections.find(
      ({ id }) => id === 'viewer',
    );
    const japaneseViewer = featurePageCopy.ja.sections.find(
      ({ id }) => id === 'viewer',
    );

    expect(englishSources?.items).toHaveLength(2);
    expect(japaneseSources?.items).toHaveLength(2);
    expect(japaneseSources).toMatchObject({
      heading: 'フォルダを統合。元のフォルダは汚さない。',
      items: [
        { title: '複数のフォルダをひとつに' },
        { title: '元のフォルダへ書き込まない設計' },
      ],
    });
    expect(featurePageCopy.ja.sourceDiagram.heading).toBe('複数のフォルダ');
    expect(japaneseSources?.items[0]?.body).toBe(
      '複数のSMB NASとローカルフォルダを、ひとつのライブラリから探して読めます。',
    );
    expect(featurePageCopy.ja.sourceDiagram.outputBody).toBe(
      '整理情報はアプリ内に保存。保存場所をまたいで管理できます。',
    );
    expect(englishViewer).toMatchObject({
      heading: 'Smooth loading. Read your way.',
      body: 'Reduce loading waits, choose the reading direction and page layout, or save selected books for offline reading.',
    });
    expect(japaneseViewer).toMatchObject({
      heading: '読み込みも、読み方も、快適に。',
      body: 'すばやく読み始められ、ページめくり方向や表示方法を選べます。オフラインでも読めます。',
    });
    expect(japaneseViewer?.modeGroups?.[0]).toEqual({
      title: 'ページめくり方向',
      values: ['右開き', '左開き', '縦読み'],
    });
    expect(englishViewer?.items[0]).toEqual({
      title: 'Smooth streaming, less waiting',
      body: 'Start remote ZIP, CBZ, and PDF books without waiting for a full copy.',
    });
    expect(japaneseViewer?.items[0]).toEqual({
      title: 'ストリーミング処理でストレスなし',
      body: 'リモートのZIP・CBZ・PDFは、本全体を待たずに読み始められます。',
    });
    expect(englishViewer?.items[1]?.title).toBe('Cache and offline copies');
    expect(japaneseViewer?.items[1]?.title).toBe('キャッシュとオフライン保存');
    expect(japaneseViewer?.items[3]).toEqual({
      title: '見開きを自然に表示',
      body: '表紙と横長画像を自動判別し、表紙は単ページ、横長画像は一枚で表示します。',
    });
    expect(japaneseViewer?.items.at(-1)?.title).toBe('次のページを先読み');
  });

  it('separates organization, library state, statistics, and settings', () => {
    const englishOrganize = featurePageCopy.en.sections.find(
      ({ id }) => id === 'organize',
    );
    const japaneseOrganize = featurePageCopy.ja.sections.find(
      ({ id }) => id === 'organize',
    );
    const englishLibrary = featurePageCopy.en.sections.find(
      ({ id }) => id === 'library',
    );
    const japaneseLibrary = featurePageCopy.ja.sections.find(
      ({ id }) => id === 'library',
    );
    const englishStatistics = featurePageCopy.en.sections.find(
      ({ id }) => id === 'statistics',
    );
    const japaneseStatistics = featurePageCopy.ja.sections.find(
      ({ id }) => id === 'statistics',
    );
    const englishSettings = featurePageCopy.en.sections.find(
      ({ id }) => id === 'settings',
    );
    const japaneseSettings = featurePageCopy.ja.sections.find(
      ({ id }) => id === 'settings',
    );

    expect(englishOrganize?.items.map(({ title }) => title)).toEqual([
      'Search, filter, and sort',
      'Read metadata from file names',
      'Smart file tracking',
      'Browse the folder structure',
    ]);
    expect(japaneseOrganize?.items.map(({ title }) => title)).toEqual([
      '探す・絞り込む・並べ替える',
      'ファイル名から情報を取り込む',
      '移動・名前変更を追跡',
      'フォルダ構成から探せる',
    ]);
    expect(englishLibrary?.items.map(({ title }) => title)).toEqual([
      'Series and next unread volume',
      'Build series from folders',
      'Custom covers',
      'Private libraries',
      'Save your reading position',
    ]);
    expect(japaneseLibrary?.items.map(({ title }) => title)).toEqual([
      'シリーズの続きがすぐ見つかる',
      'フォルダ単位でシリーズ化',
      '表紙を設定・トリミング',
      'プライベートライブラリ',
      '読書位置を自動保存',
    ]);
    expect(englishStatistics?.items.map(({ title }) => title)).toEqual([
      'Reading volume',
      'Active hours',
      'Tag breakdown',
    ]);
    expect(japaneseStatistics).toMatchObject({
      body: '読書時間や冊数、よく読む時間帯、保有コミックのタグ内訳を確認できます。',
      items: [
        { title: '読書量' },
        { title: 'よく読む時間帯' },
        {
          title: 'タグの内訳',
          body: '保有するコミックのタグ別件数を確認できます。',
        },
      ],
    });
    expect(englishSettings?.items.map(({ title }) => title)).toEqual([
      'Personalize your reading',
      'Keyboard shortcuts',
    ]);
    expect(japaneseSettings?.items.map(({ title }) => title)).toEqual([
      '好みに合わせた設定',
      'キーボードショートカット',
    ]);
  });

  it('explains Japanese organization and library features in plain language', () => {
    const organize = featurePageCopy.ja.sections.find(
      ({ id }) => id === 'organize',
    );
    const library = featurePageCopy.ja.sections.find(
      ({ id }) => id === 'library',
    );

    expect(organize?.items.map(({ title, body }) => ({ title, body }))).toEqual(
      [
        {
          title: '探す・絞り込む・並べ替える',
          body: 'タイトル・作者・シリーズ・タグで検索し、読書状態や評価で絞り込み、並べ替えられます。',
        },
        {
          title: 'ファイル名から情報を取り込む',
          body: 'ファイル名から、命名規則に沿ってタイトル・作者・タグを読み取ります。',
        },
        {
          title: '移動・名前変更を追跡',
          body: 'ファイルの場所や名前が変わっても、その変更を追跡できます。',
        },
        {
          title: 'フォルダ構成から探せる',
          body: 'いつものフォルダ構成をたどるエクスプローラから探せます。',
        },
      ],
    );
    expect(library?.items.map(({ title, body }) => ({ title, body }))).toEqual([
      {
        title: 'シリーズの続きがすぐ見つかる',
        body: 'シリーズごとの読書状況を確認し、次に読む未読巻をすぐに開けます。',
      },
      {
        title: 'フォルダ単位でシリーズ化',
        body: 'フォルダ読み込み時に、サブフォルダ単位でシリーズ化することもできます。',
      },
      {
        title: '表紙を設定・トリミング',
        body: '好きなページを表紙に設定し、表示範囲をトリミングできます。',
      },
      {
        title: 'プライベートライブラリ',
        body: 'パスワードで保護し、Touch IDやFace IDで解除できます。',
      },
      {
        title: '読書位置を自動保存',
        body: '最後に読んだページを保存し、次回はその続きから再開できます。',
      },
    ]);
  });
});
