# NEON IKEBUKURO RUN

Blender 制作の人型ランナーで、架空の池袋北口風商店街を駆け抜ける Godot 4 Web ゲームです。

## 操作

- 移動: `A / D` または `← / →`
- 会話迎撃: `SPACE` / `J` / 画面中央の会話ボタン
- リトライ: `SPACE` / `ENTER` または画面のリトライボタン

実在店舗名・実在人物はゲーム内に使用していません。街路の密度、白い三角パネル門、縦看板、混在する建物高さ、室外機、自販機、電線、斜め舗装などの特徴を、架空の景観として再構成しています。

`tools/build_assets.py` は Blender 4.3.2 portable で `runner.glb`、`recruiter.glb`、`street_module.glb`、`north_gate.glb` を生成するスクリプトです。
