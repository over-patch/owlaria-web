import type { Locale } from '../i18n/config';

export type FeatureSectionId = 'sources' | 'library' | 'viewer' | 'everyday';

type FeatureItem = {
  title: string;
  body: string;
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
    heading: string;
    body: string;
    archiveLabel: string;
    archive: string[];
    passwordBody: string;
    passwordArchive: string[];
    imageLabel: string;
    image: string[];
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
      title: 'Owlaria features for NAS and local comic libraries',
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
        label: 'Folders & storage',
        heading: 'Connect your folders. Keep your storage clean.',
        desktopLines: ['Connect your folders.', 'Keep your storage clean.'],
        mobileLines: ['Connect your folders.', 'Keep your storage', 'clean.'],
        body: 'Add your existing NAS and local folders. Owlaria keeps organization data in the app.',
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
          {
            title: 'Start with the data you need',
            body: 'Start remote ZIP, CBZ, and PDF books without waiting for a full copy.',
          },
          {
            title: 'Cache and offline copies',
            body: 'Control cache size and save selected comics for offline reading.',
          },
        ],
      },
      {
        id: 'library',
        number: '02',
        label: 'Organize & discover',
        heading: 'Find the book you want, even among thousands.',
        desktopLines: ['Find the book you want,', 'even among thousands.'],
        mobileLines: ['Find the book', 'you want, even', 'among thousands.'],
        body: 'Find a book by cover, search, or the folder structure you already know.',
        visual: 'preview',
        preview: {
          platform: 'MAC',
          title: 'Library and search screen',
          note: 'To be replaced with an approved Owlaria screenshot',
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
            title: 'Series and next unread volume',
            body: 'Track series progress and continue with the next unread volume.',
          },
          {
            title: 'Build series from folders',
            body: 'Optionally group newly found comics into series by their leaf folders.',
          },
          {
            title: 'Metadata stays in Owlaria',
            body: 'Keep titles, tags, ratings, and reading state separate from source files.',
          },
          {
            title: 'Custom covers and bulk editing',
            body: 'Choose any page as a cover and apply shared metadata in bulk.',
          },
          {
            title: 'Smart file tracking',
            body: 'Keep Owlaria metadata when a file moves or changes its name.',
          },
          {
            title: 'Grid, list, or Explorer',
            body: 'Switch between cover views and a Read-Only Explorer of your folders.',
          },
        ],
      },
      {
        id: 'viewer',
        number: '03',
        label: 'Comic viewer',
        heading: 'Choose the reading style that fits each comic.',
        desktopLines: ['Choose the reading style', 'that fits each comic.'],
        mobileLines: ['Choose the reading', 'style that fits', 'each comic.'],
        body: 'Switch reading direction and page layout for each comic.',
        visual: 'reader',
        preview: {
          platform: 'IPHONE',
          title: 'Comic viewer screen',
          note: 'To be replaced with an approved Owlaria screenshot',
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
            title: 'Prepare nearby pages',
            body: 'Prefetch pages in the reading direction while keeping controls responsive.',
          },
        ],
      },
      {
        id: 'everyday',
        number: '04',
        label: 'Privacy & history',
        heading: 'Continue reading. Understand your habits.',
        desktopLines: ['Continue reading.', 'Understand your habits.'],
        mobileLines: ['Continue reading.', 'Understand your', 'habits.'],
        body: 'Resume reading, protect private shelves, and review your reading patterns.',
        visual: 'cards',
        items: [
          {
            title: 'Private libraries',
            body: 'Protect a library with a password, Touch ID, or Face ID.',
          },
          {
            title: 'Resume from history',
            body: 'Continue a recent book from its last recorded page.',
          },
          {
            title: 'Reading statistics',
            body: 'Review reading time, finished books, pages, active hours, and tag trends.',
          },
          {
            title: 'Preferences that fit you',
            body: 'Adjust themes, backgrounds, page effects, and desktop shortcuts.',
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
      heading: 'Open the formats comic libraries actually use.',
      body: 'Register and read without converting or extracting first.',
      archiveLabel: 'Supported files',
      archive: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7', 'LZH', 'PDF'],
      passwordBody:
        'Password-protected ZIP, CBZ, RAR, CBR, 7Z, and CB7 files are supported.',
      passwordArchive: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7'],
      imageLabel: 'Image formats read inside archives',
      image: ['JPEG', 'PNG', 'WebP', 'AVIF', 'HEIC', 'GIF', 'BMP'],
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
      title: 'NAS・ローカルのマンガ管理と閲覧機能 · Owlaria',
      description:
        'NASやローカルフォルダの保存先を汚さず、マンガを整理して読むためのOwlariaの機能をご紹介します。',
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
        label: 'フォルダ・保存先',
        heading: 'フォルダをつなぐ。保存先は汚さない。',
        desktopLines: ['フォルダをつなぐ。', '保存先は汚さない。'],
        mobileLines: ['フォルダをつなぐ。', '保存先は', '汚さない。'],
        body: 'NASやローカルフォルダを登録するだけ。整理情報はOwlaria内に保存します。',
        visual: 'sources',
        items: [
          {
            title: '複数の保存先をひとつに',
            body: '複数のSMB NASとローカルフォルダを、ひとつの本棚から探して読めます。',
          },
          {
            title: '保存先へ書き込まない設計',
            body: '原本の変更・移動・削除や、管理ファイルの書き込みを行いません。',
          },
          {
            title: '必要なデータから読み始める',
            body: 'リモートのZIP・CBZ・PDFは、本全体を待たずに読み始められます。',
          },
          {
            title: 'キャッシュとオフライン保存',
            body: '容量を管理できるキャッシュと、オフライン保存に対応します。',
          },
        ],
      },
      {
        id: 'library',
        number: '02',
        label: '整理・検索',
        heading: '何千冊の中から、読みたい一冊へ。',
        desktopLines: ['何千冊の中から、', '読みたい一冊へ。'],
        mobileLines: ['何千冊の中から、', '読みたい一冊へ。'],
        body: '表紙・検索・フォルダ表示から、読みたい一冊を探せます。',
        visual: 'preview',
        preview: {
          platform: 'MAC',
          title: 'ライブラリ・検索画面',
          note: '正式なOwlariaの画面へ差し替え予定',
        },
        items: [
          {
            title: '検索・絞り込み・並べ替え',
            body: 'タイトル・作者・シリーズ・タグを検索し、読書状態や評価などで絞り込めます。',
          },
          {
            title: 'ファイル名から整理情報を読み取る',
            body: '命名規則からタイトル・作者・タグを抽出。原本名は変えません。',
          },
          {
            title: 'シリーズと次の未読巻',
            body: 'シリーズの進捗を確認し、次の未読巻から続けられます。',
          },
          {
            title: 'フォルダからシリーズを作る',
            body: '新しく見つかったマンガを、末端フォルダ単位でシリーズ化します。',
          },
          {
            title: '整理情報はOwlariaの中で',
            body: 'タイトル・タグ・評価などを、原本とは別に管理できます。',
          },
          {
            title: 'カスタム表紙とまとめて編集',
            body: '任意のページを表紙に設定。共通情報は複数冊へ一括反映できます。',
          },
          {
            title: 'ファイル移動を追跡',
            body: '場所や名前が変わっても、Owlariaの整理情報を維持します。',
          },
          {
            title: 'グリッド・リスト・Explorer',
            body: '表紙表示と、元のフォルダをたどるRead-Only Explorerを切り替えます。',
          },
        ],
      },
      {
        id: 'viewer',
        number: '03',
        label: 'マンガビューア',
        heading: 'マンガに合わせて読み方を選択',
        desktopLines: ['マンガに合わせて', '読み方を選択'],
        mobileLines: ['マンガに合わせて', '読み方を選択'],
        body: '作品ごとに、読み方向と表示方法を切り替えられます。',
        visual: 'reader',
        preview: {
          platform: 'IPHONE',
          title: 'マンガビューア画面',
          note: '正式なOwlariaの画面へ差し替え予定',
        },
        modeGroups: [
          {
            title: '作品に合わせた読み方向',
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
          fileLabel: 'マンガファイル',
          viewerLabel: '一時ビューア',
          notAddedLabel: 'ライブラリには追加しない',
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
            title: '細部まで、自然に拡大',
            body: 'iPhoneはピンチ、Macはトラックパッドで拡大。Macは拡大鏡・全画面にも対応。',
          },
          {
            title: '見開きを自然に表示',
            body: '表紙は単ページ、横長画像は一枚で表示。見開き位置も調整できます。',
          },
          {
            title: 'すばやいページ移動',
            body: 'スライダーやサムネイルから移動し、前後の巻へ進めます。',
          },
          {
            title: '読む方向に先読み',
            body: '読む方向のページを先読みし、操作の軽さを保ちます。',
          },
        ],
      },
      {
        id: 'everyday',
        number: '04',
        label: 'プライバシー・履歴',
        heading: '続きから読む。読書の傾向もわかる。',
        desktopLines: ['続きから読む。', '読書の傾向もわかる。'],
        mobileLines: ['続きから読む。', '読書の傾向も', 'わかる。'],
        body: '続きから読み、本棚を守り、読書の傾向を振り返れます。',
        visual: 'cards',
        items: [
          {
            title: 'プライベートライブラリ',
            body: 'パスワードで保護し、Touch IDやFace IDで解除できます。',
          },
          {
            title: '履歴から続きを読む',
            body: '最後に読んだページから再開できます。',
          },
          {
            title: '読書統計',
            body: '読書時間・冊数・ページ数・時間帯・タグ傾向を確認できます。',
          },
          {
            title: '好みに合わせた設定',
            body: 'テーマ、背景、ページ表現、ショートカットを調整できます。',
          },
        ],
      },
    ],
    sourceDiagram: {
      heading: '複数の保存先',
      body: 'ファイルもフォルダ構成も、そのまま。',
      sources: ['NAS 1', 'NAS 2', 'LOCAL'],
      connector: '登録',
      outputHeading: 'Owlariaで統合整理',
      outputBody:
        '整理情報はアプリ内に保存。保存場所をまたいで探して読めます。',
    },
    formats: {
      eyebrow: '対応形式',
      heading: 'マンガでよく使われる形式に対応。',
      body: '変換や展開をせず、登録してそのまま読めます。',
      archiveLabel: '対応ファイル',
      archive: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7', 'LZH', 'PDF'],
      passwordBody: 'ZIP・CBZ・RAR・CBR・7Z・CB7は、パスワード付きにも対応。',
      passwordArchive: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7'],
      imageLabel: 'アーカイブ内で読める画像形式',
      image: ['JPEG', 'PNG', 'WebP', 'AVIF', 'HEIC', 'GIF', 'BMP'],
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
