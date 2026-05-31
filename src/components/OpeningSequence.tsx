import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type OpeningSequenceProps = {
  onComplete: () => void;
};

type OpeningScene = 'typing' | 'typingExit' | 'inoue' | 'bam' | 'collision' | 'crt' | 'blackout';

const introText = '2026年年末\n軽量級全歴史で最高を決める勝負が始まる！？';

const inoueWords = [
  'Monster',
  '怪物',
  'PFP No.1',
  '史上最強',
  '4階級制覇',
  'The Monster',
  '軽量級最強',
  '日本ボクシング史上最高傑作',
  'Undisputed',
  '完全支配',
  '破壊の精度',
  'No Mercy',
  '王座統一',
  '異次元の完成度',
  '拳の暴君',
  '歴史を塗り替える男',
  'Pound for Pound',
  '無敗の王',
  'KO Artist',
  'Ring General',
  '神速のカウンター',
  '圧倒的支配',
  '日本の至宝',
  '軽量級の頂点',
  '冷酷な完成形',
  '爆発力',
  'Precision Power',
  '王者の証明',
  'Inoue Era',
  '歴史的支配者',
];

const bamWords = [
  'Bam',
  'Jesse Rodriguez',
  'レジェンドキラー',
  '技術の極致',
  'Young King',
  'Precision',
  'Destroyer',
  '頂点を目指す男',
  'Future PFP',
  '天才サウスポー',
  'Angle Work',
  'Loma-like Angles',
  '次世代の王',
  'スピードの知性',
  'Generational Talent',
  'Sharp Mind',
  '青い閃光',
  'Southpaw Genius',
  'Legend Breaker',
  '階級を超える挑戦',
  'New Wave',
  '未来の支配者',
  'Silent Assassin',
  '技術で壊す男',
  'Speed & Angles',
  '世代交代',
  'Modern Maestro',
  '精密機械',
  'Bam Era',
  '頂点への侵攻',
];

type WordTone = 'red' | 'blue';

type WordCloudItem = {
  id: string;
  text: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  moveX: number;
  moveY: number;
  tone: WordTone;
  emphasis: boolean;
};

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function createWordCloudItems(words: string[], count: number, tone: WordTone, seed: number, totalDuration: number): WordCloudItem[] {
  return Array.from({ length: count }, (_, index) => {
    const progress = index / Math.max(count - 1, 1);
    const word = words[index % words.length];
    const spread = tone === 'red' ? -1 : 1;
    const x = seededRandom(seed + index * 4.11) * 118 - 9;
    const y = seededRandom(seed + index * 7.37) * 118 - 9;
    const rotate = seededRandom(seed + index * 5.19) * 46 - 23;
    const scale = 0.74 + seededRandom(seed + index * 9.73) * 1.95;
    const angle = seededRandom(seed + index * 2.71) * Math.PI * 2;
    const distance = 42 + seededRandom(seed + index * 8.43) * 168;

    return {
      id: `${tone}-${word}-${index}`,
      text: word,
      x,
      y,
      rotate,
      scale,
      delay: Math.pow(progress, 1.95) * totalDuration,
      duration: 0.68 + seededRandom(seed + index * 3.33) * 1.18,
      startX: Math.cos(angle) * distance * -1.1 + spread * -46,
      startY: Math.sin(angle) * distance * -0.82,
      moveX: Math.cos(angle + 0.8) * distance * 0.55 + spread * 38,
      moveY: Math.sin(angle + 0.8) * distance * 0.42,
      tone,
      emphasis: index % 9 === 0 || word.length > 12,
    };
  });
}

