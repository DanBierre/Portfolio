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
  nav: { work: 'Work', services: 'Services', about: 'About', menu: 'Menu' },
  bookCall: 'Get in touch',
  seeWork: 'See the work',
  seePrices: 'See prices',
  hero: {
    title: 'I’m Dan. I build websites with an editor’s eye.',
    lines: [
      [{ text: 'I’m Dan. I build' }],
      [{ text: 'websites', accent: true }, { text: ' with an' }],
      [{ text: 'editor’s', accent: true }, { text: ' eye.' }],
    ] as Line[],
    offer: 'Websites for Auckland businesses · Fixes from $150',
    pause: 'Pause animation',
    play: 'Play animation',
  },
  proof: { label: 'proof', end: 'for agencies', result: '[PLACEHOLDER] Cut a 3-week asset run to 2 days for a retail campaign.' },
  work: { title: 'Selected work', hint: 'hover a piece to see how it was made', next: 'Next case study:' },
  services: {
    title: 'Good light for Auckland businesses.',
    intro:
      'I build and fix websites so your business looks as good online as it does in person. Flat prices, agreed before I start. I’ll come to you anywhere in Auckland.',
    columns: [
      {
        name: 'Light Fix · $150',
        intro: 'One problem, fixed and tested. Flat price, per fix.',
        items: [
          'A menu that breaks on phones',
          'A contact form that never sends',
          'A page that takes ages to load',
        ],
      },
      {
        name: 'Light Page · $450',
        intro: 'A clean one-page website. Flat price, for the whole page.',
        items: [
          'Who you are, what you do, your hours and a map',
          'Written with you, and quick to load',
          'Looks right on a phone first',
        ],
      },
    ],
  },
  redesigns: {
    title: 'Same guy, new website.',
    intro: 'This is my own site, before and after I redesigned it. Drag the line to compare. If your website’s looking a bit tired, I can do the same for yours.',
    cta: 'Get in touch',
    caption: 'My old site on the left, this one on the right. Same person, a lot clearer about what I do.',
    beforeAlt: 'My old website: a plain, pale homepage that says I build with code and edit with intent',
    afterAlt: 'My current website: a film-style homepage that says I build websites for Auckland businesses',
  },
  process: {
    title: 'How it works',
    caption: 'Laid out like a film edit list. Old habits. The short version: three steps, no surprises.',
    steps: [
      { title: 'Tell me', text: 'Tell me what’s wrong, or what you need. A few lines is plenty. A screenshot helps.', reel: 'BRIEF', dur: 'A few lines', out: 'A clear brief' },
      { title: 'Fixed price', text: 'I’ll tell you the price and what’s included, in writing, before I start. The price won’t change.', reel: 'PRICE', dur: 'In writing', out: 'Flat price' },
      { title: 'Review', text: 'I do the work and you have a look. If something’s off, I’ll fix it.', reel: 'CUT', dur: 'Your sign-off', out: 'Finished work' },
    ],
  },
  clients: {
    title: 'Client websites',
    intro: 'Sites I build and fix for Auckland businesses will go here. I’m just getting started, so the first few spots are open.',
    slot: 'Open spot',
    slotText: 'Could be your café, salon, trade business or shop.',
    cta: 'Grab a spot',
  },
  about: {
    title: 'Auckland, NZ.',
    caption: 'Fushimi Inari, Kyoto',
    portraitAlt: 'Dan Bierre in a bucket hat at Fushimi Inari, Kyoto',
    rows: [
      { term: 'Background', text: 'I started out in film. A BA in 3D Composition and years of video editing gave me a good eye for craft and detail.' },
      {
        term: 'These days',
        text: 'I build and fix websites for Auckland businesses. I also make Shoji, a calm planner for Windows, under Soft Light Software. I’m easy to deal with, I keep things in plain words, and I’ll tell you if you don’t need what you were about to buy.',
      },
      { term: 'Japanese', text: 'Self-taught, sparked by anime, kept alive by living there. Aiming for JLPT N2, then living and working in Japan.' },
      { term: 'Outside work', text: 'Anime and manga, games, hiking, skiing and photography.' },
    ],
  },
  contact: {
    titleLines: ['Got a site that', 'needs some light?'],
    availability: 'Taking on new Auckland projects.',
    reply: 'Reply within 1 working day.',
    whiteLabel: 'I’ll come to you, anywhere in Auckland.',
    brief: 'Tell me about your site',
    briefFallback: 'Send it to the email below.',
    looking: 'Just looking',
  },
  form: {
    name: 'Name',
    email: 'Email',
    project: "What needs fixing, or what are you after?",
    timeline: 'Timeline',
    budget: 'Budget range',
    optional: '(optional)',
    choose: 'Choose…',
    timelineHint: 'e.g. Before the school holidays',
    website: 'Your website',
    websiteHint: 'e.g. mycafe.co.nz',
    trap: 'Leave this field empty',
    send: 'Send brief',
    sending: 'Sending…',
    thanks: 'Thanks, I’ll reply within 1 working day.',
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
    title: 'Dan Bierre | Websites for Auckland businesses',
    description:
      'I’m Dan, an Auckland web developer with a background in 3D and visual effects. I build and fix websites for local businesses, at flat prices.',
  },
};

