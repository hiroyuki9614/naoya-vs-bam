export type Fighter = {
  id: 'inoue' | 'bam';
  displayName: string;
  shortName: string;
  nickname: string;
  record: {
    fights: number;
    wins: number;
    losses: number;
    draws: number;
    kos: number;
  };
  stance: string;
  country: string;
  weightClass: string;
  imagePath: string;
  accent: string;
  timeline: Array<{ year: string; event: string }>;
  stats: Array<{ label: string; value: number }>;
};

export const fighters: Fighter[] = [
  {
    id: 'inoue',
    displayName: '井上尚弥',
    shortName: 'INOUE',
    nickname: 'The Monster',
    record: { fights: 33, wins: 33, losses: 0, draws: 0, kos: 27 },
    stance: 'Orthodox',
    country: 'Japan',
    weightClass: 'Super Bantamweight',
    imagePath: 'images/inoue-placeholder.png',
    accent: '#d92323',
    timeline: [
      { year: '2012', event: 'プロデビュー' },
      { year: '2014', event: 'WBC世界ライトフライ級王座獲得' },
      { year: '2014', event: 'WBO世界スーパーフライ級王座獲得' },
      { year: '2018', event: 'WBA世界バンタム級王座獲得' },
      { year: '2019', event: 'IBF世界バンタム級王座獲得' },
      { year: '2022', event: 'バンタム級4団体統一' },
      { year: '2023', event: 'WBC/WBO世界スーパーバンタム級王座獲得' },
      { year: '2023', event: 'スーパーバンタム級4団体統一' },
    ],
    stats: [
      { label: 'スピード', value: 5 },
      { label: 'パワー', value: 5 },
      { label: 'テクニック', value: 5 },
      { label: '陣営', value: 5 },
      { label: '理不尽', value: 5 },
    ],
  },
  {
    id: 'bam',
    displayName: 'Jesse “Bam” Rodriguez',
    shortName: 'BAM',
    nickname: 'Bam',
    record: { fights: 23, wins: 23, losses: 0, draws: 0, kos: 16 },
    stance: 'Southpaw',
    country: 'USA',
    weightClass: 'Super Flyweight',
    imagePath: 'images/bam-placeholder.png',
    accent: '#d7a632',
    timeline: [
      { year: '2017', event: 'プロデビュー' },
      { year: '2022', event: 'WBC世界スーパーフライ級王座獲得' },
      { year: '2023', event: 'WBO世界フライ級王座獲得' },
      { year: '2023', event: 'IBF世界フライ級王座獲得' },
      { year: '2024', event: 'WBC世界スーパーフライ級王座獲得' },
      { year: '2025', event: 'WBO世界スーパーフライ級王座獲得' },
      { year: '2025', event: 'WBA世界スーパーフライ級王座獲得' },
    ],
    stats: [
      { label: 'スピード', value: 5 },
      { label: 'パワー', value: 4 },
      { label: 'テクニック', value: 5 },
      { label: '陣営', value: 5 },
      { label: 'ロマチェンコ感', value: 5 },
    ],
  },
];
