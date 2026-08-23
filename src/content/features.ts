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
    highlights: string[];
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
    passwordLabel: string;
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
  };
  closing: {
    eyebrow: string;
    heading: string;
    body: string;
    action: string;
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
      body: 'Bring multiple NAS locations and local folders into one library. Keep app metadata separate from your storage, then organize and read each title your way.',
      highlights: [
        'Unify multiple NAS and local folders',
        'No management files written to storage',
        'Core features are free',
      ],
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
        body: 'Add the NAS and local folders you already use. Owlaria keeps its organization data inside the app instead of placing sidecar files beside your comics.',
        visual: 'sources',
        items: [
          {
            title: 'Multiple sources, one library',
            body: 'Combine multiple SMB NAS locations and local folders, then browse, search, and read across them as one library.',
          },
          {
            title: 'Read-Only source design',
            body: 'Source access is designed to avoid renaming, moving, deleting, creating, or writing sidecar files.',
          },
          {
            title: 'Start with the data you need',
            body: 'Supported remote ZIP, CBZ, and PDF files can start opening before a complete copy finishes downloading.',
          },
          {
            title: 'Cache and offline copies',
            body: 'Set cache limits, clear temporary data, and keep selected books available when the source is offline.',
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
        body: 'Browse covers or follow the folder structure you already know. Add the metadata that helps you find, group, and revisit every book.',
        visual: 'preview',
        preview: {
          platform: 'MAC',
          title: 'Library and search screen',
          note: 'To be replaced with an approved Owlaria screenshot',
        },
        items: [
          {
            title: 'Search, filter, and sort',
            body: 'Search titles, authors, series, and tags. Filter by reading state, rating, availability, favorites, and more.',
          },
          {
            title: 'Series and next unread volume',
            body: 'Keep volumes together, see progress at a glance, and continue with the next unread book.',
          },
          {
            title: 'Metadata stays in Owlaria',
            body: 'Edit titles, authors, tags, ratings, reading state, and favorites without changing the source file.',
          },
          {
            title: 'Custom covers and bulk editing',
            body: 'Choose a page and crop for the cover, or apply shared details to multiple books at once.',
          },
          {
            title: 'Smart file tracking',
            body: 'Preserve curated metadata when a source file moves or changes its name.',
          },
          {
            title: 'Grid, list, or Explorer',
            body: 'Switch between cover-focused views and a Read-Only Explorer that follows the original folder structure.',
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
        body: 'Combine reading direction and page layout for the work, the screen, and how you want to read today.',
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
        items: [
          {
            title: 'Natural spreads',
            body: 'Keep covers on their own, display wide scans as one page, and adjust where paired pages begin.',
          },
          {
            title: 'Fast navigation',
            body: 'Move with a scrubber, filmstrip, or thumbnail grid, then continue into the previous or next book.',
          },
          {
            title: 'Prepare nearby pages',
            body: 'Owlaria prepares nearby pages in your reading direction while keeping interactive reading responsive.',
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
        body: 'Return to the last page quickly, protect selected libraries, and see how your reading changes over time.',
        visual: 'cards',
        items: [
          {
            title: 'Private libraries',
            body: 'Protect a library with a password and unlock it with Touch ID or Face ID on supported Apple devices.',
          },
          {
            title: 'Resume from history',
            body: 'Open a recent book and continue from the last recorded page.',
          },
          {
            title: 'Reading statistics',
            body: 'Review reading time, finished books, pages, monthly trends, day-of-week patterns, active hours, and tag distribution.',
          },
          {
            title: 'Preferences that fit you',
            body: 'Adjust themes, backgrounds, page shadows, transitions, opening behavior, and customizable desktop shortcuts.',
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
        'Manage tags, series, ratings, and covers in the app. Browse, search, and read across every source.',
    },
    formats: {
      eyebrow: 'Compatibility',
      heading: 'Open the formats comic libraries actually use.',
      body: 'Register and read common archives and documents without converting or extracting them first.',
      archiveLabel: 'Archives and documents',
      archive: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7', 'LZH', 'PDF'],
      passwordLabel: 'Password-protected archives',
      passwordBody:
        'Enter the password in Owlaria and read without extracting the archive.',
      passwordArchive: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7'],
      imageLabel: 'Images inside archives',
      image: ['JPEG', 'PNG', 'WebP', 'AVIF', 'HEIC', 'GIF', 'BMP'],
    },
    availability: {
      eyebrow: 'Platforms & pricing',
      heading: 'Coming to Mac and iPhone with free core features.',
      body: 'Owlaria is preparing its first release for Mac and iPhone. Windows and Android are planned for the future.',
      currentLabel: 'First release',
      currentPlatforms: ['Mac', 'iPhone'],
      futureLabel: 'Planned',
      futurePlatforms: ['Windows', 'Android'],
      comingSoon: 'Coming soon',
      freeNote: 'Core features are free to use.',
      purchaseNote:
        'Paid features are purchased separately for the Mac and iPhone versions.',
    },
    closing: {
      eyebrow: 'Owlaria overview',
      heading: 'Keep your folders. Make reading your own.',
      body: 'Return to the overview to see how Owlaria brings storage, organization, and reading together.',
      action: 'Back to overview',
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
        '整理も、読み方も、思いどおりに。',
      ],
      mobileLines: [
        'フォルダはそのまま。',
        '整理も、読み方も、',
        '思いどおりに。',
      ],
      body: '複数のNASやローカルフォルダを、ひとつのライブラリへ。整理情報は保存先と切り離し、マンガごとに読み方を選べます。',
      highlights: [
        '複数のNAS・ローカルを統合',
        '保存先に管理ファイルを書き込まない',
        '基本機能は無料',
      ],
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
        body: 'いま使っているNASやローカルフォルダを、そのままOwlariaに追加。整理情報はアプリ内で管理し、マンガの隣に管理ファイルを増やしません。',
        visual: 'sources',
        items: [
          {
            title: '複数の保存先をひとつに',
            body: '複数のSMB NASとローカルフォルダをまとめ、保存場所をまたいで一覧・検索・閲覧できます。',
          },
          {
            title: '保存先へ書き込まない設計',
            body: 'ファイル名の変更、移動、削除、新規作成、サイドカーの書き込みを行わないRead-Only設計です。',
          },
          {
            title: '必要なデータから読み始める',
            body: '対応するリモートのZIP・CBZ・PDFは、本全体のコピーを待たず、必要なデータから読み始められます。',
          },
          {
            title: 'キャッシュとオフライン保存',
            body: 'キャッシュの上限設定と一時データの削除に対応。選んだマンガは、オフラインでも読めるように保存できます。',
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
        body: '表紙から探す。いつものフォルダをたどる。自分に合った見つけ方で、マンガを整理できます。',
        visual: 'preview',
        preview: {
          platform: 'MAC',
          title: 'ライブラリ・検索画面',
          note: '正式なOwlariaの画面へ差し替え予定',
        },
        items: [
          {
            title: '検索・絞り込み・並べ替え',
            body: 'タイトル、作者、シリーズ、タグを検索。読書状態、評価、利用可否、お気に入りなどから絞り込めます。',
          },
          {
            title: 'シリーズと次の未読巻',
            body: '巻をシリーズにまとめ、進捗を確認しながら次の未読巻から続きを読めます。',
          },
          {
            title: '整理情報はOwlariaの中で',
            body: 'タイトル、作者、タグ、評価、読書状態、お気に入りを、原本とは別に管理できます。',
          },
          {
            title: 'カスタム表紙とまとめて編集',
            body: '任意のページと範囲を表紙に設定。共通する情報は、複数のマンガへ一括で反映できます。',
          },
          {
            title: 'ファイル移動を追跡',
            body: '保存場所やファイル名が変わっても、整理してきたメタデータを維持できます。',
          },
          {
            title: 'グリッド・リスト・Explorer',
            body: '表紙中心の表示と、元のフォルダ構成をたどるRead-OnlyのExplorerを切り替えられます。',
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
        body: '作品や画面、その日の読み方に合わせて、読み方向と表示方法をいつでも切り替えられます。',
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
        items: [
          {
            title: '見開きを自然に表示',
            body: '表紙は単ページ、横長スキャンは一枚のページとして表示。見開きの開始位置も調整できます。',
          },
          {
            title: 'すばやいページ移動',
            body: 'スライダー、フィルムストリップ、サムネイル一覧から移動し、前後の巻へそのまま進めます。',
          },
          {
            title: '読む方向に先読み',
            body: '読む方向に合わせて近くのページを準備し、バックグラウンド処理より読書操作を優先します。',
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
        body: '止めたページへすぐに戻り、選んだライブラリを守りながら、日・週・月ごとの読書を振り返れます。',
        visual: 'cards',
        items: [
          {
            title: 'プライベートライブラリ',
            body: 'パスワードで保護し、対応するAppleデバイスではTouch IDまたはFace IDで解除できます。',
          },
          {
            title: '履歴から続きを読む',
            body: '最近読んだマンガを開き、記録された最後のページから再開できます。',
          },
          {
            title: '読書統計',
            body: '読書時間、読了冊数、ページ数、月別傾向、曜日・時間帯別の活動、タグ分布を確認できます。',
          },
          {
            title: '好みに合わせた設定',
            body: 'テーマ、背景、ページの影、遷移、開始時の挙動、デスクトップ用ショートカットを調整できます。',
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
        'タグ・シリーズ・評価・表紙をアプリ内で管理。保存場所をまたいで、一覧・検索・閲覧できます。',
    },
    formats: {
      eyebrow: '対応形式',
      heading: 'マンガでよく使われる形式に対応。',
      body: 'ファイルを変換したり、アーカイブを展開したりせず、そのままライブラリへ登録して閲覧できます。',
      archiveLabel: 'アーカイブ・文書',
      archive: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7', 'LZH', 'PDF'],
      passwordLabel: 'パスワード付きアーカイブ',
      passwordBody:
        'Owlariaでパスワードを入力し、展開せずにそのまま閲覧できます。',
      passwordArchive: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7'],
      imageLabel: 'アーカイブ内の画像',
      image: ['JPEG', 'PNG', 'WebP', 'AVIF', 'HEIC', 'GIF', 'BMP'],
    },
    availability: {
      eyebrow: '対応環境・料金',
      heading: 'MacとiPhoneに、基本無料で登場予定。',
      body: 'OwlariaはMac版とiPhone版の初回リリースに向けて準備中です。Windows版とAndroid版も、今後の登場を予定しています。',
      currentLabel: '初回リリース',
      currentPlatforms: ['Mac', 'iPhone'],
      futureLabel: '登場予定',
      futurePlatforms: ['Windows', 'Android'],
      comingSoon: '近日公開',
      freeNote: 'Owlariaの基本機能は無料で利用できます。',
      purchaseNote: '有料機能はMac版とiPhone版で、それぞれ別に購入できます。',
    },
    closing: {
      eyebrow: 'Owlariaの概要',
      heading: 'フォルダはそのまま。読み方は、もっと自由に。',
      body: '保存先、整理、閲覧をひとつにつなぐOwlariaの全体像は、概要ページでご覧いただけます。',
      action: '概要へ戻る',
    },
  },
};