type Dict = typeof en;

const ja: Dict = {
  langLabel: 'English',
  langSwitchName: '英語で読む',
  themeToLight: 'ライトテーマに切り替え',
  themeToDark: 'ダークテーマに切り替え',
  nav: { work: '制作', services: 'サービス', about: '自己紹介', menu: 'メニュー' },
  bookCall: 'お問い合わせ',
  seeWork: '作品を見る',
  seePrices: '料金を見る',
  hero: {
    title: 'ダンです。コードでつくり、意図をもって編集します。',
    lines: [
      [{ text: 'ダンです。' }],
      [{ text: 'コード', accent: true }, { text: 'でつくり、' }],
      [{ text: '意図', accent: true }, { text: 'をもって編集します。' }],
    ],
    offer: 'ウェブサイト · AIエージェントのワークフロー · 映像編集',
    pause: 'アニメーションを一時停止',
    play: 'アニメーションを再生',
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
  redesigns: {
    title: 'ビフォー・アフター',
    intro: '自分のサイトをリニューアルする前と後です。線をドラッグして比べてみてください。お店のサイトが古く感じたら、同じようにお手伝いします。',
    cta: 'お問い合わせ',
    caption: '左が以前のサイト、右が今のサイトです。',
    beforeAlt: '以前のサイト：「コードで作り、意図を持って編集する」と書かれた、淡くシンプルなホームページ',
    afterAlt: '今のサイト：オークランドのお店向けにサイトを作ると書かれた、フィルム風のホームページ',
  },
  process: {
    title: '進め方',
    caption: '映画の編集リスト風に並べています。要点は3ステップです。',
    steps: [
      { title: 'ヒアリング', text: 'ピッチやプロジェクトについて20分の通話。その後、作業範囲を文書でお送りします。', reel: 'BRIEF', dur: '20分の通話', out: '作業範囲書' },
      { title: '1週間でプロトタイプ', text: 'クライアントに見せられる動くプロトタイプ。予算をすべて使う前にアイデアを検証できます。', reel: 'PROTO', dur: '1週間', out: '動くプロトタイプ' },
      { title: '本制作', text: '御社の進め方に合わせて本番を制作。御社名義での対応も可能です。', reel: 'BUILD', dur: 'ご希望の期間で', out: '本番環境' },
      { title: '引き継ぎ', text: 'ドキュメント付きのコードと説明で、チームが自分たちで運用できる状態にします。', reel: 'HANDOFF', dur: '説明会', out: 'ドキュメントとコード' },
    ],
  },
  clients: {
    title: 'お客様のサイト',
    intro: 'オークランドのお店のために作ったサイトをここで紹介します。始めたばかりなので、最初の枠はまだ空いています。',
    slot: '空き枠',
    slotText: 'カフェ、サロン、職人さん、お店など。',
    cta: 'お問い合わせ',
  },
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
      { term: '日本語', text: 'アニメがきっかけの独学で、日本での生活の中で身につけました。JLPT N2を目指し、その先は日本で暮らし、働くことが目標です。' },
      { term: '仕事以外', text: 'アニメと漫画、ゲーム、ハイキング、スキー、写真。' },
    ],
  },
  contact: {
    titleLines: ['AIを提案したなら、', '形にするのは私です。'],
    availability: '第1四半期、新規のエージェンシー案件を1件受付中。',
    reply: '1営業日以内に返信します。',
    whiteLabel: 'ホワイトラベルでの対応、NDAの締結も可能です。',
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
    website: 'ウェブサイト',
    websiteHint: '例：mycafe.co.nz',
    trap: 'この欄は空のままにしてください',
    send: '送信する',
    sending: '送信中…',
    thanks: 'ありがとうございます。1営業日以内に返信します。',
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
  redesigns: 'リニューアル',
  process: '工程',
  clients: 'お客様',
  about: '自己紹介',
  contact: '連絡先',
} as const;

export const langOf = (locale: string | undefined): Lang => (locale === 'ja' ? 'ja' : 'en');
/** Homepage path for a language: '/' or '/ja'. */
export const homeOf = (lang: Lang) => (lang === 'ja' ? '/ja' : '/');
