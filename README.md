# naoya-vs-bam

井上尚弥 VS バム・ロドリゲス 非公式ファンLPです。

Vite + React + TypeScript で作成した、井上尚弥 vs Jesse “Bam” Rodriguez の仮想対戦を盛り上げる非公式ファン制作ランディングページです。

## 特徴

- 黒背景・白文字・赤/金アクセントの対戦ポスター風デザイン
- 炎、火花、リングライト風のCSSアニメーション
- スマホ対応レスポンシブレイアウト
- Framer Motion によるスクロール連動アニメーション
- 戦績カウントアップ
- タイムライン上を丸が移動する演出
- SVGの五角形レーダーチャートアニメーション
- `/ver2/` では映画予告風のタイポグラフィ・オープニング演出を追加
- 実写画像の代わりに `public/images/inoue-placeholder.png` と `public/images/bam-placeholder.png` を参照し、存在しない場合はCSSシルエットを表示

## 起動方法

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

`vite.config.ts` で `base: './'` を指定し、通常版 `index.html` と演出版 `ver2/index.html` をビルド対象にしているため、GitHub Pages のプロジェクトサイト配信でも相対パスでアセットを読み込めます。

## GitHub Pages で公開する方法

このリポジトリ名は `naoya-vs-bam` を想定しています。GitHub Actions で `dist` を GitHub Pages に公開するワークフローを追加しています。

1. GitHub のリポジトリ画面で **Settings > Pages** を開きます。
2. **Build and deployment** の **Source** を **GitHub Actions** に設定します。
3. `work` / `main` / `master` ブランチへ push するか、Actions タブから **Deploy to GitHub Pages** を手動実行します。
4. デプロイ完了後、Actions の `github-pages` 環境に表示される URL で公開ページを確認できます。演出版は公開URLの末尾に `/ver2/` を付けて確認できます。

## データの変更

- 選手情報・戦績・経歴・戦力比較: `src/data/fighters.ts`
- YouTube予想リンクカード: `src/data/predictions.ts`

## 注意

非公式ファンメイド仮想対戦LPです。正式発表・試合決定を意味するものではありません。選手、所属団体、プロモーター、配信会社とは関係ありません。公式ロゴ・団体ロゴ・配信会社ロゴは使用していません。画像・動画は権利確認済み素材のみ使用する想定です。