function useWordCount() {
  const getCount = useCallback(() => {
    if (typeof window === 'undefined') return 132;
    return window.matchMedia('(max-width: 680px)').matches ? 92 : 132;
  }, []);
  const [count, setCount] = useState(getCount);

  useEffect(() => {
    const updateCount = () => setCount(getCount());
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, [getCount]);

  return count;
}

function useAcceleratingTypewriter(text: string, active: boolean, onDone: () => void) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    setVisibleCount(0);
    let cancelled = false;
    let index = 0;
    let timer = window.setTimeout(function typeNext() {
      if (cancelled) return;
      index += 1;
      setVisibleCount(index);

      if (index >= text.length) {
        onDone();
        return;
      }

      const progress = index / text.length;
      const delay = Math.max(22, 155 - progress * 128);
      timer = window.setTimeout(typeNext, delay);
    }, 380);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [active, onDone, text]);

  return text.slice(0, visibleCount);
}

function TypewriterScene({ exiting, onDone }: { exiting: boolean; onDone: () => void }) {
  const [finished, setFinished] = useState(false);
  const handleDone = useCallback(() => {
    setFinished((alreadyFinished) => {
      if (!alreadyFinished) onDone();
      return true;
    });
  }, [onDone]);
  const typed = useAcceleratingTypewriter(introText, !exiting, handleDone);

  return (
    <motion.div
      className="openingScene openingTyping"
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: exiting ? 1.4 : 0.8, ease: 'easeInOut' }}
    >
      <div className="typingFrame">
        <p className="typingText" aria-label={introText}>
          {typed.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index === 0 && <br />}
            </React.Fragment>
          ))}
          <span className="typingCaret" aria-hidden="true">|</span>
        </p>
      </div>
    </motion.div>
  );
}

function KeywordCloud({ words, tone, dense = false }: { words: string[]; tone: 'red' | 'blue' | 'mixed'; dense?: boolean }) {
  const baseCount = useWordCount();
  const field = useMemo(() => {
    if (tone === 'mixed') {
      const mixedCount = Math.max(72, Math.round(baseCount * 0.72));
      return [
        ...createWordCloudItems(inoueWords, mixedCount, 'red', 62.17, 1.55),
        ...createWordCloudItems(bamWords, mixedCount, 'blue', 91.41, 1.55),
      ];
    }

    const count = dense ? baseCount : Math.round(baseCount * 0.72);
    return createWordCloudItems(words, count, tone, tone === 'red' ? 24.7 : 48.3, 3.25);
  }, [baseCount, dense, tone, words]);

  return (
    <div className={`titleWordCloud titleWordCloud-${tone}`} aria-hidden="true">
      {field.map((item) => (
        <motion.span
          className={`titleWord titleWord-${item.tone}${item.emphasis ? ' titleWord-emphasis' : ''}`}
          key={item.id}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `clamp(${0.86 * item.scale}rem, ${1.05 + item.scale * 1.45}vw, ${2.15 * item.scale}rem)`,
          }}
          initial={{ opacity: 0, x: item.startX, y: item.startY, rotate: item.rotate - 10, scale: 0.38 }}
          animate={{
            opacity: tone === 'mixed' ? [0, 0.78, 0.66] : [0, 0.96, 0.88],
            x: [item.startX, item.moveX * 0.45, item.moveX],
            y: [item.startY, item.moveY * 0.45, item.moveY],
            rotate: [item.rotate - 10, item.rotate, item.rotate + (item.tone === 'blue' ? -4 : 4)],
            scale: [0.38, item.scale * 1.06, item.scale],
          }}
          transition={{
            delay: item.delay,
            duration: tone === 'mixed' ? Math.min(item.duration, 0.82) : item.duration,
            ease: [0.16, 1, 0.3, 1],
            times: [0, 0.62, 1],
          }}
        >
          {item.text}
        </motion.span>
      ))}
    </div>
  );
}

