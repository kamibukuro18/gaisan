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

公開更新時は、公開済みの変更内容を `timeline` にも同時に追記します。公開前の作業は完了扱いで記録せず、公開確認後に更新ログへ追加します。

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

## 3Dモデルカタログの保守

- `models.html` / `models.css` / `models.js`: 1ページの全件一覧、検索、カテゴリ絞り込み。
- `assets/models/index.json`: M300-001〜M300-103の103件のみ。名称・タグ・用途の要約・注意は、保存済みモデルの実READMEを確認して手編集します。未完成の104以降や、同じモデルの別姿勢を追加件数に含めません。
- `assets/models/previews/`: 各モデル1枚、計103枚のWebPプレビュー。モデル原本、非公開の検証ログ・制作資料、認証情報は公開しません。カタログ掲載はダウンロード提供や公開ライセンスの設定ではありません。

Python 3とPillowがある環境で、公開データと画像を検証します。

```bash
python scripts/build-model-catalog.py
```

既存hero画像からサムネイルを作り直す場合のみ、非公開の正規化済みソース一式をリポジトリの**外**へ置き、`--source /path/to/private-normalized-bundle` を指定します。スクリプトは元画像のハッシュと形式を確認し、既存heroを最大640pxのWebPへ再圧縮します。モデル生成・変更・再レンダーは行いません。ソース一式や元README／manifestをこの公開リポジトリへコミットしないでください。

```bash
node --test tests/models-search.test.cjs
node --check models.js
python -m http.server 8000
```

上の静的サーバーを起動したまま、PlaywrightとChromiumが利用できる別ターミナルで実画面テストを実行します。Chromiumの場所が異なる場合は`CHROMIUM_PATH`を指定します。

```bash
node tests/models-browser.cjs http://127.0.0.1:8000/
```

ブラウザテストの画像は既定で`/tmp/gaisan-model-catalog-qa`へ保存され、公開ファイルには含めません。更新ログは既存方針どおり、公開反映を確認してから追記します。
