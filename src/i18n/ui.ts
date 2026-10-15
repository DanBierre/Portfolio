// Every piece of interface copy, in English and Japanese. Japanese drafted by Claude; Dan to review.
export const languages = { en: 'English', ja: '日本語' } as const;
export type Lang = keyof typeof languages;

/** A headline line made of plain and accented (gold) segments. */
type Line = { text: string; accent?: boolean }[];

const en = {
  langLabel: '日本語',
  langSwitchName: 'Read this page in Japanese',
  themeToLight: 'Switch to light theme',
  themeToDark: 'Switch to dark theme',
  nav: { work: 'Work', services: 'Services', lab: 'Lab', about: 'About', menu: 'Menu' },
  bookCall: 'Book a call',
  seeWork: 'See the work',
  hero: {
    title: 'I’m Dan. I build with code and edit with intent.',
    lines: [
      [{ text: 'I’m Dan. I build ' }, { text: 'with', accent: true }],
      [{ text: 'code and edit ' }, { text: 'with', accent: true }, { text: ' intent.' }],
    ] as Line[],
    offer: 'Websites · AI agent workflows · Video editing',
    pause: 'Pause background video',
    play: 'Play background video',
  },
  proof: { label: 'proof', end: 'for agencies', result: '[PLACEHOLDER] Cut a 3-week asset run to 2 days for a retail campaign.' },
  work: { title: 'Selected work', hint: 'hover a piece to see how it was made', next: 'Next case study:' },
  services: {
    title: 'The AI half of your creative team.',
    intro:
      'Interactive AI experiences for your clients, and the generative pipelines that make your studio faster. Designed and built end to end.',
    columns: [
      {
        name: 'Experiences',
        intro: 'For your clients: AI they can see, touch and share.',
        items: [
          'Campaign sites with generative features built in',
          'AI-powered installations and live event experiences',
          "AI features inside your client's site or app",
        ],
      },
      {
        name: 'Pipelines',
        intro: 'For your studio: generative production that runs on brand.',
        items: [
          'Image and video generation workflows tuned to a brand',
          'Copy and asset variations at campaign scale',
          'Tooling and training so your team runs it without me',
        ],
      },
    ],
  },
  process: {
    title: 'How we work together',
    steps: [
      { title: 'Brief', text: 'A 20-minute call about your pitch or project, followed by a written scope.' },
      { title: 'Prototype in 1 week', text: 'A working prototype you can show your client, so the idea is proven before the full budget is spent.' },
      { title: 'Build', text: 'The production build, working inside your process and under your agency’s name if you prefer.' },
      { title: 'Handover', text: 'Documented code and a walkthrough, so your team can own what we built.' },
    ],
  },
  lab: { title: 'From the Lab', all: 'See the Lab', interactive: 'interactive', study: 'study' },
  about: {
    title: 'Auckland, NZ, heading to Japan.',
    caption: 'Fushimi Inari, Kyoto',
    portraitAlt: 'Dan Bierre in a bucket hat at Fushimi Inari, Kyoto',
    rows: [
      { term: 'Background', text: 'I started out in film. A BA in 3D Composition and years of video editing gave me a good eye for craft and detail.' },
      {
        term: 'These days',
        text: 'I split my time between code and editing: building AI agent workflows for clients, and getting back into video work by relearning After Effects. Next stop, Japan.',
      },
      { term: 'Japanese', text: 'Self-taught, sparked by anime, kept alive by living there. Aiming for JLPT N2, then living and working in Japan.' },
      { term: 'Outside work', text: 'Anime and manga, games, hiking, skiing and photography.' },
    ],
  },
  contact: {
    titleLines: ['Your pitch promised AI.', 'I make it real.'],
    availability: 'Taking 1 new agency project for Q1.',
    reply: 'Reply within 1 working day.',
    whiteLabel: 'Happy to work white-label and sign your NDA.',
    talk: 'Ready to talk',
    talkNote: 'Twenty minutes, no prep needed.',
    brief: 'Have a brief',
    briefFallback: 'Send it to the email below.',
    looking: 'Just looking',
  },
  form: {
    name: 'Name',
    email: 'Email',
    project: "What's the project?",
    timeline: 'Timeline',
    budget: 'Budget range',
    optional: '(optional)',
    choose: 'Choose…',
    timelineHint: 'e.g. Pitch on 12 March',
    trap: 'Leave this field empty',
    send: 'Send brief',
    sending: 'Sending…',
    thanks: 'Thanks, I’ll reply within 1 working day. Or ',
    bookNow: 'book a call now',
    failed: 'Your brief didn’t send. Your text is still here, so try again or email it to ',
    errName: 'Please add your name.',
    errEmail: 'Please add a valid email address.',
    errProject: 'Tell me a little about the project.',
    stop: '.',
  },
  copy: { button: 'Copy email', done: 'Copied', failed: 'Copy failed. Use the link instead.' },
  budget: {
    'Under £5k': 'Under £5k',
    '£5k–£15k': '£5k–£15k',
    '£15k–£40k': '£15k–£40k',
    '£40k+': '£40k+',
    'Not sure yet': 'Not sure yet',
  } as Record<string, string>,
  meta: {
    title: 'Dan Bierre | Code, AI and editing for creative agencies',
    description:
      'I’m Dan. I build with code and edit with intent: interactive AI experiences and generative pipelines for creative agencies, from Auckland to Japan.',
  },
};

