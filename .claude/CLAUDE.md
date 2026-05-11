# 今日のワーク — AI社員プロジェクト（高速版・5分目標）

このフォルダは セミナーで配布された「skillsとサブエージェント」体験キットの**高速版**です。
セミナーで学んだ「テーマを伝えるだけで、リサーチ→レポート→スライドが全自動」を、
**5分前後で体験できる**よう調整したバージョンです。

## 通常版との違い

| 項目 | 通常版 | 高速版（このフォルダ） |
|---|---|---|
| 目標完了時間 | 〜30分 | 〜5分 |
| モデル | `model: inherit`（親=メインのClaude Codeセッションを継承） | **`model: sonnet` を明示指定**（researcher / reporter / slide-maker すべて。Opus 継承による出力速度低下を回避） |
| researcher の観点・検索回数 | 観点3〜5個・WebSearch 最大15回・WebFetch 最大3回 | **観点3個固定・WebSearch 3回を1メッセージ内で並列起動・再検索なし・WebFetch 禁止** |
| reporter | 5,000〜8,000字 / 7〜9章 / Markdown 出力 | 同字数・章数 / **HTML 出力（output/report.html）**。詳細リサーチレポート（補足情報含む詳細資料）の位置付け。テンプレ事前コピー + Edit でプレースホルダ埋め |
| slide-maker | 基本10枚（8〜14枚レンジ）／ HTML・CSS・JSを毎回フル生成 | **基本10枚（8〜12枚レンジ）／ テンプレ不使用・テーマに最適化したカスタム HTML/CSS/JS をゼロから Write で生成**。トップティアコンサル+UI/UXデザイナー視点で、画面全体を使う高情報密度のスピーチ用スライド。**棒グラフ・縦棒グラフ・折れ線・円グラフ等の本格チャート、棒は「にょきっ」と伸びる・数値はカウントアップ・円グラフはスライス毎描画・折れ線は描画されていく動き・絵文字禁止** |
| Phase 3 構成 | researcher → reporter+slide-maker+agenda-planner の3並列 | researcher → **report テンプレ cp（reporter 用のみ）→ reporter+slide-maker 2並列**（アジェンダ生成は廃止、slide-maker はテンプレ不使用なので cp 不要） |
| HTMLテンプレ | reporter / slide-maker が毎回ゼロから生成（CSS約300行を含む） | reporter のみ `.claude/templates/report-template.html` を使用（CSS・骨格事前配置）／ slide-maker はテンプレ不使用、テーマごとにゼロから生成 |

## このプロジェクトの目的
- ユーザーがテーマを1つ与えると、AI社員（ai-employee スキル＋3つのサブエージェント）が動き出す
- リサーチ計画を一度だけ確認 → 承認 → あとは完全自律で完了
- 成果物は「読む用のレポート」と「見せる用のスライド」の2種に展開される

## 出力先のルール
- **すべての成果物は `output/` フォルダに保存する**
- 既存ファイルは上書きしてOK
- ファイル名:
  - リサーチノート: `output/research-notes.md`
  - 詳細レポート（HTML）: `output/report.html`
  - スピーチ用スライド（HTML）: `output/presentation.html`

## 命名規約
- 日本語タイトル可
- ファイル名は英数字＋ハイフンを基本とし、上記の固定パスを守る

## 自動実行のルール（Claude Code への指示）
- このプロジェクトでは **AskUserQuestion はリサーチ計画の承認時の1回のみ** 使ってよい
- それ以外で確認を求めない（途中の判断はAIが自律で行う）
- EnterPlanMode は使わない（このスキルは即実行が前提）
- ブラウザ自動オープンに失敗してもエラーで止めない（手動オープンを案内）

## 事前許可設定
このプロジェクトの `.claude/settings.json` は **「危険なコマンドだけ deny で禁止し、それ以外は全て自動承認」** のシンプル設計です（`defaultMode: "auto"`）。

- `permissions.allow`: `Bash(*)`、Read / Edit / Write / Glob / Grep / WebSearch / WebFetch を包括的に許可
- `permissions.deny`（`deny` は `allow` より優先）:
  - 再帰削除 `rm -rf` / `rm -fr` / `rm -Rf` / `rm -fR`（先頭・途中の両パターン）
  - 特権昇格 `sudo` / `su`
  - ディスクフォーマット・破壊 `mkfs` / `dd` / `fdisk` / `parted`
  - 電源操作 `shutdown` / `reboot` / `halt` / `poweroff`
  - 履歴書き換え系の git push（`--force` / `-f` / `+refspec`）
  - 機密ファイル読み取り（`.env` 系、`~/.ssh/**`、`~/.aws/**`）

cp / mkdir / open / xdg-open / explorer.exe / cmd.exe 等は `Bash(*)` で包括許可されているため、テンプレートのコピー・ブラウザ起動・ディレクトリ作成等は許可ダイアログなしで通ります。

## 使い方（参加者向け短縮版）

### Mac / Linux
```bash
cd ~/Desktop/今日のワーク
claude
```

### Windows (PowerShell)
```powershell
cd $HOME\Desktop\今日のワーク
claude
```

### WSL（Windows のデスクトップに置いた場合）
```bash
cd /mnt/c/Users/$USER/Desktop/今日のワーク
claude
```

起動後、Claude Code に：
- 「[自分のテーマ] でAI社員を動かして」
- または `/ai-employee [自分のテーマ]`

→ リサーチ計画を確認して「このまま進める」を選択 → 数分待つ → ブラウザでスライドが自動オープン

詳しい手順は `README.md` を参照してください。

## 関連ファイル
- メインスキル: `.claude/skills/ai-employee/SKILL.md`
- リサーチ担当: `.claude/agents/researcher.md`
- レポート担当: `.claude/agents/reporter.md`
- スライド担当: `.claude/agents/slide-maker.md`
- 事前許可設定: `.claude/settings.json`

## codex-review / workflow-impact-checker は実行しない（厳守）

このフォルダでは **codex-review スキル（および codex 関連のレビュースキル全般）と workflow-impact-checker スキルを絶対に実行しない**。

### 理由
- AI 社員ワークフロー（researcher → reporter / slide-maker）の途中・直後に codex-review が起動すると、レビューだけで数分〜数十分かかり、5分前後の目標完了時間が破綻する
- workflow-impact-checker も同様に Explore サブエージェントを起動するため時間がかかり、本番デモを止める
- 5/3 のアップセルセミナーで観客の前で実行する用途のため、レビュー処理・整合性チェックは不要
- 観客が見ているのは「リサーチ→レポート→スライド」のワークフローであって、レビュー・整合性チェックプロセスではない

### 禁止事項
- ファイル変更後の codex-review 自動実行は禁止
- セッション停止前の codex-review 実行は禁止
- Skill ツール経由で `codex-review` / `codex:codex-review` を呼ばない
- **Skill ツール経由で `workflow-impact-checker` を呼ばない**
- グローバル CLAUDE.md の以下のルールは、このフォルダでは**適用除外**とする:
  - "Review gate (codex-review)"
  - "Post-implementation Checklist"
  - "Workflow Impact Check（ワークフロー影響チェック）"
- グローバル settings.json の `PostToolUse(Write)` および `Stop` hook は既に外してある（2026-05-02）

### 例外
ユーザーが明示的に以下のいずれかを指示した場合のみ実行する:
- 「codex-review を実行して」「レビューして」
- 「workflow-impact-checker を実行して」「影響チェックして」「整合性チェックして」

それ以外の自発的な実行は一切しない。
