import type { Locale } from '../i18n/config';

export type FeatureSectionId =
  'sources' | 'organize' | 'library' | 'viewer' | 'statistics' | 'settings';
export type FeaturePlatform = 'mac' | 'iphone';

type FeatureItem = {
  title: string;
  body: string;
  platforms?: FeaturePlatform[];
};

type FeaturePreview = {
  platform: string;
  title: string;
  note: string;
};

type FeatureModeGroup = {
  title: string;
  values: string[];
};

type FeatureTemporaryViewer = {
  eyebrow: string;
  heading: string;
  headingLines: string[];
  body: string;
  fileLabel: string;
  viewerLabel: string;
  notAddedLabel: string;
  platforms: FeaturePlatform[];
  methods: FeatureItem[];
};

type FeatureSection = {
  id: FeatureSectionId;
  number: string;
  label: string;
  heading: string;
  desktopLines: string[];
  mobileLines: string[];
  body: string;
  platforms: FeaturePlatform[];
  visual: 'sources' | 'preview' | 'reader' | 'cards';
  items: FeatureItem[];
  preview?: FeaturePreview;
  modeGroups?: FeatureModeGroup[];
  temporaryViewer?: FeatureTemporaryViewer;
};

export type FeaturePageCopy = {
  metadata: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    desktopLines: string[];
    mobileLines: string[];
    body: string;
  };
  navigationLabel: string;
  sections: FeatureSection[];
  sourceDiagram: {
    heading: string;
    body: string;
    sources: string[];
    connector: string;
    outputHeading: string;
    outputBody: string;
  };
  formats: {
    eyebrow: string;
    headingPhrases: string[];
    body: string;
    archiveLabel: string;
    archive: string[];
    passwordBody: string;
    passwordArchive: string[];
    imageLabelPhrases: string[];
    image: string[];
  };
  environment: {
    eyebrow: string;
    heading: string;
    body: string;
    smbVersion: string;
  };
  availability: {
    eyebrow: string;
    heading: string;
    body: string;
    currentLabel: string;
    currentPlatforms: string[];
    futureLabel: string;
    futurePlatforms: string[];
    comingSoon: string;
    freeNote: string;
    purchaseNote: string;
    actions: {
      purchases: string;
      releases: string;
      overview: string;
    };
  };
};

