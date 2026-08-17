import type { Locale } from '../i18n/config';

export type FeatureCategoryId =
  'storage' | 'organization' | 'metadata' | 'viewer' | 'privacy' | 'insights';

type FeatureItem = {
  title: string;
  body: string;
};

type FeatureCategory = {
  id: FeatureCategoryId;
  number: string;
  label: string;
  heading: string;
  body: string;
  items: FeatureItem[];
};

export type FeaturePageCopy = {
  metadata: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  navigationLabel: string;
  categories: FeatureCategory[];
  formats: {
    eyebrow: string;
    heading: string;
    body: string;
    archiveLabel: string;
    archive: string[];
    imageLabel: string;
    image: string[];
  };
  availability: {
    heading: string;
    body: string;
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
      title: 'Features · Owlaria',
      description:
        'Explore Owlaria features for reading and organizing comics from NAS and local storage on macOS and iOS.',
    },
    hero: {
      eyebrow: 'Owlaria features',
      heading: 'Everything your comic library needs.',
      body: 'From remote storage to the final page, Owlaria keeps your originals safe while giving you precise control over organization, reading, privacy, and history.',
    },
    navigationLabel: 'Feature categories',
    categories: [
      {
        id: 'storage',
        number: '01',
        label: 'Storage & NAS',
        heading: 'Keep the collection where it belongs.',
        body: 'Connect the storage you already use instead of rebuilding your archive around an app.',
        items: [
          {
            title: 'Read from the parts you need',
            body: 'Supported remote ZIP, CBZ, and PDF books can begin from the needed data instead of waiting for a complete copy.',
          },
          {
            title: 'SMB and local sources together',
            body: 'Combine multiple NAS locations and local folders inside one library, then scan them recursively for books.',
          },
          {
            title: 'Controlled cache and offline copies',
            body: 'Set cache limits, clear temporary data, and explicitly keep selected books available offline.',
          },
        ],
      },
      {
        id: 'organization',
        number: '02',
        label: 'Library organization',
        heading: 'Find one book among thousands.',
        body: 'Browse the collection as a visual library or follow the folders you already know.',
        items: [
          {
            title: 'Search, filter, and sort',
            body: 'Search titles, authors, series, and tags. Filter by reading state, rating, availability, favorites, and more.',
          },
          {
            title: 'Series that stay together',
            body: 'Group volumes into series, see progress at a glance, and continue from the next unread volume.',
          },
          {
            title: 'Smart file tracking',
            body: 'When a source file moves or changes its name, Owlaria can preserve the metadata you already curated.',
          },
          {
            title: 'Grid, list, or Explorer',
            body: 'Switch between cover-focused views and a Read-Only folder browser without changing the source structure.',
          },
        ],
      },
      {
        id: 'metadata',
        number: '03',
        label: 'Metadata',
        heading: 'Organize freely, apart from the originals.',
        body: 'Build the library you want without renaming files or adding sidecars beside them.',
        items: [
          {
            title: 'Your edits take priority',
            body: 'Edit titles, authors, series, tags, ratings, favorites, and reading state without touching the original file.',
          },
          {
            title: 'Non-destructive custom covers',
            body: 'Choose any page, crop the visible area, and use it as a cover while leaving the source image unchanged.',
          },
          {
            title: 'Bulk editing',
            body: 'Apply authors, tags, ratings, and favorites to multiple books when a growing collection needs a faster workflow.',
          },
        ],
      },
      {
        id: 'viewer',
        number: '04',
        label: 'Comic viewer',
        heading: 'Make the page—not the controls—the focus.',
        body: 'Choose the reading flow that matches the work, the screen, and your preferences.',
        items: [
          {
            title: 'Every reading direction',
            body: 'Use right-to-left, left-to-right, or vertical reading with single-page, spread, and continuous layouts.',
          },
          {
            title: 'Spread-aware presentation',
            body: 'Keep the cover on its own, show wide scans as a single page, and adjust spread alignment when pairing pages.',
          },
          {
            title: 'Fast navigation',
            body: 'Jump with a scrubber, filmstrip, or thumbnail grid, then continue directly into the previous or next book.',
          },
          {
            title: 'Reading warmup',
            body: 'Owlaria prepares nearby pages in the direction you are reading while keeping interactive reading ahead of background work.',
          },
        ],
      },
      {
        id: 'privacy',
        number: '05',
        label: 'Privacy',
        heading: 'Protection built around your library.',
        body: 'Source access is designed to be Read-Only, and selected collections can stay out of sight until you unlock them.',
        items: [
          {
            title: 'Read-Only by design',
            body: 'Owlaria reads source storage without rename, move, delete, create, or sidecar-writing operations.',
          },
          {
            title: 'Private libraries',
            body: 'Protect a library with a password and unlock it with Touch ID or Face ID on supported Apple devices.',
          },
          {
            title: 'Local reading state',
            body: 'Reading positions, history, and curated metadata are stored separately from the comic originals.',
          },
        ],
      },
      {
        id: 'insights',
        number: '06',
        label: 'History & insights',
        heading: 'Return to a story—or see the bigger picture.',
        body: 'Resume quickly and understand how your reading changes over days, weeks, and months.',
        items: [
          {
            title: 'Continue where you stopped',
            body: 'Open recent books from history and resume from the last recorded page.',
          },
          {
            title: 'Reading statistics',
            body: 'Review reading time, finished books, pages read, monthly trends, weekly habits, active hours, and tag distribution.',
          },
          {
            title: 'Settings that follow your preference',
            body: 'Adjust themes, backgrounds, page shadows, transitions, opening behavior, and customizable desktop shortcuts.',
          },
        ],
      },
    ],
    formats: {
      eyebrow: 'Compatibility',
      heading: 'The formats comic archives actually use.',
      body: 'Open common archives and documents, including password-protected archives when the format supports them.',
      archiveLabel: 'Archives and documents',
      archive: ['ZIP / CBZ', 'RAR / CBR', '7Z / CB7', 'LZH', 'PDF'],
      imageLabel: 'Images inside archives',
      image: ['JPEG', 'PNG', 'WebP', 'AVIF', 'HEIC', 'GIF', 'BMP'],
    },
    availability: {
      heading: 'Designed first for macOS and iOS.',
      body: 'Some features depend on the device. The Temporary Viewer and customizable keyboard shortcuts are desktop features; Touch ID and Face ID availability follows supported Apple hardware.',
    },
    closing: {
      eyebrow: 'The Owlaria difference',
      heading: 'Keep the archive. Change the experience.',
      body: 'See why Owlaria starts with the collection you already own and keeps app data separate from the originals.',
      action: 'Back to overview',
    },
  },
  ja: {
    metadata: {
      title: '機能 · Owlaria',
      description:
        'macOSとiOSでNAS・ローカルストレージの漫画を整理・閲覧するためのOwlariaの機能をご紹介します。',
    },
    hero: {
      eyebrow: 'Owlariaの機能',
      heading: 'コミックライブラリに必要なものを、ひとつに。',
      body: 'ストレージから最後のページまで。原本を守りながら、整理・閲覧・プライバシー・履歴を細かくコントロールできます。',
    },
    navigationLabel: '機能カテゴリー',
    categories: [
      {
        id: 'storage',
        number: '01',
        label: 'ストレージ・NAS',
        heading: 'コレクションは、いまある場所のまま。',
        body: 'アプリに合わせて書庫を作り直さず、使い慣れたストレージへ接続できます。',
        items: [
          {
            title: '必要な部分から読み始める',
            body: '対応するリモートのZIP・CBZ・PDFは、完全なコピーを待たず、必要なデータから読み始められます。',
          },
          {
            title: 'SMBとローカルをひとつに',
            body: '複数のNASとローカルフォルダをひとつのライブラリへまとめ、再帰的にスキャンできます。',
          },
          {
            title: 'キャッシュとオフライン保存',
            body: 'キャッシュ上限や一時データを管理し、選んだ本だけを明示的にオフライン保存できます。',
          },
        ],
      },
      {
        id: 'organization',
        number: '02',
        label: 'ライブラリ整理',
        heading: '何千冊の中から、一冊を見つける。',
        body: '表紙を眺めるライブラリとしても、使い慣れたフォルダ構成からも探せます。',
        items: [
          {
            title: '検索・絞り込み・並べ替え',
            body: 'タイトル、作者、シリーズ、タグを検索。読書状態、評価、利用可否、お気に入りなどから絞り込めます。',
          },
          {
            title: 'シリーズをまとめる',
            body: '巻をシリーズにまとめ、進捗を確認しながら次の未読巻から続きを読めます。',
          },
          {
            title: 'ファイル移動を追跡',
            body: '保存場所やファイル名が変わっても、整理してきたメタデータを維持できます。',
          },
          {
            title: 'グリッド・リスト・Explorer',
            body: '表紙中心の表示と、原本を変更できないRead-Onlyのフォルダ表示を切り替えられます。',
          },
        ],
      },
      {
        id: 'metadata',
        number: '03',
        label: 'メタデータ',
        heading: '自由に整理する。原本は書き換えない。',
        body: 'ファイル名を変更したり、原本の隣にサイドカーファイルを作ったりせず、理想の本棚を作れます。',
        items: [
          {
            title: 'ユーザーの編集を最優先',
            body: 'タイトル、作者、シリーズ、タグ、評価、お気に入り、読書状態を原本に触れず編集できます。',
          },
          {
            title: '非破壊のカスタム表紙',
            body: '任意のページと表示範囲を選び、元画像とは別に表紙情報を保存します。',
          },
          {
            title: 'まとめて編集',
            body: '作者、タグ、評価、お気に入りを複数の本へ一括設定できます。',
          },
        ],
      },
      {
        id: 'viewer',
        number: '04',
        label: 'コミックビューア',
        heading: '操作ではなく、ページを主役に。',
        body: '作品、画面、好みに合わせて、読み進め方を選べます。',
        items: [
          {
            title: 'すべての読み方向',
            body: '右開き・左開き・縦読みと、単ページ・見開き・連続スクロールを組み合わせられます。',
          },
          {
            title: '見開きを自然に表示',
            body: '表紙は単独、横長スキャンは一枚で表示し、ページを組む位置も調整できます。',
          },
          {
            title: 'すばやいページ移動',
            body: 'スライダー、フィルムストリップ、サムネイル一覧から移動し、前後の巻へそのまま進めます。',
          },
          {
            title: 'Reading Warmup',
            body: '読む方向に合わせて近くのページを準備し、バックグラウンド処理より読書操作を優先します。',
          },
        ],
      },
      {
        id: 'privacy',
        number: '05',
        label: 'プライバシー',
        heading: 'ライブラリを中心に考えた保護。',
        body: '原本は変更せず、選んだコレクションは解除するまで表示しないよう保護できます。',
        items: [
          {
            title: '構造からRead-Only',
            body: '原本に対する名前変更、移動、削除、作成、サイドカー書き込みの操作を持たない設計です。',
          },
          {
            title: 'プライベートライブラリ',
            body: 'パスワードで保護し、対応するAppleデバイスではTouch IDまたはFace IDで解除できます。',
          },
          {
            title: '読書状態は原本と分離',
            body: '読書位置、履歴、編集したメタデータは、コミックの原本とは別に保存します。',
          },
        ],
      },
      {
        id: 'insights',
        number: '06',
        label: '履歴・統計',
        heading: '物語へ戻る。読書の全体も見渡す。',
        body: 'すぐに続きを開き、日・週・月ごとの読書の変化を振り返れます。',
        items: [
          {
            title: '止めたページから再開',
            body: '最近読んだ本を履歴から開き、記録された最後のページから再開できます。',
          },
          {
            title: '読書統計',
            body: '読書時間、読了冊数、ページ数、月別傾向、曜日・時間帯別の活動、タグ分布を確認できます。',
          },
          {
            title: '好みに合わせた設定',
            body: 'テーマ、背景、ページ影、遷移、開始時の挙動、デスクトップ用ショートカットを調整できます。',
          },
        ],
      },
    ],
    formats: {
      eyebrow: '対応形式',
      heading: 'コミック書庫で使われる形式に対応。',
      body: '一般的なアーカイブと文書を開け、形式が対応している場合はパスワード付きアーカイブも閲覧できます。',
      archiveLabel: 'アーカイブ・文書',
      archive: ['ZIP / CBZ', 'RAR / CBR', '7Z / CB7', 'LZH', 'PDF'],
      imageLabel: 'アーカイブ内の画像',
      image: ['JPEG', 'PNG', 'WebP', 'AVIF', 'HEIC', 'GIF', 'BMP'],
    },
    availability: {
      heading: 'macOSとiOSのために、まず設計。',
      body: '一部の機能はデバイスによって異なります。一時ビューアとショートカット変更はデスクトップ向け、Touch IDとFace IDは対応するAppleデバイスで利用できます。',
    },
    closing: {
      eyebrow: 'Owlariaの違い',
      heading: '原本はそのまま。読書体験だけを変える。',
      body: 'いま持っているコレクションを出発点にし、原本とアプリ内の整理情報を分けるOwlariaの考え方をご覧ください。',
      action: '概要へ戻る',
    },
  },
};