function WordScene({ tone }: { tone: 'red' | 'blue' }) {
  const isRed = tone === 'red';

  return (
    <motion.div
      className={`openingScene wordScene wordScene-${tone}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65 }}
    >
      <div className="sceneLabel">{isRed ? 'NAOYA INOUE' : 'JESSE “BAM” RODRIGUEZ'}</div>
      <KeywordCloud words={isRed ? inoueWords : bamWords} tone={tone} dense />
    </motion.div>
  );
}

function CollisionScene() {
  return (
    <motion.div className="openingScene collisionScene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <KeywordCloud words={[...inoueWords, ...bamWords]} tone="mixed" />
      <motion.h2 className="witnessText" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35, duration: 0.9, ease: 'easeOut' }}>
        次に新たな称号を得るのは誰だ
      </motion.h2>
    </motion.div>
  );
}

function CrtTransition() {
  return (
    <motion.div className="openingScene crtScene" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
      <motion.div className="crtVanish" initial={{ scaleY: 1 }} animate={{ scaleY: 0.012 }} transition={{ duration: 0.58, ease: [0.7, 0, 0.84, 0] }} />
      <motion.div className="crtLine" initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }} transition={{ duration: 0.95, times: [0, 0.28, 0.78, 1], ease: 'easeInOut' }} />
    </motion.div>
  );
}

function BlackoutScene() {
  return (
    <motion.div
      className="openingScene blackoutScene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <motion.div
        className="blackoutBreath"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.18, 0.08] }}
        transition={{ duration: 1.25, ease: 'easeInOut' }}
        aria-hidden="true"
      />
    </motion.div>
  );
}

function ReducedMotionIntro({ onComplete }: OpeningSequenceProps) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 1800);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div className="openingOverlay reducedOpening" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 1.25, duration: 0.55 }}>
      <button className="skipOpening" type="button" onClick={onComplete}>Skip</button>
      <p>DREAM MATCH / DATE TBA</p>
      <h1>井上尚弥 VS バム・ロドリゲス</h1>
      <span>非公式ファンメイド仮想対戦LPです。</span>
    </motion.div>
  );
}

export function OpeningSequence({ onComplete }: OpeningSequenceProps) {
  const prefersReducedMotion = useReducedMotion();
  const [scene, setScene] = useState<OpeningScene>('typing');
  const [typingDone, setTypingDone] = useState(false);
  const handleTypingDone = useCallback(() => setTypingDone(true), []);

  useEffect(() => {
    if (!typingDone || scene !== 'typing') return undefined;

    const holdTimer = window.setTimeout(() => setScene('typingExit'), 5000);
    const nextTimer = window.setTimeout(() => setScene('inoue'), 6400);

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(nextTimer);
    };
  }, [scene, typingDone]);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    if (scene === 'typing') return undefined;

    const nextScene: Partial<Record<OpeningScene, OpeningScene | 'complete'>> = {
      typingExit: 'inoue',
      inoue: 'bam',
      bam: 'collision',
      collision: 'crt',
      crt: 'blackout',
      blackout: 'complete',
    };
    const durations: Partial<Record<OpeningScene, number>> = {
      typingExit: 1400,
      inoue: 5600,
      bam: 5600,
      collision: 5000,
      crt: 1150,
      blackout: 1500,
    };
    const target = nextScene[scene];
    if (!target) return undefined;

    const timer = window.setTimeout(() => {
      if (target === 'complete') onComplete();
      else setScene(target);
    }, durations[scene]);

    return () => window.clearTimeout(timer);
  }, [onComplete, prefersReducedMotion, scene]);

  if (prefersReducedMotion) {
    return <ReducedMotionIntro onComplete={onComplete} />;
  }

  return (
    <div className="openingOverlay" role="dialog" aria-label="LP opening sequence" aria-modal="true">
      <div className="filmGrain" aria-hidden="true" />
      <button className="skipOpening" type="button" onClick={onComplete}>Skip</button>
      <AnimatePresence mode="wait">
        {(scene === 'typing' || scene === 'typingExit') && (
          <TypewriterScene key="typing" exiting={scene === 'typingExit'} onDone={handleTypingDone} />
        )}
        {scene === 'inoue' && <WordScene key="inoue" tone="red" />}
        {scene === 'bam' && <WordScene key="bam" tone="blue" />}
        {scene === 'collision' && <CollisionScene key="collision" />}
        {scene === 'crt' && <CrtTransition key="crt" />}
        {scene === 'blackout' && <BlackoutScene key="blackout" />}
      </AnimatePresence>
    </div>
  );
}