type Dict = typeof en;

const ja: Dict = {
  langLabel: 'English',
  langSwitchName: '英語で読む',
  themeToLight: 'ライトテーマに切り替え',
  themeToDark: 'ダークテーマに切り替え',
  nav: { work: '制作', services: 'サービス', lab: 'ラボ', about: '自己紹介', menu: 'メニュー' },
  bookCall: '通話を予約',
  seeWork: '作品を見る',
  hero: {
    title: 'ダンです。コードでつくり、意図をもって編集します。',
    lines: [
      [{ text: 'ダンです。' }, { text: 'コード', accent: true }, { text: 'で' }],
      [{ text: 'つくり、' }, { text: '意図', accent: true }, { text: 'をもって編集します。' }],
    ],
    offer: 'ウェブサイト · AIエージェントのワークフロー · 映像編集',
    pause: '背景の動画を一時停止',
    play: '背景の動画を再生',
  },
  proof: { label: '実績', end: 'エージェンシー向け', result: '[PLACEHOLDER] 小売キャンペーンの素材制作を3週間から2日に短縮。' },
  work: { title: '制作実績', hint: 'カーソルを合わせると制作の裏側が見えます', next: '次のケーススタディ：' },
  services: {
    title: 'あなたのクリエイティブチームの、AI担当。',
    intro:
      'クライアント向けのインタラクティブなAI体験と、スタジオの制作を速くする生成パイプライン。設計から実装まで一貫して担当します。',
    columns: [
      {
        name: '体験',
        intro: 'クライアントのために：見て、触れて、シェアできるAI。',
        items: ['生成機能を組み込んだキャンペーンサイト', 'AIを使ったインスタレーションやライブイベント', 'クライアントのサイトやアプリに組み込むAI機能'],
      },
      {
        name: 'パイプライン',
        intro: 'スタジオのために：ブランドに沿って動く生成制作。',
        items: ['ブランドに合わせた画像・動画生成ワークフロー', 'キャンペーン規模のコピーと素材のバリエーション', '私がいなくてもチームで回せるツールと研修'],
      },
    ],
  },
  process: {
    title: '進め方',
    steps: [
      { title: 'ヒアリング', text: 'ピッチやプロジェクトについて20分の通話。その後、作業範囲を文書でお送りします。' },
      { title: '1週間でプロトタイプ', text: 'クライアントに見せられる動くプロトタイプ。予算をすべて使う前にアイデアを検証できます。' },
      { title: '本制作', text: '御社の進め方に合わせて本番を制作。御社名義での対応も可能です。' },
      { title: '引き継ぎ', text: 'ドキュメント付きのコードと説明で、チームが自分たちで運用できる状態にします。' },
    ],
  },
  lab: { title: 'ラボから', all: 'ラボを見る', interactive: 'インタラクティブ', study: '習作' },
  about: {
    title: 'ニュージーランド・オークランドから、日本へ。',
    caption: '伏見稲荷大社、京都',
    portraitAlt: '京都・伏見稲荷大社でバケットハットをかぶったダン・ビエール',
    rows: [
      { term: '経歴', text: '映画からスタートしました。3Dコンポジションの学士号と長年の映像編集で、細部とクラフトを見る目が身につきました。' },
      {
        term: '最近',
        text: 'コードと編集を半々に。クライアント向けにAIエージェントのワークフローを構築しながら、After Effectsを学び直して映像の仕事にも戻っています。次は日本へ。',
      },
      { term: '日本語', text: 'アニメがきっかけの独学で、日本で暮らして身につけました。JLPT N2を目指し、その先は日本で暮らし、働くことが目標です。' },
      { term: '仕事以外', text: 'アニメと漫画、ゲーム、ハイキング、スキー、写真。' },
    ],
  },
  contact: {
    titleLines: ['AIを提案したなら、', '形にするのは私です。'],
    availability: '第1四半期、新規のエージェンシー案件を1件受付中。',
    reply: '1営業日以内に返信します。',
    whiteLabel: 'ホワイトラベルでの対応、NDAの締結も可能です。',
    talk: '話してみる',
    talkNote: '20分、準備は不要です。',
    brief: '依頼内容がある',
    briefFallback: '下記のメールアドレスにお送りください。',
    looking: 'まずは見てみる',
  },
  form: {
    name: 'お名前',
    email: 'メールアドレス',
    project: 'どんなプロジェクトですか？',
    timeline: 'スケジュール',
    budget: '予算',
    optional: '（任意）',
    choose: '選択してください',
    timelineHint: '例：3月12日にピッチ',
    trap: 'この欄は空のままにしてください',
    send: '送信する',
    sending: '送信中…',
    thanks: 'ありがとうございます。1営業日以内に返信します。お急ぎの場合は、',
    bookNow: '通話を予約',
    failed: '送信できませんでした。入力内容は残っているので、もう一度お試しいただくか、こちらへメールでお送りください：',
    errName: 'お名前を入力してください。',
    errEmail: '有効なメールアドレスを入力してください。',
    errProject: 'プロジェクトについて少し教えてください。',
    stop: '。',
  },
  copy: { button: 'メールをコピー', done: 'コピーしました', failed: 'コピーできませんでした。リンクをお使いください。' },
  budget: {
    'Under £5k': '£5k未満',
    '£5k–£15k': '£5k〜£15k',
    '£15k–£40k': '£15k〜£40k',
    '£40k+': '£40k以上',
    'Not sure yet': '未定',
  },
  meta: {
    title: 'ダン・ビエール | クリエイティブエージェンシーのためのコード、AI、編集',
    description:
      'ダンです。コードでつくり、意図をもって編集します。クリエイティブエージェンシー向けのインタラクティブなAI体験と生成パイプラインを、オークランドから日本へ。',
  },
};

export const ui: Record<Lang, Dict> = { en, ja };

/** Section labels on the spine stay Japanese in both languages: they are part of the signature. */
export const spine = {
  hero: 'ダン',
  work: '制作',
  services: 'サービス',
  process: '工程',
  lab: 'ラボ',
  about: '自己紹介',
  contact: '連絡先',
} as const;

export const langOf = (locale: string | undefined): Lang => (locale === 'ja' ? 'ja' : 'en');
/** Homepage path for a language: '/' or '/ja'. */
export const homeOf = (lang: Lang) => (lang === 'ja' ? '/ja' : '/');
