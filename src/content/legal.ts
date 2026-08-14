import type { Locale } from '../i18n/config';

export type LegalBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'links'; items: { label: string; href: string }[] }
  | { kind: 'subsection'; title: string; blocks: LegalBlock[] };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocumentCopy = {
  metadata: { title: string; description: string };
  eyebrow: string;
  title: string;
  effectiveLabel: string;
  effectiveDate: string;
  updatedLabel: string;
  updatedDate: string;
  contentsLabel: string;
  sections: LegalSection[];
};

const paragraph = (text: string): LegalBlock => ({ kind: 'paragraph', text });
const list = (...items: string[]): LegalBlock => ({ kind: 'list', items });
const links = (...items: { label: string; href: string }[]): LegalBlock => ({
  kind: 'links',
  items,
});
const subsection = (title: string, ...blocks: LegalBlock[]): LegalBlock => ({
  kind: 'subsection',
  title,
  blocks,
});

const providerLinks = {
  en: [
    {
      label: 'Apple Privacy Policy',
      href: 'https://www.apple.com/legal/privacy/',
    },
    {
      label: 'RevenueCat Privacy Policy',
      href: 'https://www.revenuecat.com/privacy/',
    },
    {
      label: 'Google Privacy Policy',
      href: 'https://policies.google.com/privacy',
    },
    {
      label: 'GitHub Privacy Statement',
      href: 'https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement',
    },
  ],
  ja: [
    {
      label: 'Appleプライバシーポリシー',
      href: 'https://www.apple.com/jp/legal/privacy/',
    },
    {
      label: 'RevenueCat Privacy Policy',
      href: 'https://www.revenuecat.com/privacy/',
    },
    {
      label: 'Googleプライバシーポリシー',
      href: 'https://policies.google.com/privacy?hl=ja',
    },
    {
      label: 'GitHub Privacy Statement',
      href: 'https://docs.github.com/ja/site-policy/privacy-policies/github-general-privacy-statement',
    },
  ],
} as const;