export const featurePageCopy: Record<Locale, FeaturePageCopy> = {
  en: {
    metadata: {
      title: 'Features · Owlaria',
      description:
        'Explore how Owlaria organizes and reads comics across NAS and local folders without adding management files to your storage.',
    },
    hero: {
      eyebrow: 'Owlaria features',
      heading: 'Keep your folders. Organize and read your way.',
      desktopLines: ['Keep your folders.', 'Organize and read your way.'],
      mobileLines: ['Keep your folders.', 'Organize and read', 'your way.'],
      body: 'One library for NAS and local folders, without changing your storage.',
    },
    navigationLabel: 'Feature stories',
    sections: [
      {
        id: 'sources',
        number: '01',
        label: 'Sources',
        heading: 'Connect your folders. Keep your storage clean.',
        desktopLines: ['Connect your folders.', 'Keep your storage', 'clean.'],
        mobileLines: ['Connect your folders.', 'Keep your storage', 'clean.'],
        body: 'Add your existing NAS and local folders. Owlaria keeps organization data in the app.',
        platforms: ['mac', 'iphone'],
        visual: 'sources',
        items: [
          {
            title: 'Multiple sources, one library',
            body: 'Browse and read across multiple SMB NAS locations and local folders from one library.',
          },
          {
            title: 'Read-Only source design',
            body: 'Owlaria does not rename, move, delete, create, or write sidecar files at the source.',
          },
        ],
      },
      {
        id: 'organize',
        number: '02',
        label: 'Organize',
        heading: 'Find the book you want, even among thousands.',
        desktopLines: ['Find the book you want,', 'even among thousands.'],
        mobileLines: ['Find the book', 'you want, even', 'among thousands.'],
        body: 'Find a book by cover, search, or the folder structure you already know.',
        platforms: ['mac', 'iphone'],
        visual: 'preview',
        preview: {
          platform: 'MAC',
          title: 'Library and search screen',
          note: 'Mac product preview coming soon',
        },
        items: [
          {
            title: 'Search, filter, and sort',
            body: 'Search titles, authors, series, and tags, then filter by reading state or rating.',
          },
          {
            title: 'Read metadata from file names',
            body: 'Extract titles, authors, and tags from naming rules without renaming files.',
          },
          {
            title: 'Smart file tracking',
            body: 'Keep Owlaria metadata when a file moves or changes its name.',
          },
          {
            title: 'Browse the folder structure',
            body: 'Find books by following the folder structure you already know.',
          },
        ],
      },
      {
        id: 'library',
        number: '03',
        label: 'Library',
        heading: 'Keep series, covers, and reading positions together.',
        desktopLines: [
          'Keep series, covers,',
          'and reading positions',
          'together.',
        ],
        mobileLines: [
          'Keep series,',
          'covers, and reading',
          'positions together.',
        ],
        body: 'Organize series and covers, save your place, and protect private libraries.',
        platforms: ['mac', 'iphone'],
        visual: 'cards',
        items: [
          {
            title: 'Series and next unread volume',
            body: 'Track series progress and continue with the next unread volume.',
          },
          {
            title: 'Build series from folders',
            body: 'Optionally group newly found comics into series by their leaf folders.',
          },
          {
            title: 'Custom covers',
            body: 'Choose any page as a cover and crop it to the right framing.',
          },
          {
            title: 'Private libraries',
            body: 'Protect a library with a password, Touch ID, or Face ID.',
          },
          {
            title: 'Save your reading position',
            body: 'Save the last page in your library and continue from there next time.',
          },
        ],
      },
      {
        id: 'viewer',
        number: '04',
        label: 'Viewer',
        heading: 'Smooth loading. Read your way.',
        desktopLines: ['Smooth loading.', 'Read your way.'],
        mobileLines: ['Smooth loading.', 'Read your way.'],
        body: 'Reduce loading waits, choose the reading direction and page layout, or save selected books for offline reading.',
        platforms: ['mac', 'iphone'],
        visual: 'reader',
        preview: {
          platform: 'IPHONE',
          title: 'Comic viewer screen',
          note: 'iPhone product preview coming soon',
        },
        modeGroups: [
          {
            title: 'Reading direction',
            values: ['Right-to-left', 'Left-to-right', 'Vertical'],
          },
          {
            title: 'Page display',
            values: ['Single page', 'Spread'],
          },
          {
            title: 'Scrolling',
            values: ['Continuous scroll'],
          },
        ],
        temporaryViewer: {
          eyebrow: 'Mac Temporary Viewer',
          heading: 'No library required. Just open and read.',
          headingLines: ['No library required.', 'Just open and read.'],
          body: 'Open a single comic from your usual folders without creating a library.',
          fileLabel: 'Comic file',
          viewerLabel: 'Temporary Viewer',
          notAddedLabel: 'Not added to library',
          platforms: ['mac'],
          methods: [
            {
              title: 'Open from Finder',
              body: 'Associate ZIP or CBZ files with Owlaria, then double-click to open.',
            },
            {
              title: 'Drag and drop',
              body: 'Drop a file onto Owlaria to open it in a separate window.',
            },
            {
              title: 'Resume later',
              body: 'Your place is saved in Temporary Viewer History.',
            },
          ],
        },
        items: [
          {
            title: 'Smooth streaming, less waiting',
            body: 'Start remote ZIP, CBZ, and PDF books without waiting for a full copy.',
          },
          {
            title: 'Cache and offline copies',
            body: 'Control cache size and save selected comics for offline reading.',
          },
          {
            title: 'Zoom in naturally',
            body: 'Pinch on iPhone or use a Mac trackpad. Mac also supports a zoom lens and fullscreen.',
          },
          {
            title: 'Natural spreads',
            body: 'Keep covers single, show wide images as one page, and adjust spread alignment.',
          },
          {
            title: 'Fast navigation',
            body: 'Jump with the scrubber or thumbnails, then move to the previous or next book.',
          },
          {
            title: 'Prefetch the next pages',
            body: 'Prefetch pages in the reading direction while keeping controls responsive.',
          },
        ],
      },
      {
        id: 'statistics',
        number: '05',
        label: 'Statistics',
        heading: 'See how your reading adds up.',
        desktopLines: ['See how your reading', 'adds up.'],
        mobileLines: ['See how your', 'reading adds up.'],
        body: 'Review reading volume, active hours, and your collection by tag.',
        platforms: ['mac', 'iphone'],
        visual: 'cards',
        preview: {
          platform: 'MAC',
          title: 'Reading statistics screen',
          note: 'Mac statistics screen coming soon',
        },
        items: [
          {
            title: 'Reading volume',
            body: 'Review reading time, finished books, and pages.',
          },
          {
            title: 'Active hours',
            body: 'See which hours of the day you read most.',
          },
          {
            title: 'Tag breakdown',
            body: 'See how many owned comics are assigned to each tag.',
          },
        ],
      },
      {
        id: 'settings',
        number: '06',
        label: 'Settings',
        heading: 'Make Owlaria look and work your way.',
        desktopLines: ['Make Owlaria look', 'and work your way.'],
        mobileLines: ['Make Owlaria look', 'and work your way.'],
        body: 'Adjust themes, page effects, and Mac keyboard shortcuts to fit how you use Owlaria.',
        platforms: ['mac', 'iphone'],
        visual: 'cards',
        items: [
          {
            title: 'Personalize your reading',
            body: 'Adjust themes, backgrounds, and page effects.',
          },
          {
            title: 'Keyboard shortcuts',
            body: 'Customize desktop shortcuts on Mac.',
            platforms: ['mac'],
          },
        ],
      },
    ],
    sourceDiagram: {
      heading: 'The folders you already use',
      body: 'Files and folder structures stay where they are.',
      sources: ['NAS 1', 'NAS 2', 'LOCAL'],
      connector: 'Register',
      outputHeading: 'Unified in Owlaria',
      outputBody:
        'Organize in the app, then browse and read across every source.',
    },
    formats: {
      eyebrow: 'Compatibility',
      headingPhrases: ['Open the formats', 'comic libraries actually use.'],
      body: 'Register and read without converting or extracting first.',
      archiveLabel: 'Supported files',
      archive: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7', 'LZH', 'PDF'],
      passwordBody:
        'Password-protected ZIP, CBZ, RAR, CBR, 7Z, and CB7 files are supported.',
      passwordArchive: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7'],
      imageLabelPhrases: ['Image formats', 'read inside archives'],
      image: ['JPEG', 'PNG', 'WebP', 'AVIF', 'HEIC', 'GIF', 'BMP'],
    },
    environment: {
      eyebrow: 'Supported environment',
      heading: 'Bring your NAS library into Owlaria.',
      body: 'Use shared folders on your network from Mac and iPhone.',
      smbVersion: 'Supports SMB 2.0 or later',
    },
    availability: {
      eyebrow: 'Platforms & pricing',
      heading: 'Coming to Mac and iPhone, free to try.',
      body: 'First on Mac and iPhone, with Windows and Android planned.',
      currentLabel: 'First release',
      currentPlatforms: ['Mac', 'iPhone'],
      futureLabel: 'Planned',
      futurePlatforms: ['Windows', 'Android'],
      comingSoon: 'Coming soon',
      freeNote: 'Use every feature free with one library and up to 100 books.',
      purchaseNote:
        'Owlaria Plus removes the limits with a one-time purchase for each operating system.',
      actions: {
        purchases: 'See Free and Plus details',
        releases: 'View release information',
        overview: 'Back to overview',
      },
    },
  },
  ja: {
    metadata: {
      title: '機能 · Owlaria',
      description:
        'NASやローカルフォルダの保存先を汚さず、コミックを整理して読むためのOwlariaの機能をご紹介します。',
    },
    hero: {
      eyebrow: 'Owlariaの機能',
      heading: 'フォルダはそのまま。整理も、読み方も、思いどおりに。',
      desktopLines: [
        'フォルダはそのまま。',
        '整理も、読み方も、',
        '思いどおりに。',
      ],
      mobileLines: [
        'フォルダはそのまま。',
        '整理も、読み方も、',
        '思いどおりに。',
      ],
      body: 'NASやローカルフォルダをひとつに。保存先を変えずに整理・閲覧できます。',
    },
    navigationLabel: '機能カテゴリー',
    sections: [
      {
        id: 'sources',
        number: '01',
        label: 'フォルダ',
        heading: 'フォルダを統合。元のフォルダは汚さない。',
        desktopLines: ['フォルダを統合。', '元のフォルダは', '汚さない。'],
        mobileLines: ['フォルダを統合。', '元のフォルダは', '汚さない。'],
        body: 'NASやローカルフォルダを登録するだけ。整理情報はOwlaria内に保存します。',
        platforms: ['mac', 'iphone'],
        visual: 'sources',
        items: [
          {
            title: '複数のフォルダをひとつに',
            body: '複数のSMB NASとローカルフォルダを、ひとつのライブラリから探して読めます。',
          },
          {
            title: '元のフォルダへ書き込まない設計',
            body: '原本の変更・移動・削除や、管理ファイルの書き込みを行いません。',
          },
        ],
      },
      {
        id: 'organize',
        number: '02',
        label: '整理',
        heading: '何千冊の中から、読みたい一冊へ。',
        desktopLines: ['何千冊の中から、', '読みたい一冊へ。'],
        mobileLines: ['何千冊の中から、', '読みたい一冊へ。'],
        body: '表紙・検索・フォルダ表示から、読みたい一冊を探せます。',
        platforms: ['mac', 'iphone'],
        visual: 'preview',
        preview: {
          platform: 'MAC',
          title: 'ライブラリ・検索画面',
          note: 'Mac版のアプリ画面は近日公開',
        },
        items: [
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
      },
      {
        id: 'library',
        number: '03',
        label: 'ライブラリ',
        heading: 'シリーズも、表紙も、読んだ位置も。',
        desktopLines: ['シリーズも、表紙も、', '読んだ位置も。'],
        mobileLines: ['シリーズも、', '表紙も、読んだ位置も。'],
        body: 'シリーズや表紙を整え、読んだ位置を保存し、プライベートなライブラリを保護できます。',
        platforms: ['mac', 'iphone'],
        visual: 'cards',
        items: [
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
        ],
      },
      {
        id: 'viewer',
        number: '04',
        label: 'ビューア',
        heading: '読み込みも、読み方も、快適に。',
        desktopLines: ['読み込みも、', '読み方も、快適に。'],
        mobileLines: ['読み込みも、', '読み方も、快適に。'],
        body: 'すばやく読み始められ、ページめくり方向や表示方法を選べます。オフラインでも読めます。',
        platforms: ['mac', 'iphone'],
        visual: 'reader',
        preview: {
          platform: 'IPHONE',
          title: 'コミックビューア画面',
          note: 'iPhone版のアプリ画面は近日公開',
        },
        modeGroups: [
          {
            title: 'ページめくり方向',
            values: ['右開き', '左開き', '縦読み'],
          },
          {
            title: 'ページの表示方法',
            values: ['単ページ', '見開き'],
          },
          {
            title: '連続スクロール表示',
            values: ['連続スクロール'],
          },
        ],
        temporaryViewer: {
          eyebrow: 'Macの一時ビューア',
          heading: 'ライブラリを作らず、そのまま読む。',
          headingLines: ['ライブラリを作らず、', 'そのまま読む。'],
          body: 'ライブラリを作らず、いつものフォルダから一冊だけ開く単体ビューアとしても使えます。',
          fileLabel: 'コミックファイル',
          viewerLabel: '一時ビューア',
          notAddedLabel: 'ライブラリには追加しない',
          platforms: ['mac'],
          methods: [
            {
              title: 'Finderから直接',
              body: 'ZIP・CBZなどを関連付け、ダブルクリックで開けます。',
            },
            {
              title: 'ドラッグ＆ドロップ',
              body: 'Owlariaへドロップし、別ウインドウで開けます。',
            },
            {
              title: '続きから再開',
              body: '読んだ位置は、一時ビューア履歴に保存されます。',
            },
          ],
        },
        items: [
          {
            title: 'ストリーミング処理でストレスなし',
            body: 'リモートのZIP・CBZ・PDFは、本全体を待たずに読み始められます。',
          },
          {
            title: 'キャッシュとオフライン保存',
            body: '容量を管理できるキャッシュと、オフライン保存に対応します。',
          },
          {
            title: '細部まで、自然に拡大',
            body: 'iPhoneはピンチ、Macはトラックパッドで拡大。Macは拡大鏡・全画面にも対応。',
          },
          {
            title: '見開きを自然に表示',
            body: '表紙と横長画像を自動判別し、表紙は単ページ、横長画像は一枚で表示します。',
          },
          {
            title: 'すばやいページ移動',
            body: 'スライダーやサムネイルから移動し、前後の巻へ進めます。',
          },
          {
            title: '次のページを先読み',
            body: '読む方向のページを先読みし、操作の軽さを保ちます。',
          },
        ],
      },
      {
        id: 'statistics',
        number: '05',
        label: '統計',
        heading: '読書の積み重ねを、ひと目で。',
        desktopLines: ['読書の積み重ねを、', 'ひと目で。'],
        mobileLines: ['読書の積み重ねを、', 'ひと目で。'],
        body: '読書時間や冊数、よく読む時間帯、保有コミックのタグ内訳を確認できます。',
        platforms: ['mac', 'iphone'],
        visual: 'cards',
        preview: {
          platform: 'MAC',
          title: '読書統計画面',
          note: 'Mac版の統計画面は近日公開',
        },
        items: [
          {
            title: '読書量',
            body: '読書時間・読了冊数・ページ数を確認できます。',
          },
          {
            title: 'よく読む時間帯',
            body: 'よく読んでいる時間帯を確認できます。',
          },
          {
            title: 'タグの内訳',
            body: '保有するコミックのタグ別件数を確認できます。',
          },
        ],
      },
      {
        id: 'settings',
        number: '06',
        label: '設定',
        heading: '見た目も、操作も、自分に合わせる。',
        desktopLines: ['見た目も、操作も、', '自分に合わせる。'],
        mobileLines: ['見た目も、', '操作も、', '自分に合わせる。'],
        body: 'テーマやページ表現、Macのショートカットを好みに合わせて調整できます。',
        platforms: ['mac', 'iphone'],
        visual: 'cards',
        items: [
          {
            title: '好みに合わせた設定',
            body: 'テーマ、背景、ページ表現を調整できます。',
          },
          {
            title: 'キーボードショートカット',
            body: 'Macのショートカットを好みに合わせて変更できます。',
            platforms: ['mac'],
          },
        ],
      },
    ],
    sourceDiagram: {
      heading: '複数のフォルダ',
      body: 'ファイルもフォルダ構成も、そのまま。',
      sources: ['NAS 1', 'NAS 2', 'LOCAL'],
      connector: '登録',
      outputHeading: 'Owlariaで統合整理',
      outputBody: '整理情報はアプリ内に保存。保存場所をまたいで管理できます。',
    },
    formats: {
      eyebrow: '対応形式',
      headingPhrases: ['コミックでよく使われる', '形式に対応。'],
      body: '変換や展開をせず、登録してそのまま読めます。',
      archiveLabel: '対応ファイル',
      archive: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7', 'LZH', 'PDF'],
      passwordBody: 'ZIP・CBZ・RAR・CBR・7Z・CB7は、パスワード付きにも対応。',
      passwordArchive: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7'],
      imageLabelPhrases: ['アーカイブ内で', '読める画像形式'],
      image: ['JPEG', 'PNG', 'WebP', 'AVIF', 'HEIC', 'GIF', 'BMP'],
    },
    environment: {
      eyebrow: '対応環境',
      heading: 'NASのコミックを、そのままライブラリへ。',
      body: 'ネットワーク上の共有フォルダを、MacとiPhoneから利用できます。',
      smbVersion: 'SMB 2.0以降に対応',
    },
    availability: {
      eyebrow: '対応環境・料金',
      heading: 'MacとiPhoneに、無料で登場予定。',
      body: 'まずはMacとiPhoneから。WindowsとAndroidも登場予定です。',
      currentLabel: '初回リリース',
      currentPlatforms: ['Mac', 'iPhone'],
      futureLabel: '登場予定',
      futurePlatforms: ['Windows', 'Android'],
      comingSoon: '近日公開',
      freeNote: 'すべての機能を1ライブラリ・100冊まで無料で利用できます。',
      purchaseNote:
        'Owlaria Plusは、OSごとの買い切りでライブラリ数と冊数の上限を解除します。',
      actions: {
        purchases: '無料範囲とPlusを見る',
        releases: 'リリース情報を見る',
        overview: '概要へ戻る',
      },
    },
  },
};
