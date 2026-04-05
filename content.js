window.siteContent = {
  hero: {
    eyebrow: "Personal Index",
    title: "アイデアと\n作ったものを\n一箇所に。",
    summary:
      "思いついたこと、公開したリポジトリ、ちょっとしたメモを、あとから見返しやすい形で残していくためのホームページです。",
    note:
      "ここには完成品だけでなく、途中の試作や雑な発想もそのまま置いていきます。更新は少しずつ増やしていく想定です。",
    links: [
      {
        label: "GitHub Profile",
        href: "https://github.com/kamibukuro18",
        style: "primary",
      },
      {
        label: "Site Repository",
        href: "https://github.com/kamibukuro18/gaisan",
        style: "secondary",
      },
    ],
  },

  stats: [
    { label: "Pinned links", key: "featured" },
    { label: "Projects", key: "projects" },
    { label: "Ideas", key: "ideas" },
  ],

  featured: [
    {
      meta: "Profile",
      title: "GitHub profile",
      summary: "公開しているものや、これから増やしていくリポジトリの入口です。",
      href: "https://github.com/kamibukuro18",
      cta: "Open profile",
      year: "Now",
      tags: ["GitHub", "Links"],
    },
    {
      meta: "Source",
      title: "This site repository",
      summary: "このホームページ自体のソース。GitHub Pages 前提の静的サイトとして運用します。",
      href: "https://github.com/kamibukuro18/gaisan",
      cta: "View source",
      year: "2026",
      tags: ["Pages", "Static"],
    },
  ],

  projects: [],

  ideas: [
    {
      meta: "App Idea",
      title: "旅費規程ログ自動化ツール",
      summary:
        "一人社長やフリーランス向けに、日当・交通費の管理と税務説明できる記録作成を自動化するプロダクト案。入力は最小限にして、裏側で日当判定、集計、証拠ログ生成、会計ソフト連携用 CSV 出力までつなぐ。",
      year: "2026.04",
      tags: ["MVP", "Tax", "Automation", "freee"],
      details: [
        "入力は日付・場所・内容・時間だけに絞る",
        "日当を条件に応じて自動判定し、月次で自動集計する",
        "参加者メモや主催フラグ、位置情報で証拠性を強める",
        "freee / マネフォ向けにインポート可能な CSV を出力する",
      ],
    },
  ],

  notes: [
    {
      meta: "Workflow",
      title: "更新方針",
      summary:
        "今後は、投げ込まれたアイデアやリンクをこちらで整理して追記していく前提の構成です。",
      href: "https://github.com/kamibukuro18/gaisan",
      cta: "See repository",
      year: "2026",
      tags: ["Notes", "Update"],
    },
  ],

  timeline: [
    {
      date: "2026.04",
      title: "旅費規程ログ自動化ツールのアイデアを追加",
      summary:
        "税務的に通る記録を自動生成する個人向けツール案として整理して掲載。",
    },
    {
      date: "2026.04",
      title: "ホームページの初期版を作成",
      summary: "GitHub Pages でそのまま公開できる静的サイトとして準備。",
    },
  ],

  emptyStates: {
    projects:
      "まだ項目はありません。これから追加される GitHub リポジトリや公開物がここに並びます。",
    ideas:
      "ここは思いついたことの置き場です。短いメモでも、リンク付きの企画でも追加できるようにしてあります。",
    notes:
      "短いメモや覚え書きが増えていく想定です。必要なら外部リンク付きでも整理できます。",
  },

  footer:
    "Simple, static, and easy to grow. GitHub Pages で公開しやすく、あとから中身だけ増やせる構成です。",
};