export const privacyPolicyCopy: Record<Locale, LegalDocumentCopy> = {
  en: {
    metadata: {
      title: 'Privacy Policy · Owlaria',
      description:
        'Learn how overpatch handles information in Owlaria, purchases, diagnostics, and one-way problem reports.',
    },
    eyebrow: 'Legal / Privacy',
    title: 'Owlaria Privacy Policy',
    effectiveLabel: 'Effective date',
    effectiveDate: 'August 15, 2026',
    updatedLabel: 'Last updated',
    updatedDate: 'August 15, 2026',
    contentsLabel: 'Privacy Policy contents',
    sections: [
      {
        id: 'scope',
        title: '1. Scope',
        blocks: [
          paragraph(
            'This Privacy Policy explains how overpatch, a jointly operated group that provides Owlaria (“we,” “us,” or “our”), handles information in the Owlaria application and the official Owlaria website.',
          ),
          paragraph(
            'Information independently collected and controlled by Apple, RevenueCat, Google, GitHub, or another third party is also subject to that provider’s privacy policy.',
          ),
        ],
      },
      {
        id: 'basic-handling',
        title: '2. Owlaria’s basic data handling',
        blocks: [
          paragraph(
            'Owlaria manages and displays books stored in local folders, SMB shares, and other data sources selected by the user. Book and library content, file paths, reading information, and data-source credentials are generally processed on the user’s device or directly with a data source selected by the user and are not uploaded to our servers.',
          ),
          paragraph(
            'We receive and store information that a user voluntarily enters in a problem report. Do not enter personal information, file paths, book or library names or content, raw logs, receipts, transaction IDs, or credentials in the free-text field.',
          ),
        ],
      },
      {
        id: 'information',
        title: '3. Information we handle',
        blocks: [
          subsection(
            '3.1 Purchases and Owlaria Plus',
            paragraph(
              'We use the Apple App Store and RevenueCat to process Owlaria Plus purchases, restore purchases, and reflect refunds or revocations.',
            ),
            list(
              'An anonymous, app-specific RevenueCat App User ID',
              'Product, purchase status, entitlement, restore, refund, and revocation information',
              'Device, operating-system, and other technical information needed to manage purchases',
            ),
            paragraph(
              'Owlaria does not create its own user account, and we do not associate the identifier with a name, email address, or Apple Account. Owlaria Plus for iOS and macOS are separate products, and purchase rights are not shared between operating systems.',
            ),
            paragraph(
              'Owlaria may store the latest confirmed Free, Plus, or temporarily unknown license state on the device. We do not operate a separate billing backend that stores complete receipts or transaction IDs.',
            ),
          ),
          subsection(
            '3.2 Apple diagnostics',
            paragraph(
              'Owlaria does not include our own product-analytics SDK or an external crash-reporting SDK. Depending on the user’s Apple settings and Apple’s availability rules, Apple may provide crash, hang, performance, version, build, operating-system, signature, backtrace, or related diagnostic information.',
            ),
            paragraph(
              'We use Apple diagnostics only to investigate failures and improve quality and stability. Raw diagnostics are processed only while needed for analysis and are not retained permanently. We retain only sanitized summaries that exclude raw logs and information that could identify a person or device.',
            ),
          ),
          subsection(
            '3.3 One-way problem reports and feedback',
            paragraph(
              'Users may submit problem reports or feedback from Owlaria or the official website. This is a one-way channel for quality improvement, not individual support. We do not promise an individual response, notice of investigation results, a fix, or a particular time for a fix.',
            ),
            paragraph('For every submission, we receive:'),
            list(
              'The category selected by the user and the problem description entered by the user',
              'A request ID used to prevent duplicate submissions',
              'A reference number, submission time, application identifier, and source',
              'The version of the privacy notice shown with the form',
            ),
            paragraph(
              'We do not request a reply preference, name, email address, subject, or attachment.',
            ),
            paragraph(
              'Only when the user reviews the information and chooses to include diagnostics for that submission, we also receive:',
            ),
            list(
              'A Support ID, which is the current anonymous RevenueCat App User ID',
              'App version and build, platform, operating-system version, locale, distribution channel, Store environment, and event time',
              'Structured error codes, severity, and permitted error context',
              'For billing problems, technical information about the operation, outcome, license state, and configured Store identifiers',
            ),
            paragraph(
              'A user may submit only a category and problem description without diagnostics. The Support ID is not an Apple Account, an Owlaria account, or proof of identity.',
            ),
          ),
          subsection(
            '3.4 API and website technical information',
            paragraph(
              'The problem-report API, website hosting, CDN, and security infrastructure may temporarily process or log IP address, User-Agent, request time and path, and error information to provide the service, apply rate limits, prevent abuse, maintain security, and investigate failures.',
            ),
            paragraph(
              'We do not store or associate IP addresses with a problem-report record or Support ID, and we do not use them for advertising, profiling, tracking, or product analytics.',
            ),
          ),
        ],
      },
      {
        id: 'use',
        title: '4. How we use information',
        blocks: [
          paragraph('We use information to:'),
          list(
            'Determine Owlaria Plus status and reflect purchases, restores, refunds, and revocations',
            'Receive, deduplicate, classify, and investigate problem reports',
            'Investigate defects, crashes, performance issues, and billing problems',
            'Improve Owlaria’s quality, stability, safety, and features',
            'Prevent, detect, and respond to abuse and security incidents',
            'Comply with legal obligations and establish, exercise, or defend legal rights',
          ),
          paragraph(
            'We do not use information for third-party advertising, sale, marketing, user profiling, or cross-app or cross-site tracking.',
          ),
        ],
      },
      {
        id: 'analytics',
        title: '5. Analytics, advertising, and tracking',
        blocks: [
          paragraph(
            'For the initial release, neither Owlaria nor the official website uses our own product analytics, web analytics, advertising SDKs, advertising cookies, or cross-site tracking. We do not collect sessions, screen navigation, feature usage, reading or viewing history, or our own visitor identifier.',
          ),
          paragraph(
            'If we introduce any of these practices, we will update this Policy and any required consent or Store disclosure before implementation.',
          ),
        ],
      },
      {
        id: 'providers',
        title: '6. Third-party services',
        blocks: [
          list(
            'Apple: App Store purchases, restores, refunds and revocations, and Apple diagnostics',
            'RevenueCat: Owlaria Plus purchase status and entitlement management',
            'Google / Firebase: receiving, storing, securing, and managing problem reports',
            'GitHub: private development-issue handoff and official website hosting through GitHub Pages',
          ),
          paragraph(
            'We use these services only as needed for the purposes described in this Policy. We do not sell information or disclose it to unrelated third parties, except where required by law, needed to protect life, property, or rights, or involved in a business transfer subject to appropriate protection.',
          ),
          links(...providerLinks.en),
        ],
      },
      {
        id: 'international',
        title: '7. International processing',
        blocks: [
          paragraph(
            'We make Owlaria available in multiple countries and regions. Depending on the locations and infrastructure of our providers, information may be processed or stored outside the user’s country of residence. We take measures required by applicable law and our agreements with providers.',
          ),
        ],
      },
      {
        id: 'retention',
        title: '8. Retention and deletion',
        blocks: [
          paragraph(
            'We do not set a fixed retention period or automatic deletion schedule for problem reports, diagnostics, and related intake and management information. We may retain them for a long period while reasonably needed to review and investigate reports, improve quality, identify recurring problems, prevent abuse, respond to legal obligations, or establish, exercise, or defend legal rights.',
          ),
          paragraph(
            'When we no longer have a reasonable need to retain information, or when responding to an eligible privacy request, we manually delete it or remove identifying associations from the relevant Firebase record and any Private GitHub Issue created from the report.',
          ),
          paragraph(
            'Owlaria does not retain the problem-report text on the device after a successful submission. Information independently retained by Apple, RevenueCat, Google, GitHub, or another provider is subject to that provider’s retention and deletion practices.',
          ),
        ],
      },
      {
        id: 'choices',
        title: '9. User choices and requests',
        blocks: [
          list(
            'For each problem report, users can review diagnostics and choose whether to include them',
            'Users can submit a category and problem description without diagnostics',
            'Sharing of Apple diagnostics can be managed through settings provided by Apple',
            'Users may request access to, correction of, deletion of, or restriction of information held by us',
          ),
          paragraph(
            'We may request the minimum information needed, such as a reference number, to locate a record and reasonably verify the request. We may be unable to fulfill a request when retention is required by law, prevention of abuse, or the establishment, exercise, or defense of legal rights.',
          ),
          paragraph(
            'For information independently controlled by Apple, RevenueCat, Google, GitHub, or another provider, we may direct the user to that provider.',
          ),
        ],
      },
      {
        id: 'security',
        title: '10. Security and development handoff',
        blocks: [
          paragraph(
            'We use reasonable safeguards appropriate to the nature and risk of the information, including access controls, protection in transit and at rest, limited privileges, auditing, and data minimization. No internet transmission or storage system can be guaranteed to be absolutely secure.',
          ),
          paragraph(
            'When a report needs development or additional investigation, an operator may create an Issue in an application-configured Private GitHub repository. The handoff may include the reference number, category, problem description, platform, operating-system version, application version, billing state, and a link to the private helpdesk record.',
          ),
          paragraph(
            'Other than the platform, operating-system version, application version, and billing state expressly listed above, we do not transfer the Support ID or any other field from the optional diagnostic payload to GitHub. We do not place raw Apple diagnostics, secrets, or personal or device identifiers in public GitHub Issues or public notices.',
          ),
        ],
      },
      {
        id: 'changes',
        title: '11. Changes to this Policy',
        blocks: [
          paragraph(
            'We may update this Policy when features, data flows, providers, laws, or operations change. For a material change, we will provide notice on the official website or in Owlaria and request consent again where required.',
          ),
        ],
      },
      {
        id: 'contact',
        title: '12. Privacy contact and operator information',
        blocks: [
          paragraph(
            'Privacy contact: overpatch.ch@gmail.com. The problem-report form is a one-way intake channel and is not the contact for privacy requests.',
          ),
          paragraph(
            'The legal name, address, and telephone number of the operator responsible for providing Owlaria will be provided without delay upon a valid request sent to this contact, where this method of disclosure is permitted by applicable law. Additional trader information may also appear on an App Store product page where required by law.',
          ),
        ],
      },
    ],
  },
  ja: {
    metadata: {
      title: 'プライバシーポリシー · Owlaria',
      description:
        'Owlaria、購入、診断情報、一方向の問題報告におけるoverpatchの情報取扱いを説明します。',
    },
    eyebrow: '法的情報 / プライバシー',
    title: 'Owlaria プライバシーポリシー',
    effectiveLabel: '施行日',
    effectiveDate: '2026年8月15日',
    updatedLabel: '最終更新日',
    updatedDate: '2026年8月15日',
    contentsLabel: 'プライバシーポリシーの目次',
    sections: [
      {
        id: 'scope',
        title: '1. 適用範囲',
        blocks: [
          paragraph(
            '本プライバシーポリシーは、Owlariaを提供する共同運営団体overpatch（以下「当方」）が、OwlariaアプリおよびOwlaria公式Webサイトで取り扱う情報について説明します。',
          ),
          paragraph(
            'Apple、RevenueCat、Google、GitHubその他の第三者が独自に取得・管理する情報には、各事業者のプライバシーポリシーも適用されます。',
          ),
        ],
      },
      {
        id: 'basic-handling',
        title: '2. Owlariaの基本的なデータ取扱い',
        blocks: [
          paragraph(
            'Owlariaは、ユーザーが指定したローカルフォルダやSMB等のデータソースにある書籍を管理・閲覧するアプリです。書籍やライブラリの内容、ファイルパス、閲覧情報、データソースの認証情報は、原則としてユーザーの端末または指定したデータソースとの間で処理され、当方のサーバーへアップロードされません。',
          ),
          paragraph(
            '問題報告の自由記述欄へユーザーが任意に入力した情報は、当方が受領・保存します。個人情報、ファイルパス、書籍やライブラリの名称・内容、raw log、receipt、transaction ID、認証情報を入力しないでください。',
          ),
        ],
      },
      {
        id: 'information',
        title: '3. 取り扱う情報',
        blocks: [
          subsection(
            '3.1 購入およびOwlaria Plus',
            paragraph(
              'Owlaria Plusの購入、購入の復元、返金・取消の反映にはApple App StoreとRevenueCatを利用します。',
            ),
            list(
              'RevenueCatが生成するアプリ固有のanonymous App User ID',
              '商品、購入状態、entitlement、Restore、返金・取消に関する情報',
              '購入管理に必要な端末・OS等の技術情報',
            ),
            paragraph(
              'Owlariaは独自のユーザーアカウントを作成せず、この識別子を氏名、メールアドレスまたはApple Accountへ紐づけません。iOS版とmacOS版は別商品であり、購入権利をOS間で共有しません。',
            ),
            paragraph(
              'OwlariaはRevenueCatから確認したFree、Plusまたは一時的に判定できないlicense状態を端末内へ保存する場合があります。receipt全文やtransaction IDを保存する独自の課金backendは運営しません。',
            ),
          ),
          subsection(
            '3.2 Apple標準のdiagnostic情報',
            paragraph(
              'Owlariaには独自のproduct analytics SDKや外部crash reporting SDKを組み込みません。ユーザーのApple側の設定やAppleの提供条件に応じて、crash、hang、performance、version、build、OS、signature、backtrace等のdiagnostic情報がAppleから提供される場合があります。',
            ),
            paragraph(
              'Apple diagnosticは障害調査と品質・安定性改善だけに利用します。raw diagnosticは分析に必要な間だけ処理し、恒久保存しません。個人や端末を識別し得る情報とraw logを除いたsanitized summaryだけを保存します。',
            ),
          ),
          subsection(
            '3.3 一方向の問題報告・フィードバック',
            paragraph(
              'Owlariaまたは公式Webサイトから問題報告やフィードバックを送信できます。これは品質改善のための一方向の受付であり、個別supportではありません。個別回答、調査結果の通知、修正、修正時期を約束しません。',
            ),
            paragraph('すべての送信で次の情報を受領します。'),
            list(
              'ユーザーが選択したcategoryと入力した問題の説明',
              '重複送信を防止するrequest ID',
              '受付番号、受付日時、application identifierおよび送信元',
              'フォームに表示したprivacy noticeのversion',
            ),
            paragraph(
              '返信希望、氏名、メールアドレス、件名、添付ファイルは求めません。',
            ),
            paragraph(
              'ユーザーが送信ごとに内容を確認し、diagnosticを含めることを選択した場合だけ、次の情報も受領します。',
            ),
            list(
              'Support ID（current anonymous RevenueCat App User ID）',
              'アプリのversion・build、platform、OS version、locale、配布経路、Store環境、発生日時',
              '構造化されたerror code、severityおよび許可されたerror context',
              '課金問題では操作、結果、license状態、設定済みStore ID等の技術情報',
            ),
            paragraph(
              'diagnosticを含めず、categoryと問題の説明だけでも送信できます。Support IDはApple Account、Owlariaアカウントまたは本人認証情報ではありません。',
            ),
          ),
          subsection(
            '3.4 APIおよびWebサイトの技術情報',
            paragraph(
              '問題報告API、Web hosting、CDNおよびsecurity基盤は、service提供、rate limit、不正利用・security対策、障害調査のため、IPアドレス、User-Agent、request日時・path、error等を一時的に処理・記録する場合があります。',
            ),
            paragraph(
              'IPアドレスを問題報告recordやSupport IDへ保存・関連付けず、広告、profiling、trackingまたはproduct analyticsに利用しません。',
            ),
          ),
        ],
      },
      {
        id: 'use',
        title: '4. 利用目的',
        blocks: [
          paragraph('情報を次の目的で利用します。'),
          list(
            'Owlaria Plusの状態判定と購入、Restore、返金・取消の反映',
            '問題報告の受付、重複防止、分類および調査',
            '不具合、crash、performanceおよび課金問題の原因調査',
            'Owlariaの品質、安定性、安全性および機能の改善',
            '不正利用・security incidentの防止、検知および対応',
            '法令上の義務と権利の確立、行使または防御への対応',
          ),
          paragraph(
            '第三者広告、情報の販売、marketing、profiling、cross-appまたはcross-site trackingには利用しません。',
          ),
        ],
      },
      {
        id: 'analytics',
        title: '5. Analytics、広告およびtracking',
        blocks: [
          paragraph(
            '初回公開では、Owlariaと公式Webサイトに独自のproduct analytics、Web analytics、広告SDK、広告cookieまたはcross-site trackingを導入しません。session、画面遷移、機能利用、読書・閲覧履歴、独自visitor IDを収集しません。',
          ),
          paragraph(
            '将来導入する場合は、実装前に本ポリシー、必要な同意およびStore表示を更新します。',
          ),
        ],
      },
      {
        id: 'providers',
        title: '6. 第三者サービス',
        blocks: [
          list(
            'Apple: App Storeでの購入、Restore、返金・取消およびApple diagnostic',
            'RevenueCat: Owlaria Plusの購入状態とentitlementの管理',
            'Google / Firebase: 問題報告の受付、保存、securityおよび管理',
            'GitHub: Private GitHub Issueへの開発handoffとGitHub Pagesによる公式Web hosting',
          ),
          paragraph(
            '本ポリシーに記載した目的に必要な範囲でserviceを利用します。法令に基づく場合、人の生命・財産・権利を保護するために必要な場合、または適切な保護を伴う事業承継等の場合を除き、情報を販売したり、目的と無関係な第三者へ提供したりしません。',
          ),
          links(...providerLinks.ja),
        ],
      },
      {
        id: 'international',
        title: '7. 国外での処理',
        blocks: [
          paragraph(
            'Owlariaは複数の国・地域で提供します。providerの所在地やsystem構成により、情報がユーザーの居住国以外で処理・保存される場合があります。当方は適用法令およびproviderとの契約に基づいて必要な措置を講じます。',
          ),
        ],
      },
      {
        id: 'retention',
        title: '8. 保存期間と削除',
        blocks: [
          paragraph(
            '問題報告、diagnostic、受付・管理情報には固定の保存期間や自動削除を設定しません。報告の確認・調査、品質改善、再発傾向の確認、不正利用防止、法的義務、権利の確立・行使・防御等のため合理的に必要な間、長期間保存する場合があります。',
          ),
          paragraph(
            '保有する合理的な必要がなくなった場合、または対象となるprivacy請求へ対応する場合は、Firebase recordと報告から作成したPrivate GitHub Issueを手動で削除するか、識別可能な関連を取り除きます。',
          ),
          paragraph(
            '問題報告本文は送信成功後にOwlaria端末内へ保持しません。Apple、RevenueCat、Google、GitHubその他のproviderが独自に保持する情報には、各providerの保存・削除方針が適用されます。',
          ),
        ],
      },
      {
        id: 'choices',
        title: '9. ユーザーの選択と請求',
        blocks: [
          list(
            '問題報告ごとにdiagnosticを確認し、含めるか選択できます',
            'diagnosticを含めずcategoryと問題の説明だけでも送信できます',
            'Apple diagnosticの共有はAppleが提供する設定から管理できます',
            '当方が保有する情報の確認、訂正、削除または利用停止を相談できます',
          ),
          paragraph(
            '受付番号等、recordを特定するために必要最小限の情報と合理的な確認を求める場合があります。法的な保存義務、不正防止、権利の確立・行使・防御等のため、請求どおりに対応できない場合があります。',
          ),
          paragraph(
            'Apple、RevenueCat、Google、GitHubその他のproviderが独自に管理する情報については、各providerの窓口をご案内する場合があります。',
          ),
        ],
      },
      {
        id: 'security',
        title: '10. 安全管理と開発handoff',
        blocks: [
          paragraph(
            '情報の性質とriskに応じ、access control、通信・保存時の保護、権限の制限、監査、data minimization等の合理的な安全管理措置を講じます。ただし、internet上の送信・保存について絶対的な安全性は保証できません。',
          ),
          paragraph(
            '開発や追加調査が必要な報告は、運営者の操作により、application設定済みのPrivate GitHub repositoryへIssue化する場合があります。受付番号、category、問題報告本文、platform、OS version、app version、課金状態およびprivate helpdesk recordへのlinkをhandoffする場合があります。',
          ),
          paragraph(
            '上記に明記したplatform、OS version、app versionおよび課金状態を除き、Support IDその他の任意のdiagnostic payload項目はGitHubへ転記しません。Apple raw diagnostic、secret、個人・端末識別情報を公開GitHub Issueや公開通知へ記載しません。',
          ),
        ],
      },
      {
        id: 'changes',
        title: '11. 本ポリシーの変更',
        blocks: [
          paragraph(
            '機能、data flow、provider、法令または運用の変更に応じて本ポリシーを更新する場合があります。重要な変更は公式WebサイトまたはOwlariaでお知らせし、必要な場合は改めて同意を求めます。',
          ),
        ],
      },
      {
        id: 'contact',
        title: '12. Privacy窓口と運営者情報',
        blocks: [
          paragraph(
            'Privacyに関する連絡先: overpatch.ch@gmail.com。問題報告フォームは一方向の受付であり、privacy請求の連絡先ではありません。',
          ),
          paragraph(
            'Owlariaを提供する運営者の氏名、住所および電話番号は、適用法令上この開示方法が認められる場合、この連絡先への有効な請求に応じて遅滞なく提供します。法令により必要な場合は、App Storeの商品ページにも追加のtrader情報が表示されることがあります。',
          ),
        ],
      },
    ],
  },
};

