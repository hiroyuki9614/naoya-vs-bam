# 井上尚弥 VS バム・ロドリゲス 非公式ファンLP

Vite + React + TypeScript で作成した、井上尚弥 vs Jesse “Bam” Rodriguez の仮想対戦を盛り上げる非公式ファン制作ランディングページです。

## 特徴

- 黒背景・白文字・赤/金アクセントの対戦ポスター風デザイン
- 炎、火花、リングライト風のCSSアニメーション
- スマホ対応レスポンシブレイアウト
- Framer Motion によるスクロール連動アニメーション
- 戦績カウントアップ
- タイムライン上を丸が移動する演出
- SVGの五角形レーダーチャートアニメーション
- 実写画像の代わりに `/public/images/inoue-placeholder.png` と `/public/images/bam-placeholder.png` を参照し、存在しない場合はCSSシルエットを表示

## 起動方法

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

`vite.config.ts` で `base: './'` を指定しているため、GitHub Pages のサブディレクトリ配信でも動作しやすい設定です。

## データの変更

- 選手情報・戦績・経歴・戦力比較: `src/data/fighters.ts`
- YouTube予想リンクカード: `src/data/predictions.ts`

## 注意

このページは非公式ファン制作ページです。選手、団体、プロモーター、配信会社とは関係ありません。公式ロゴ・団体ロゴ・配信会社ロゴは使用していません。画像・動画は権利確認済み素材のみ使用する想定です。
