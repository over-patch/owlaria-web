import type { Locale } from '../i18n/config';

export type PlatformId = 'macos' | 'ios';
export type HomeCapabilityIconName =
  'search' | 'tracking' | 'privacy' | 'statistics';

export type Platform = {
  id: PlatformId;
  storeUrl?: string;
};

export type PlatformAction =
  | {
      kind: 'link';
      label: string;
      href: string;
    }
  | {
      kind: 'pending';
      label: string;
    };

export type HomeCopy = {
  metadata: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    desktopLines: string[];
    mobileLines: string[];
    benefits: Array<{
      title: string;
      body: string;
    }>;
    actions: {
      features: string;
      purchases: string;
    };
    preview: {
      label: string;
      desktopLabel: string;
      mobileLabel: string;
      statusLabel: string;
    };
  };
  capabilities: {
    eyebrow: string;
    heading: string;
    desktopLines: string[];
    mobileLines: string[];
    body: string[];
    action: string;
    items: Array<{
      icon: HomeCapabilityIconName;
      title: string;
      body: string;
    }>;
  };
  features: {
    eyebrow: string;
    heading: string;
    desktopLines: string[];
    mobileLines: string[];
    items: Array<{
      number: string;
      title: string;
      body: string;
    }>;
    reader: {
      number: string;
      title: string;
      body: string;
      modes: Array<{
        title: string;
        options: string[];
      }>;
    };
  };
  screenshotShowcase: {
    eyebrow: string;
    heading: string;
    body: string;
    placeholderLabel: string;
  };
  compatibility: {
    eyebrow: string;
    heading: string;
    body: string[];
    formats: string[];
    passwordLabel: string;
    passwordFormats: string;
  };
  platforms: {
    eyebrow: string;
    heading: string;
    desktopLines: string[];
    mobileLines: string[];
    body: string;
    heroFreeNote: string;
    freeNote: string;
    purchaseNote: string;
    comingSoon: string;
    futureLabel: string;
    futurePlatforms: string[];
    labels: Record<PlatformId, { name: string; detail: string }>;
  };
};

export const platforms: Platform[] = [{ id: 'macos' }, { id: 'ios' }];

export const platformAction = (
  platform: Platform,
  storeLabel: string,
  pendingLabel: string,
): PlatformAction =>
  platform.storeUrl
    ? { kind: 'link', label: storeLabel, href: platform.storeUrl }
    : { kind: 'pending', label: pendingLabel };

