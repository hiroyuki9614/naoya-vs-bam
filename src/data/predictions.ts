export type Prediction = {
  title: string;
  channel: string;
  pick: string;
  reason: string;
  url: string;
};

export const predictions: Prediction[] = [
  {
    title: '仮想頂上決戦プレビュー：怪物の圧か、Bamの角度か',
    channel: 'Fight Talk Japan',
    pick: '井上尚弥 8R TKO',
    reason: '距離設定とボディへの圧力で後半にペースを奪う展開を予想。',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    title: 'P4P級テクニシャン対決を戦術目線で語る',
    channel: 'Boxing Lab',
    pick: '判定までもつれる接戦',
    reason: 'Bamのサウスポー角度と連打が序盤の鍵。中盤以降の修正力が勝負。',
    url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
  },
  {
    title: '軽量級ドリームマッチの勝敗予想スペシャル',
    channel: 'Ringside Notes',
    pick: 'Bamが序盤に見せ場',
    reason: '足と上体の動きで的を絞らせず、スリリングな攻防を作ると予想。',
    url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
  },
];
