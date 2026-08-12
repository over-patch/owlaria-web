import type { Locale } from '../i18n/config';
import type {
  ProblemReportCategory,
  ProblemReportErrorKind,
} from '../lib/problem-report';

type ProblemReportCopy = {
  eyebrow: string;
  title: string;
  introduction: string;
  oneWayNotice: string;
  prohibitedInformation: string;
  privacy: {
    prefix: string;
    linkLabel: string;
    suffix: string;
  };
  appAlternative: string;
  categoryLabel: string;
  categoryPlaceholder: string;
  categories: Record<ProblemReportCategory, string>;
  messageLabel: string;
  messageHelp: string;
  characterCountLabel: string;
  submit: string;
  submitting: string;
  validationSummary: string;
  fieldErrors: {
    categoryRequired: string;
    categoryInvalid: string;
    messageRequired: string;
    messageTooLong: string;
  };
  errors: Record<ProblemReportErrorKind, string>;
  success: {
    title: string;
    description: string;
    referenceLabel: string;
    copy: string;
    copied: string;
    copyFailed: string;
    sendAnother: string;
  };
  noScript: string;
};

export const problemReportCopy: Record<Locale, ProblemReportCopy> = {
  en: {
    eyebrow: 'Web problem report',
    title: 'Send a problem report',
    introduction:
      'Use this Web form if you cannot open or use Owlaria. Select a category and describe the problem.',
    oneWayNotice:
      'This is a one-way problem report and feedback channel. We do not provide an individual reply or investigation-result notice, and we do not guarantee a fix or when one will be available.',
    prohibitedInformation:
      'Do not include your name, email address, Apple Account, Support ID, file path, book or library information, raw log, receipt, transaction ID, credential, or other secret.',
    privacy: {
      prefix: 'Before sending, review the ',
      linkLabel: 'Privacy Policy',
      suffix: '.',
    },
    appAlternative:
      'If you can use Owlaria, Settings > Information > Report a problem also lets you review optional diagnostic information and choose whether to include it.',
    categoryLabel: 'Category',
    categoryPlaceholder: 'Choose a category',
    categories: {
      billing: 'Owlaria Plus and purchases',
      crash: 'Launch and crashes',
      library: 'Library and importing books',
      viewer: 'Reading and display',
      feature_request: 'Feature request',
      other: 'Other',
    },
    messageLabel: 'Problem description',
    messageHelp:
      'Required. Describe what happened without including personal, library, transaction, or diagnostic information.',
    characterCountLabel: 'Characters used',
    submit: 'Send problem report',
    submitting: 'Sending…',
    validationSummary: 'Review the highlighted fields and try again.',
    fieldErrors: {
      categoryRequired: 'Choose a category.',
      categoryInvalid: 'Choose a valid category.',
      messageRequired: 'Enter a problem description.',
      messageTooLong: 'Keep the description to 8,000 characters or fewer.',
    },
    errors: {
      validation:
        'The report could not be validated. Review the fields and try again.',
      suspended:
        'Problem reporting is temporarily unavailable. Please try again later.',
      payload_too_large:
        'The report is too large to send. Shorten the description and try again.',
      rate_limited:
        'Too many reports were sent recently. Wait before trying again.',
      server:
        'The report could not be sent because the service is unavailable. Please try again later.',
      timeout: 'The request timed out. Check your connection and try again.',
      offline: 'You appear to be offline. Reconnect and try again.',
    },
    success: {
      title: 'Problem report received',
      description:
        'Keep the reference number if you need to identify this submission later.',
      referenceLabel: 'Reference number',
      copy: 'Copy reference number',
      copied: 'Reference number copied.',
      copyFailed: 'The reference number could not be copied. Copy it manually.',
      sendAnother: 'Send another report',
    },
    noScript:
      'JavaScript is required to send this Web form. If you can use Owlaria, open Settings > Information > Report a problem; otherwise enable JavaScript and reload this page.',
  },
  ja: {
    eyebrow: 'Web問題報告',
    title: '問題を報告する',
    introduction:
      'Owlariaを起動・利用できない場合は、このWebフォームをご利用ください。カテゴリーを選び、問題の内容を入力します。',
    oneWayNotice:
      'これは一方向の問題報告・フィードバック受付です。個別返信や調査結果の通知は行わず、修正の実施や時期を保証しません。',
    prohibitedInformation:
      '氏名、メールアドレス、Apple Account、Support ID、ファイルパス、書籍・ライブラリ情報、raw log、receipt、transaction ID、credential、その他の秘密情報は入力しないでください。',
    privacy: {
      prefix: '送信前に',
      linkLabel: 'プライバシーポリシー',
      suffix: 'をご確認ください。',
    },
    appAlternative:
      'Owlariaを利用できる場合は、Settings > Information > Report a problemから、任意の診断情報を確認し、含めるか選択できるアプリ内フォームも利用できます。',
    categoryLabel: 'カテゴリー',
    categoryPlaceholder: 'カテゴリーを選択',
    categories: {
      billing: 'Owlaria Plus・購入',
      crash: '起動・クラッシュ',
      library: 'ライブラリ・本の取り込み',
      viewer: '閲覧・表示',
      feature_request: '機能の要望',
      other: 'その他',
    },
    messageLabel: '問題の説明',
    messageHelp:
      '必須です。個人情報、ライブラリ情報、取引情報、診断情報を含めずに、発生した問題を入力してください。',
    characterCountLabel: '入力文字数',
    submit: '問題報告を送信',
    submitting: '送信中…',
    validationSummary: '入力内容を確認し、もう一度お試しください。',
    fieldErrors: {
      categoryRequired: 'カテゴリーを選択してください。',
      categoryInvalid: '有効なカテゴリーを選択してください。',
      messageRequired: '問題の説明を入力してください。',
      messageTooLong: '問題の説明は8,000文字以内で入力してください。',
    },
    errors: {
      validation:
        '問題報告を検証できませんでした。入力内容を確認し、もう一度お試しください。',
      suspended:
        '現在、問題報告の受付を一時停止しています。時間をおいて再度お試しください。',
      payload_too_large:
        '問題報告の内容が大きすぎます。説明を短くして、もう一度お試しください。',
      rate_limited:
        '短時間に多くの問題報告が送信されました。しばらく待ってから再度お試しください。',
      server:
        'サービスを利用できないため送信できませんでした。時間をおいて再度お試しください。',
      timeout:
        '送信がタイムアウトしました。通信状態を確認して、もう一度お試しください。',
      offline:
        'オフラインのようです。インターネットへ接続して、もう一度お試しください。',
    },
    success: {
      title: '問題報告を受け付けました',
      description:
        'この送信を後から確認する必要がある場合に備えて、受付番号を保管してください。',
      referenceLabel: '受付番号',
      copy: '受付番号をコピー',
      copied: '受付番号をコピーしました。',
      copyFailed:
        '受付番号をコピーできませんでした。手動でコピーしてください。',
      sendAnother: '別の問題を報告する',
    },
    noScript:
      'このWebフォームの送信にはJavaScriptが必要です。Owlariaを利用できる場合はSettings > Information > Report a problemを開いてください。利用できない場合はJavaScriptを有効にして、このページを再読み込みしてください。',
  },
};
