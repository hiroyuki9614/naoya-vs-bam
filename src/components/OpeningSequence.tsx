import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type OpeningSequenceProps = {
  onComplete: () => void;
};

type OpeningScene = 'typing' | 'typingExit' | 'inoue' | 'bam' | 'collision' | 'crt';

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

function makeWordField(words: string[], count: number, seed: number) {
  return Array.from({ length: count }, (_, index) => {
    const xSeed = Math.sin((index + 1) * (seed + 1.73)) * 10000;
    const ySeed = Math.sin((index + 1) * (seed + 2.91)) * 10000;
    const rSeed = Math.sin((index + 1) * (seed + 4.17)) * 10000;
    const sSeed = Math.sin((index + 1) * (seed + 5.39)) * 10000;
    const progress = index / Math.max(count - 1, 1);

    return {
      id: `${words[index % words.length]}-${index}`,
      text: words[index % words.length],
      left: `${Math.abs(xSeed % 100)}%`,
      top: `${Math.abs(ySeed % 100)}%`,
      rotate: (rSeed % 34) - 17,
      size: 0.82 + Math.abs(sSeed % 1.65),
      delay: Math.pow(progress, 1.85) * 3.1,
      distanceX: (Math.sin(index * 1.7 + seed) * 180).toFixed(1),
      distanceY: (Math.cos(index * 1.21 + seed) * 112).toFixed(1),
    };
  });
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
  const field = useMemo(() => {
    if (tone === 'mixed') {
      return [
        ...makeWordField(inoueWords, 92, 6.2).map((word) => ({ ...word, tone: 'red' as const, delay: word.delay * 0.2 })),
        ...makeWordField(bamWords, 92, 9.1).map((word) => ({ ...word, tone: 'blue' as const, delay: word.delay * 0.2 })),
      ];
    }

    return makeWordField(words, dense ? 132 : 76, tone === 'red' ? 2.4 : 4.8).map((word) => ({ ...word, tone }));
  }, [dense, tone, words]);

  return (
    <div className={`keywordCloud keywordCloud-${tone}`} aria-hidden="true">
      {field.map((word, index) => (
        <motion.span
          className={`keyword keyword-${word.tone}`}
          key={`${word.tone}-${word.id}`}
          style={{
            left: word.left,
            top: word.top,
            fontSize: `clamp(${0.92 * word.size}rem, ${1.2 + word.size * 1.5}vw, ${2.3 * word.size}rem)`,
            zIndex: index,
          }}
          initial={{ opacity: 0, scale: 0.78, x: Number(word.distanceX) * -0.28, y: Number(word.distanceY) * -0.28, rotate: word.rotate }}
          animate={{ opacity: tone === 'mixed' ? 0.72 : 0.88, scale: tone === 'mixed' ? 1.08 : 1.16, x: Number(word.distanceX), y: Number(word.distanceY), rotate: word.rotate * (tone === 'blue' ? -1 : 1) }}
          transition={{ duration: tone === 'mixed' ? 0.72 : 1.8, delay: word.delay, ease: [0.16, 1, 0.3, 1] }}
        >
          {word.text}
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
      crt: 'complete',
    };
    const durations: Partial<Record<OpeningScene, number>> = {
      typingExit: 1400,
      inoue: 5600,
      bam: 5600,
      collision: 5000,
      crt: 1150,
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
      </AnimatePresence>
    </div>
  );
}