export const termsCopy: Record<Locale, LegalDocumentCopy> = {
  en: {
    metadata: {
      title: 'Terms of Use · Owlaria',
      description:
        'Terms governing use of Owlaria, including licensing, Read-Only behavior, backups, Owlaria Plus, and problem reports.',
    },
    eyebrow: 'Legal / Terms',
    title: 'Owlaria Terms of Use',
    effectiveLabel: 'Effective date',
    effectiveDate: 'August 15, 2026',
    updatedLabel: 'Last updated',
    updatedDate: 'August 15, 2026',
    contentsLabel: 'Terms contents',
    sections: [
      {
        id: 'application',
        title: '1. Application and acceptance',
        blocks: [
          paragraph(
            'These Terms of Use (“Terms”) govern use of the Owlaria application provided by overpatch, a jointly operated group (“overpatch”). By downloading, installing, or using Owlaria, you agree to these Terms.',
          ),
          paragraph(
            'Owlaria is distributed through the Apple App Store under an Apple Developer Program account personally held by one of the members who jointly operates overpatch. Apple’s Standard Licensed Application End User License Agreement (“Apple Standard EULA”) applies. These Terms supplement it with Owlaria-specific conditions and do not replace it. Applicable law and the Apple Standard EULA control in the event of a conflict.',
          ),
          paragraph('If you do not agree to these Terms, do not use Owlaria.'),
        ],
      },
      {
        id: 'license',
        title: '2. License and permitted use',
        blocks: [
          paragraph(
            'Your license is governed by the Apple Standard EULA and Apple’s Usage Rules. You may use Owlaria for lawful personal use or lawful internal use within an organization.',
          ),
          paragraph(
            'Rights in Owlaria and its website, design, logos, text, software, and other materials belong to overpatch, its members, or their respective rights holders. Open-source components are governed by their licenses. These Terms do not restrict rights granted by applicable law or an open-source license.',
          ),
        ],
      },
      {
        id: 'content',
        title: '3. User content and data sources',
        blocks: [
          paragraph(
            'Owlaria manages and displays books in local folders, SMB shares, and other data sources selected by the user. overpatch does not provide books or other content.',
          ),
          paragraph(
            'You are responsible for having the rights or permission needed to access and use content and data sources and for complying with applicable law. You must not use Owlaria for unlawful copying, infringement, or unlawful circumvention of access controls or DRM.',
          ),
          paragraph(
            'Ownership of your books, libraries, metadata, and other content remains with you or the applicable rights holder and is not transferred to Owlaria or overpatch.',
          ),
        ],
      },
      {
        id: 'read-only',
        title: '4. Read-Only principle',
        blocks: [
          paragraph(
            'Owlaria is designed not to write to original data sources selected by the user. Scanning, viewing, metadata editing, and removing an Owlaria entry are designed not to rename, move, delete, or modify original files or create sidecar files. overpatch maintains reasonable safety testing for this principle.',
          ),
          paragraph(
            'Owlaria may create, update, or delete local application data on the device, including library records, metadata, tags, series, reading state, history, settings, credentials, bookmarks, thumbnails, and caches. Removing an entry from Owlaria does not ordinarily delete the original file.',
          ),
        ],
      },
      {
        id: 'backups',
        title: '5. Backups and data protection',
        blocks: [
          paragraph(
            'Read-Only design does not guarantee that corruption, loss, modification, or unavailability can never occur. Software defects, operating systems, devices, storage, NAS, SMB, networks, permissions, credentials, third-party services, power or hardware failures, and user actions may affect originals or local application data.',
          ),
          paragraph(
            'Before using Owlaria or making an important change, create independent backups of original data sources and necessary local application data and verify that they can be restored. Do not use your only copy of important content without a backup.',
          ),
          paragraph(
            'overpatch does not provide a backup service and does not control the availability, integrity, or security of a user’s originals, NAS, SMB share, device, or third-party storage.',
          ),
        ],
      },
      {
        id: 'environment',
        title: '6. Environment and third-party services',
        blocks: [
          paragraph(
            'You are responsible for securely managing a supported operating system and device, network, SMB 2.0 / 3.0 or later server, permissions, credentials, storage capacity, and other required environment. SMB 1.0 is not supported.',
          ),
          paragraph(
            'Owlaria uses services including the Apple App Store, RevenueCat, and Apple diagnostics. Their availability, specifications, policies, regional restrictions, and changes are outside overpatch’s control, and their terms also apply.',
          ),
          links({ label: 'Owlaria Privacy Policy', href: '/privacy/' }),
        ],
      },
      {
        id: 'plus',
        title: '7. Free and Owlaria Plus',
        blocks: [
          paragraph(
            'The Free tier provides every Owlaria feature for up to one library and 100 books. Owlaria Plus is a separate, one-time in-app purchase for each operating system that removes these limits. It is not a subscription.',
          ),
          paragraph(
            'iOS and macOS purchases are separate. A purchase can be restored only on the same operating system using the same Apple Account. Rights cannot be shared, transferred, or restored between iOS and macOS.',
          ),
          paragraph(
            'Apple handles billing and the receipt, review, approval, and processing of refund requests. When a refund or revocation is reflected, access returns to Free. Existing libraries and books are not deleted or made unavailable, but no additional library or book can be added while above a Free-tier limit.',
          ),
          links({
            label: 'Owlaria Plus purchases, restores, and refunds',
            href: '/support/purchases/',
          }),
        ],
      },
      {
        id: 'updates',
        title: '8. Updates, changes, and availability',
        blocks: [
          paragraph(
            'overpatch may change, add, suspend, or discontinue features, specifications, supported environments, user interfaces, or Free / Plus offerings in response to security, law, Store requirements, platform or service changes, quality improvements, and operational or technical needs.',
          ),
          paragraph(
            'A one-time purchase does not promise every future feature, permanent support for every platform or service, perpetual updates or support, or permanent availability. Changes will not limit mandatory statutory rights, and material changes will be announced when reasonably possible.',
          ),
        ],
      },
      {
        id: 'prohibited',
        title: '9. Prohibited conduct',
        blocks: [
          list(
            'Violating applicable law, these Terms, the Apple Standard EULA, or third-party terms',
            'Infringing copyright, privacy, security, or another person’s rights',
            'Unauthorized access, malware distribution, vulnerability exploitation, or service interference',
            'Spam, automated bulk submissions, rate-limit evasion, or abuse of the problem-report API, website, Store, or a third-party service',
            'Unauthorized sale, redistribution, sublicensing, or improper provision of Owlaria',
            'Reverse engineering, decompilation, modification, or derivative works beyond what applicable law or an open-source license permits',
            'Use for nuclear, missile, chemical, biological weapon, or another purpose prohibited by export-control law',
          ),
        ],
      },
      {
        id: 'reports',
        title: '10. Problem reports and support',
        blocks: [
          paragraph(
            'The problem-report form in Owlaria and on the website is a one-way channel for quality improvement. overpatch does not promise an individual response, investigation-result notice, fix, schedule, workaround, or ongoing individual support.',
          ),
          paragraph(
            'Apple has no obligation to provide Owlaria-specific maintenance or support. Requests about access, correction, or deletion of information are handled through the privacy contact in the Privacy Policy.',
          ),
        ],
      },
      {
        id: 'warranty',
        title: '11. Warranty disclaimer',
        blocks: [
          paragraph(
            'To the maximum extent permitted by applicable law, Owlaria is provided “as is” and “as available.” overpatch does not warrant uninterrupted or error-free operation, freedom from security defects, compatibility with every environment, fitness for a particular purpose, or preservation of data integrity or availability.',
          ),
          paragraph(
            'This section does not exclude or limit a warranty, remedy, or mandatory consumer right that cannot be excluded or limited under applicable law.',
          ),
        ],
      },
      {
        id: 'liability',
        title: '12. Limitation of liability',
        blocks: [
          paragraph(
            'overpatch is not responsible for loss that is not attributable to overpatch or results from user content or actions, failure to maintain backups, unsupported environments, devices, storage, networks, credentials, third-party services, other software, hardware failure, or another cause outside its reasonable control.',
          ),
          paragraph(
            'To the extent permitted by law, liability for ordinary negligence is limited to actual, ordinary, and direct loss and excludes indirect, special, incidental, or consequential loss, lost profits, and business interruption.',
          ),
          paragraph(
            'These limitations do not apply to willful misconduct or gross negligence, death or personal injury, liability that cannot legally be limited, or mandatory consumer rights.',
          ),
        ],
      },
      {
        id: 'minors',
        title: '13. Minors',
        blocks: [
          paragraph(
            'Owlaria is a general-audience application and does not exclude minors. Where required by applicable law, a minor must obtain consent from a parent or legal guardian before using Owlaria.',
          ),
        ],
      },
      {
        id: 'changes',
        title: '14. Changes to these Terms',
        blocks: [
          paragraph(
            'overpatch may change these Terms when a change benefits users generally or is reasonable in light of its purpose, necessity, appropriateness, and other circumstances.',
          ),
          paragraph(
            'For a material change, we will provide notice of the change and effective date on the website or in Owlaria within a reasonable period. Continued use after the effective date constitutes acceptance to the extent permitted by law. If you do not agree, discontinue use.',
          ),
        ],
      },
      {
        id: 'law',
        title: '15. Governing law and disputes',
        blocks: [
          paragraph(
            'These Terms are principally governed by the laws of Japan, excluding conflict-of-law principles. This does not deprive a user of mandatory consumer protections available under the law of the user’s residence or another applicable law.',
          ),
          paragraph(
            'The parties will attempt in good faith to resolve disputes where reasonably possible. Unresolved disputes will be handled by a court having jurisdiction under applicable law; no particular court is designated as the exclusive forum.',
          ),
        ],
      },
      {
        id: 'contact',
        title: '16. Contact and operator information',
        blocks: [
          paragraph(
            'Contact regarding these Terms: overpatch.ch@gmail.com. This contact does not guarantee individual product support or a response to a request for a fix.',
          ),
          paragraph(
            'The legal name, address, and telephone number of the operator responsible for providing Owlaria will be provided without delay upon a valid request sent to this contact, where this method of disclosure is permitted by applicable law. Additional trader information may appear on an App Store product page where required by law.',
          ),
        ],
      },
    ],
  },
  ja: {
    metadata: {
      title: '利用規約 · Owlaria',
      description:
        'ライセンス、Read-Only、backup、Owlaria Plus、問題報告を含むOwlariaの利用条件です。',
    },
    eyebrow: '法的情報 / 利用規約',
    title: 'Owlaria 利用規約',
    effectiveLabel: '施行日',
    effectiveDate: '2026年8月15日',
    updatedLabel: '最終更新日',
    updatedDate: '2026年8月15日',
    contentsLabel: '利用規約の目次',
    sections: [
      {
        id: 'application',
        title: '1. 適用と同意',
        blocks: [
          paragraph(
            '本利用規約（以下「本規約」）は、共同運営団体overpatch（以下「overpatch」）が提供するOwlariaアプリの利用条件を定めます。Owlariaをdownload、installまたは利用することで、本規約に同意したものと扱います。',
          ),
          paragraph(
            'Owlariaは、overpatchを共同運営する構成員の一人が個人として保有するApple Developer Program accountを通じてApple App Storeで配信されます。Apple Standard Licensed Application End User License Agreement（Apple Standard EULA）が適用され、本規約はOwlaria固有条件を補足し、置き換えません。矛盾する場合は適用法令とApple Standard EULAが優先します。',
          ),
          paragraph('同意できない場合はOwlariaを利用しないでください。'),
        ],
      },
      {
        id: 'license',
        title: '2. Licenseと許可される利用',
        blocks: [
          paragraph(
            '利用licenseにはApple Standard EULAとApple Usage Rulesが適用されます。適法な個人利用または組織内利用のためにOwlariaを利用できます。',
          ),
          paragraph(
            'Owlaria、公式Webサイト、design、logo、文章、softwareその他の権利は、overpatch、その構成員または各権利者に帰属します。open-source componentには各licenseが適用され、本規約は法令またはopen-source licenseで認められた権利を制限しません。',
          ),
        ],
      },
      {
        id: 'content',
        title: '3. ユーザーcontentとdata source',
        blocks: [
          paragraph(
            'Owlariaは、ユーザーが指定したlocal folder、SMB shareその他のdata sourceにある書籍を管理・閲覧するsoftwareです。overpatchは書籍その他のcontentを提供しません。',
          ),
          paragraph(
            'ユーザーはcontentとdata sourceを利用するために必要な権利・許可を有し、適用法令を守る責任を負います。違法な複製、権利侵害またはaccess control・DRMの違法な回避に利用してはなりません。',
          ),
          paragraph(
            '書籍、library、metadataその他のcontentの所有権はユーザーまたは各権利者に残り、Owlariaやoverpatchへ移転しません。',
          ),
        ],
      },
      {
        id: 'read-only',
        title: '4. Read-Only原則',
        blocks: [
          paragraph(
            'Owlariaは、ユーザーが指定した原本data sourceへ書き込まない設計を重要な原則とします。scan、閲覧、metadata編集、Owlaria上の登録解除は、原本fileのrename、移動、削除、変更またはsidecar file作成を行わないよう設計され、overpatchは合理的な安全性testを維持します。',
          ),
          paragraph(
            'Owlariaはlibrary record、metadata、tag、series、閲覧状態、履歴、設定、credential、bookmark、thumbnail、cache等のlocal application dataを端末内で作成、更新または削除する場合があります。Owlaria上の登録解除は原則として原本fileを削除しません。',
          ),
        ],
      },
      {
        id: 'backups',
        title: '5. Backupとdata保全',
        blocks: [
          paragraph(
            'Read-Only設計は、破損、消失、変更または利用不能が一切発生しないことを保証しません。software defect、OS、端末、storage、NAS、SMB、network、permission、credential、第三者service、電源・hardware障害、user operation等が原本やlocal dataへ影響する可能性があります。',
          ),
          paragraph(
            'Owlariaを利用する前や重要な変更の前に、原本data sourceと必要なlocal application dataの独立したbackupを作成し、復元できることを確認してください。重要なcontentの唯一のcopyをbackupなしで利用しないでください。',
          ),
          paragraph(
            'overpatchはbackup serviceを提供せず、ユーザーの原本、NAS、SMB share、端末または第三者storageのavailability、integrity、securityを管理しません。',
          ),
        ],
      },
      {
        id: 'environment',
        title: '6. 利用環境と第三者service',
        blocks: [
          paragraph(
            'ユーザーは対応OS・端末、network、SMB 2.0 / 3.0以降のserver、permission、credential、storage容量等を用意し、安全に管理する責任を負います。SMB 1.0はsupport対象外です。',
          ),
          paragraph(
            'OwlariaはApple App Store、RevenueCat、Apple diagnostic等を利用します。availability、仕様、policy、地域制限および変更はoverpatchの管理外であり、各serviceのtermsも適用されます。',
          ),
          links({ label: 'Owlariaプライバシーポリシー', href: '/ja/privacy/' }),
        ],
      },
      {
        id: 'plus',
        title: '7. FreeとOwlaria Plus',
        blocks: [
          paragraph(
            '無料版ではすべての機能を1 library・100冊まで利用できます。Owlaria Plusは上限を解除するOS別のone-time in-app purchaseであり、subscriptionではありません。',
          ),
          paragraph(
            'iOS版とmacOS版は別商品・別購入です。Restoreは購入時と同じOS・Apple Accountで行い、OS間で権利を共有、移行またはRestoreできません。',
          ),
          paragraph(
            '購入、請求、返金の受付・審査・処理はAppleが行います。返金・取消が反映されるとFreeへ戻ります。既存のlibraryやbookは削除・閲覧不能になりませんが、Free上限を超えている間は追加できません。',
          ),
          links({
            label: 'Owlaria Plusの購入・復元・返金案内',
            href: '/ja/support/purchases/',
          }),
        ],
      },
      {
        id: 'updates',
        title: '8. Update、変更および提供継続',
        blocks: [
          paragraph(
            'overpatchはsecurity、法令、Store要件、platform・第三者serviceの変更、品質改善、運用・技術上の必要性に応じ、機能、仕様、対応環境、UIまたはFree / Plusの提供内容を変更、追加、停止または終了する場合があります。',
          ),
          paragraph(
            'one-time purchaseは将来の全機能、すべてのplatform・serviceへの永久対応、無期限のupdate・supportまたは永久提供を約束しません。強行的な法定権利は制限せず、可能かつ合理的な場合は重大な変更をお知らせします。',
          ),
        ],
      },
      {
        id: 'prohibited',
        title: '9. 禁止事項',
        blocks: [
          list(
            '法令、本規約、Apple Standard EULAまたは第三者termsへの違反',
            '著作権、privacy、securityその他の第三者の権利侵害',
            '不正access、malware配布、脆弱性の悪用またはservice妨害',
            '問題報告API、Webサイト、Store等へのspam、自動大量送信、rate limit回避または濫用',
            'Owlariaの無断販売、再配布、sublicenseまたは不正提供',
            '法令やopen-source licenseの範囲を超えるreverse engineering、decompile、改変または派生物作成',
            '核兵器、missile、化学・生物兵器その他、輸出管理法令で禁止される用途への利用',
          ),
        ],
      },
      {
        id: 'reports',
        title: '10. 問題報告とsupport',
        blocks: [
          paragraph(
            'Owlariaと公式Webサイトの問題報告フォームは品質改善のための一方向の受付です。overpatchは個別回答、調査結果通知、修正、時期、回避策または継続的な個別supportを約束しません。',
          ),
          paragraph(
            'AppleはOwlaria固有のmaintenanceまたはsupportを提供する義務を負いません。情報の確認・訂正・削除等はPrivacy Policyのprivacy窓口で受け付けます。',
          ),
        ],
      },
      {
        id: 'warranty',
        title: '11. Warrantyの制限',
        blocks: [
          paragraph(
            '適用法令で認められる最大限の範囲で、Owlariaは現状有姿かつ提供可能な範囲で提供されます。中断・error・security defectがないこと、すべての環境で動作すること、特定目的への適合またはdataの完全性・availabilityを保証しません。',
          ),
          paragraph(
            '適用法令上排除・制限できないwarranty、救済または消費者の強行的な法定権利は制限しません。',
          ),
        ],
      },
      {
        id: 'liability',
        title: '12. 責任の範囲',
        blocks: [
          paragraph(
            'overpatchの責めに帰さない損害、またはuser content・操作、backup不備、対応外環境、端末、storage、network、credential、第三者service、他software、hardware故障その他合理的な管理外の原因による損害について責任を負いません。',
          ),
          paragraph(
            '適用法令で認められる範囲で、軽過失による責任は現実に発生した通常かつ直接の損害に限定され、間接、特別、結果損害、逸失利益および事業中断を除きます。',
          ),
          paragraph(
            '故意・重過失、生命・身体への損害、法令上制限できない責任または消費者の強行的な法定権利には適用しません。',
          ),
        ],
      },
      {
        id: 'minors',
        title: '13. 未成年者',
        blocks: [
          paragraph(
            'Owlariaは全年齢の一般ユーザーを対象とし、未成年者を利用対象から除外しません。未成年者は、適用法令上必要な場合、親権者その他の法定代理人の同意を得て利用してください。',
          ),
        ],
      },
      {
        id: 'changes',
        title: '14. 本規約の変更',
        blocks: [
          paragraph(
            'overpatchは、変更がユーザーの一般的利益に適合する場合、または目的、必要性、相当性等に照らして合理的な場合に本規約を変更できます。',
          ),
          paragraph(
            '重要な変更は公式WebサイトまたはOwlariaで変更内容と効力発生日を合理的な期間を設けてお知らせします。効力発生日後の継続利用は、法令で認められる範囲で変更後の規約への同意と扱います。同意できない場合は利用を中止してください。',
          ),
        ],
      },
      {
        id: 'law',
        title: '15. 準拠法と紛争',
        blocks: [
          paragraph(
            '本規約は法の抵触に関する原則を除き、日本法を基本として解釈します。ただし、ユーザーの居住地その他の適用法令により認められる強行的な消費者保護を奪いません。',
          ),
          paragraph(
            '当事者は可能な範囲で誠実な協議による解決を試み、解決しない場合は適用法令上管轄を有する裁判所で解決します。特定の裁判所を排他的管轄として指定しません。',
          ),
        ],
      },
      {
        id: 'contact',
        title: '16. 連絡先と運営者情報',
        blocks: [
          paragraph(
            '本規約に関する連絡先: overpatch.ch@gmail.com。この連絡先は個別の製品supportや修正依頼への回答を保証しません。',
          ),
          paragraph(
            'Owlariaを提供する運営者の氏名、住所および電話番号は、適用法令上この開示方法が認められる場合、この連絡先への有効な請求に応じて遅滞なく提供します。法令により必要な場合はApp Storeの商品ページにも追加のtrader情報が表示されることがあります。',
          ),
        ],
      },
    ],
  },
};