export const homeCopy: Record<Locale, HomeCopy> = {
  en: {
    metadata: {
      title: 'Owlaria — Comic Library for NAS & Local Folders',
      description:
        'Turn the comic folders you already have on NAS or local storage into an organized library without rebuilding your archive.',
    },
    hero: {
      eyebrow: 'A comic library that does not clutter your storage',
      heading: 'Keep your folders. Build the comic library you want.',
      desktopLines: [
        'Keep your folders.',
        'Build the comic library',
        'you want.',
      ],
      mobileLines: [
        'Keep your',
        'folders.',
        'Build the',
        'comic library',
        'you want.',
      ],
      benefits: [
        {
          title: 'Add your folders as they are',
          body: 'Add NAS and local folders to Owlaria without changing their structure.',
        },
        {
          title: 'Keep your storage uncluttered',
          body: 'Owlaria keeps tags, series, ratings, and covers separate from your storage, without changing folders or writing extra management files.',
        },
      ],
      actions: {
        features: 'Explore features',
        purchases: 'See Free and Plus',
      },
      preview: {
        label: 'Owlaria product preview',
        desktopLabel: 'Mac library screenshot',
        mobileLabel: 'iPhone reader screenshot',
        statusLabel: 'Product previews coming soon',
      },
    },
    features: {
      eyebrow: 'From folders to reading',
      heading: 'Keep your folders. Organize and read your way.',
      desktopLines: ['Keep your folders.', 'Organize and read', 'your way.'],
      mobileLines: ['Keep your', 'folders.', 'Organize and', 'read your way.'],
      items: [
        {
          number: '01',
          title: 'Add folders as they are',
          body: 'Bring multiple SMB NAS locations and local folders into one library without moving or renaming your books.',
        },
        {
          number: '02',
          title: 'Organize without touching files',
          body: 'Titles, tags, series, ratings, and custom covers stay inside Owlaria. Your source files and folders keep their existing structure.',
        },
      ],
      reader: {
        number: '03',
        title: 'Choose how every comic reads.',
        body: 'Switch viewing styles at any time to match the comic and how you want to read.',
        modes: [
          {
            title: 'Reading direction',
            options: ['Right-to-left', 'Left-to-right', 'Vertical'],
          },
          {
            title: 'Page display',
            options: ['Single page', 'Spread'],
          },
          {
            title: 'Keep scrolling',
            options: ['Continuous scroll'],
          },
        ],
      },
    },
    screenshotShowcase: {
      eyebrow: 'See Owlaria in action',
      heading: 'Keep your storage. Transform how you browse.',
      body: 'A closer look at the macOS library is coming soon.',
      placeholderLabel: 'macOS library preview coming soon',
    },
    compatibility: {
      eyebrow: 'Compatibility',
      heading: 'Open the files you already have.',
      body: [
        'Add archives to your library and start reading without converting files or extracting them into folders first.',
      ],
      formats: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7', 'LZH', 'PDF'],
      passwordLabel: 'Password-protected archives',
      passwordFormats: 'ZIP · CBZ · RAR · CBR · 7Z · CB7',
    },
    capabilities: {
      eyebrow: 'Built for collections that keep growing',
      heading: 'More than a folder browser.',
      desktopLines: ['More than', 'a folder browser.'],
      mobileLines: ['More than', 'a folder', 'browser.'],
      body: [
        'Find what you want, even among thousands of books.',
        'Keep series together, protect private libraries, and see how your reading changes over time.',
      ],
      action: 'Explore every feature',
      items: [
        {
          icon: 'search',
          title: 'Powerful library search',
          body: 'Search and filter by title, author, series, tags, rating, reading state, and more.',
        },
        {
          icon: 'tracking',
          title: 'Smart file tracking',
          body: 'Keep your app metadata when a source file is moved or renamed.',
        },
        {
          icon: 'privacy',
          title: 'Private libraries',
          body: 'Lock selected libraries and unlock them with Touch ID or Face ID.',
        },
        {
          icon: 'statistics',
          title: 'Reading insights',
          body: 'Review reading time, finished books, pages, and activity trends.',
        },
      ],
    },
    platforms: {
      eyebrow: 'Choose your platform',
      heading: 'Owlaria for Mac. Owlaria for iPhone.',
      desktopLines: ['Owlaria for Mac.', 'Owlaria for iPhone.'],
      mobileLines: ['Owlaria for', 'Mac.', 'Owlaria for', 'iPhone.'],
      body: 'On Mac and iPhone, starting free.',
      heroFreeNote: 'Free: 1 library · 100 books',
      freeNote: 'Use every feature free with one library and up to 100 books.',
      purchaseNote:
        'Owlaria Plus removes the library and book limits with a one-time purchase for each operating system. Check the App Store price shown in the app.',
      comingSoon: 'Coming soon',
      futureLabel: 'Also planned',
      futurePlatforms: ['Windows', 'Android'],
      labels: {
        macos: { name: 'Owlaria for Mac', detail: 'Mac App Store' },
        ios: { name: 'Owlaria for iPhone', detail: 'App Store' },
      },
    },
  },
  ja: {
    metadata: {
      title: 'Owlaria — NAS・ローカル対応コミックライブラリ',
      description:
        'NASやローカルストレージにあるコミックフォルダを作り直さず、そのまま整理されたライブラリとして管理できます。',
    },
    hero: {
      eyebrow: '保存先を汚さないコミックライブラリ',
      heading: 'フォルダはそのまま。理想のコミックライブラリへ。',
      desktopLines: [
        'フォルダはそのまま。',
        '理想のコミック',
        'ライブラリへ。',
      ],
      mobileLines: [
        'フォルダは',
        'そのまま。',
        '理想のコミック',
        'ライブラリへ。',
      ],
      benefits: [
        {
          title: '今のフォルダをそのまま登録',
          body: 'NASやローカルフォルダを、構成を変えずにOwlariaへ登録できます。',
        },
        {
          title: 'フォルダは汚さない',
          body: 'タグ・シリーズ・評価・表紙などはOwlariaの中で管理。ファイルやフォルダ構成を変えず、余計な管理ファイルも書き込みません。',
        },
      ],
      actions: {
        features: '機能を見る',
        purchases: '無料範囲とPlusを見る',
      },
      preview: {
        label: 'Owlariaのアプリ画面',
        desktopLabel: 'Mac版ライブラリ画面',
        mobileLabel: 'iPhone版ビューア画面',
        statusLabel: 'アプリ画面は近日公開',
      },
    },
    features: {
      eyebrow: 'フォルダから読書まで',
      heading: 'フォルダはそのまま。整理も、読み方も、思いどおりに。',
      desktopLines: [
        'フォルダはそのまま。',
        '整理も、読み方も、',
        '思いどおりに。',
      ],
      mobileLines: [
        'フォルダは',
        'そのまま。',
        '整理も、読み方も、',
        '思いどおりに。',
      ],
      items: [
        {
          number: '01',
          title: 'フォルダをそのまま登録',
          body: '複数のSMB NASやローカルフォルダを、ファイルの移動や名前変更なしでひとつのライブラリにまとめられます。',
        },
        {
          number: '02',
          title: '原本に触れずに整理',
          body: 'タイトル、タグ、シリーズ、評価、表紙などの整理情報はOwlariaの中だけに保存。元のファイルとフォルダ構成を保てます。',
        },
      ],
      reader: {
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
      },
    },
    screenshotShowcase: {
      eyebrow: '実際のアプリ画面',
      heading: '保存先はそのまま。見え方は、ここまで変わる。',
      body: 'macOSのライブラリ画面は近日公開予定です。',
      placeholderLabel: 'macOSライブラリ画面は近日公開',
    },
    compatibility: {
      eyebrow: '対応形式',
      heading: 'いつものファイルを、そのまま開ける。',
      body: [
        'ファイルを変換したり、アーカイブを展開したりせず、ライブラリに登録してそのまま閲覧できます。',
      ],
      formats: ['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7', 'LZH', 'PDF'],
      passwordLabel: 'パスワード付きアーカイブにも対応',
      passwordFormats: 'ZIP · CBZ · RAR · CBR · 7Z · CB7',
    },
    capabilities: {
      eyebrow: '増え続ける蔵書のために',
      heading: 'フォルダを超えて、見つかる本棚へ。',
      desktopLines: ['フォルダを超えて、', '見つかる本棚へ。'],
      mobileLines: ['フォルダを超えて、', '見つかる本棚へ。'],
      body: [
        '何千冊の中からでも、読みたい一冊をすぐに見つけられます。',
        'シリーズをまとめ、プライベートな本棚を守り、読書の変化を振り返れます。',
      ],
      action: 'すべての機能を見る',
      items: [
        {
          icon: 'search',
          title: '細かな検索と絞り込み',
          body: 'タイトル、作者、シリーズ、タグ、評価、読書状態などから探せます。',
        },
        {
          icon: 'tracking',
          title: 'ファイル移動を追跡',
          body: '保存場所や名前が変わっても、Owlaria内のメタデータを維持します。',
        },
        {
          icon: 'privacy',
          title: 'プライベートライブラリ',
          body: '選んだライブラリをロックし、Touch IDやFace IDで解除できます。',
        },
        {
          icon: 'statistics',
          title: '読書を振り返る統計',
          body: '読書時間、読了冊数、ページ数、アクティビティの傾向を確認できます。',
        },
      ],
    },
    platforms: {
      eyebrow: 'プラットフォームを選ぶ',
      heading: 'Macにも、iPhoneにも。Owlariaを。',
      desktopLines: ['Macにも、iPhoneにも。', 'Owlariaを。'],
      mobileLines: ['Macにも、', 'iPhoneにも。', 'Owlariaを。'],
      body: 'MacとiPhoneで、基本無料から。',
      heroFreeNote: '無料：1ライブラリ・100冊まで',
      freeNote: 'すべての機能を1ライブラリ・100冊まで無料で利用できます。',
      purchaseNote:
        'Owlaria Plusは、ライブラリ数と冊数の上限を解除するOSごとの買い切りです。価格はアプリ内のApp Store表示をご確認ください。',
      comingSoon: '近日公開',
      futureLabel: '今後登場予定',
      futurePlatforms: ['Windows', 'Android'],
      labels: {
        macos: { name: 'Owlaria for Mac', detail: 'Mac App Store' },
        ios: { name: 'Owlaria for iPhone', detail: 'App Store' },
      },
    },
  },
};
