# gaisan

GitHub Pages でそのまま公開できる、個人ホームページ用の静的サイトです。

## 構成

- `index.html`: ページ本体
- `entry.html`: 各アイデアや項目の詳細ページ
- `styles.css`: レイアウトとデザイン
- `content.js`: 掲載する内容
- `script.js`: `content.js` の内容を描画
- `entry.js`: 詳細ページを描画

## GitHub Pages で公開

1. GitHub のリポジトリ設定で `Pages` を開く
2. `Build and deployment` の `Source` を `Deploy from a branch` にする
3. Branch を `main` / `/ (root)` に設定して保存
4. 数分待つと `https://kamibukuro18.github.io/gaisan/` で公開される

## 更新方法

基本は `content.js` を更新すれば十分です。

- `featured`: まず見せたいリンク
- `projects`: 作ったもの
- `ideas`: アイデア
- `notes`: 短いメモ
- `timeline`: 更新ログ

詳細ページを持たせたい項目には `slug` と `page` を追加します。`href` がない場合は `entry.html?type=...&slug=...` に自動でリンクされます。

各要素は次の形で追加できます。

```js
{
  slug: "sample-entry",
  meta: "Project",
  title: "repo name",
  summary: "短い説明",
  cta: "Read detail",
  year: "2026",
  tags: ["Web", "Demo"],
  page: {
    eyebrow: "Project / 2026",
    intro: "詳細ページの導入文",
    highlights: ["要点1", "要点2"],
    sections: [
      {
        title: "概要",
        paragraphs: ["ここに説明を書く"],
        bullets: ["箇条書きも追加できる"]
      }
    ]
  }
}
```

今後、アイデアやリンクを投げてもらえれば、この構成に合わせてこちらで整えて追加できます。
