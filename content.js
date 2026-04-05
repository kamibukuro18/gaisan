window.siteContent = {
  intro: "GAIさんのアイデア、作ったもの、メモを置いておくための記録場所。",

  featured: [
    {
      slug: "github-profile",
      meta: "Profile",
      title: "GitHub profile",
      summary: "公開しているものや、これから増やしていくリポジトリの入口です。",
      href: "https://github.com/kamibukuro18",
      cta: "Open profile",
      year: "Now",
      tags: ["GitHub", "Links"],
    },
    {
      slug: "site-repository",
      meta: "Source",
      title: "This site repository",
      summary: "このホームページ自体のソース。GitHub Pages 前提の静的サイトとして運用します。",
      href: "https://github.com/kamibukuro18/gaisan",
      cta: "View source",
      year: "2026",
      tags: ["Pages", "Static"],
    },
  ],

  projects: [
    {
      slug: "steam-image-exporter",
      meta: "Desktop App",
      title: "Steam Image Exporter",
      summary:
        "1枚のキーアートから Steam ストア向け画像セットをまとめて生成するデスクトップアプリ。ロゴ配置、フォーカスポイント調整、書き出し前チェックまで含めて扱える。",
      year: "2026.04",
      tags: ["Steam", "Desktop", "TypeScript", "Gumroad"],
      cta: "Read detail",
      details: [
        "1枚の画像から Steam 用アセットを一括生成",
        "ロゴのドラッグ&ドロップと背景除去に対応",
        "プレビュー上でフォーカスポイントを設定できる",
        "Gumroad でも配布中",
        "GitHub Releases ベースのアップデート確認あり",
      ],
      page: {
        eyebrow: "Project / 2026.04",
        intro:
          "Steam 向けのストア画像制作をまとめて処理するためのデスクトップアプリ。1枚のキーアートを元に、複数サイズの Steam 用アセットを一括で生成できるようにしている。",
        highlights: [
          "Steam ストア画像を 1 枚のキーアートからまとめて生成する",
          "ロゴ配置やフォーカスポイント調整をアプリ内で完結できる",
          "配布は GitHub Releases ベースで回している",
        ],
        sections: [
          {
            title: "概要",
            paragraphs: [
              "Steam Image Exporter は、Steam ストア向け画像セットを 1 枚のキーアートから生成するためのデスクトップアプリ。",
              "ソース画像を読み込み、必要ならロゴを加え、複数の Steam 向けサイズへ一括で書き出せるようにしている。",
            ],
          },
          {
            title: "主な機能",
            bullets: [
              "png / jpg / jpeg / webp の入力に対応",
              "ロゴ画像のドラッグ&ドロップに対応",
              "ロゴの背景除去",
              "ロゴ配置用のテンプレートプレビュー",
              "プレビュー画像上でフォーカスポイントを設定",
              "書き出し前の preflight checks",
              "GitHub Releases ベースの更新確認",
            ],
          },
          {
            title: "使い方",
            bullets: [
              "キーアートを読み込む",
              "必要ならロゴ画像を追加する",
              "プレビュー上でフォーカスポイントを決める",
              "書き出しモードを選ぶ",
              "Steam 出力対象を選ぶ",
              "Generate all Steam images で出力する",
            ],
          },
          {
            title: "出力モード",
            bullets: [
              "Fill (crop): 比率に合わせてトリミング",
              "Fit (black): 全体を保持して余白を黒で埋める",
              "Fit Extend (blur): 全体を保持して余白をぼかし背景で埋める",
            ],
          },
          {
            title: "出力対象",
            paragraphs: [
              "header capsule, small capsule, main capsule, vertical capsule, screenshot, page background, library capsule, library hero, library logo, event cover, event header など、Steam 用の複数ターゲットに対応している。",
              "ロゴ関連ターゲットではベース画像に加えて `_logo` 版も生成される。",
            ],
          },
          {
            title: "技術と配布",
            paragraphs: [
              "リポジトリ上では TypeScript と Rust を中心に構成されている。",
              "配布は GitHub Releases ベースで、更新があるとアプリ内で通知される。",
            ],
          },
          {
            title: "リンク",
            links: [
              {
                label: "Repository",
                href: "https://github.com/kamibukuro18/SteamImageExporter",
              },
              {
                label: "Gumroad",
                href: "https://kamibukuro.gumroad.com/l/steamimageexporter",
              },
            ],
            bullets: [
              "Latest release: v0.1.0",
            ],
          },
        ],
      },
    },
  ],

  ideas: [
    {
      slug: "travel-expense-rule-log-automation",
      meta: "App Idea",
      title: "旅費規程ログ自動化ツール",
      summary:
        "一人社長やフリーランス向けに、日当・交通費の管理と税務説明できる記録作成を自動化するプロダクト案。入力は最小限にして、裏側で日当判定、集計、証拠ログ生成、会計ソフト連携用 CSV 出力までつなぐ。",
      year: "2026.04",
      tags: ["MVP", "Tax", "Automation", "freee"],
      cta: "Read detail",
      details: [
        "入力は日付・場所・内容・時間だけに絞る",
        "日当を条件に応じて自動判定し、月次で自動集計する",
        "参加者メモや主催フラグ、位置情報で証拠性を強める",
        "freee / マネフォ向けにインポート可能な CSV を出力する",
      ],
      page: {
        eyebrow: "App Idea / 2026.04",
        intro:
          "旅費規程を使っている一人社長やフリーランス向けに、日当と交通費の運用を簡単にするだけでなく、税務説明まで見据えた記録を自動生成するツール。目的は入力を楽にすることではなく、税務的に通る状態を自然に作ることにある。",
        highlights: [
          "日当・交通費の管理と税務に強い記録作成を一気通貫で扱う",
          "入力よりも、裏側の自動判定と証拠ログ生成に価値を置く",
          "月末は CSV を出して freee やマネフォへ流し込むだけで終わる",
        ],
        sections: [
          {
            title: "目的",
            paragraphs: [
              "このプロダクトは、旅費規程運用を自動化する個人向けツールとして考えている。対象は一人社長やフリーランスで、すでに旅費規程を使う前提がある人。",
              "目指すのは、日当・交通費の管理と税務的に強い記録を、ほぼ勝手に作る状態を実現すること。",
            ],
          },
          {
            title: "コア価値",
            paragraphs: [
              "本質は手入力の手間削減ではない。税務的に通る状態を自動で作ることが価値になる。",
            ],
            bullets: [
              "記録漏れを防ぐ",
              "日当を自動計算する",
              "証拠ログを蓄積する",
              "会計ソフトへつながる形で出力する",
            ],
          },
          {
            title: "MVP 機能",
            paragraphs: [
              "入力項目は極限まで絞る。現場で 1 分以内に終わることを優先する。",
            ],
            bullets: [
              "日付",
              "場所",
              "内容: 交流会 / 主催 / 商談などから選択",
              "時間: ざっくり入力",
            ],
          },
          {
            title: "自動処理",
            paragraphs: [
              "入力後に実行される裏側の処理が、このツールの本体になる。",
            ],
            bullets: [
              "時間と内容に応じて日当を自動判定する",
              "交通費は簡易入力または定型登録から反映する",
              "月ごとの合計を自動集計する",
              "いつ・どこで・何をしたかを、税務説明できる形で保存する",
            ],
          },
          {
            title: "差別化ポイント",
            paragraphs: [
              "単なる入力ツールではなく、証拠生成ツールとして成立させるための要素を持たせる。",
            ],
            bullets: [
              "参加者メモを任意で残せる",
              "主催か参加かのフラグを持てる",
              "簡単なメモ欄を持つ",
              "可能なら位置情報も付ける",
            ],
          },
          {
            title: "出力",
            paragraphs: [
              "freee / マネーフォワード向けに、そのままインポート可能な CSV に変換して出力する。",
            ],
            bullets: [
              "日付",
              "金額",
              "勘定科目: 旅費交通費",
              "摘要: 交流会・主催など",
              "税区分",
            ],
          },
          {
            title: "運用イメージ",
            bullets: [
              "その場で 1 分入力",
              "月末に CSV 出力",
              "freee にインポート",
              "完了",
            ],
          },
          {
            title: "拡張余地",
            bullets: [
              "定期イベントテンプレート",
              "参加者管理",
              "売上や案件化との紐付け",
              "SNS ログ連携",
              "税理士共有機能",
            ],
          },
          {
            title: "ポジション",
            paragraphs: [
              "これは会計ツールではなく、お金を非課税で抜くための実務ツールという立ち位置が強い。",
              "実務から生まれた発想なので、価値の軸がぶれにくいタイプのアイデアでもある。",
            ],
          },
          {
            title: "自分との相性",
            bullets: [
              "主催頻度が高い",
              "外出が多い",
              "すでに旅費規程を使う前提がある",
            ],
            paragraphs: [
              "この 3 つが揃っているので、まず自分用として十分に価値が成立している。自分で使い、改善し、他人にも刺さる形へ持っていく流れが自然。",
            ],
          },
        ],
      },
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
      title: "Steam Image Exporter を Projects に追加",
      summary:
        "Steam ストア向け画像セットを一括生成するデスクトップアプリとして掲載。",
    },
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

  footer: "記録を足していくためのシンプルな静的ページ。",
};
