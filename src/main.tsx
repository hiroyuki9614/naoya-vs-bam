import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { fighters, type Fighter } from './data/fighters';
import { predictions } from './data/predictions';
import { OpeningSequence } from './components/OpeningSequence';
import './styles.css';

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const totalFrames = Math.max(1, Math.round(duration / 16));
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress === 1) window.clearInterval(timer);
    }, 16);

    return () => window.clearInterval(timer);
  }, [active, duration, target]);

  return value;
}

function getPublicImageSrc(imagePath: string) {
  const isVer2 = typeof window !== 'undefined' && window.location.pathname.split('/').includes('ver2');
  const relativeBase = isVer2 && import.meta.env.BASE_URL === './' ? '../' : import.meta.env.BASE_URL;
  return `${relativeBase}${imagePath}`;
}
function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="sectionTitle">
      <span>{kicker}</span>
      <h2>{title}</h2>
    </div>
  );
}

function FighterVisual({ fighter, side }: { fighter: Fighter; side: 'left' | 'right' }) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = getPublicImageSrc(fighter.imagePath);

  return (
    <motion.div
      className={`fighterVisual ${side}`}
      initial={{ opacity: 0, x: side === 'left' ? -80 : 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: side === 'left' ? 0.2 : 0.35 }}
    >
      <div className="portraitFrame" style={{ '--fighter-accent': fighter.accent } as React.CSSProperties}>
        {!imageError ? (
          <img src={imageSrc} alt={`${fighter.displayName} placeholder`} onError={() => setImageError(true)} />
        ) : (
          <div className="fallbackPortrait" aria-label={`${fighter.displayName} silhouette`}>
            <div className="head" />
            <div className="shoulders" />
            <span>{fighter.shortName}</span>
          </div>
        )}
      </div>
      <p>{fighter.nickname}</p>
      <h3>{fighter.displayName}</h3>
    </motion.div>
  );
}

function Hero() {
  return (
    <header className="hero">
      <div className="flameLayer" />
      <div className="sparks" />
      <motion.p className="dateLine" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        DREAM MATCH / DATE TBA
      </motion.p>
      <motion.h1 initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }}>
        井上尚弥 <span>VS</span> バム・ロドリゲス
      </motion.h1>
      <motion.p className="tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        もし実現したら、軽量級の歴史が動く。
        <br />
        軽量級ボクシングの“完成形”は、怪物か、天才サウスポーか。
      </motion.p>
      <motion.div className="heroDisclaimer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <p>非公式ファンメイド仮想対戦LPです。</p>
        <p>正式発表・試合決定を意味するものではありません。</p>
        <p>選手、所属団体、プロモーター、配信会社とは関係ありません。</p>
      </motion.div>
      <div className="heroMatchup">
        <FighterVisual fighter={fighters[0]} side="left" />
        <motion.div className="vsBadge" initial={{ rotate: -15, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ delay: 0.7, type: 'spring' }}>
          VS
        </motion.div>
        <FighterVisual fighter={fighters[1]} side="right" />
      </div>
      <a className="scrollCue" href="#profile">Scroll to Fight Night</a>
    </header>
  );
}

function RecordLine({ label, value, active }: { label: string; value: number; active: boolean }) {
  const count = useCountUp(value, active);
  return (
    <div className="recordLine">
      <strong>{count}</strong>
      <span>{label}</span>
    </div>
  );
}

function ProfileCard({ fighter }: { fighter: Fighter }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.article
      ref={ref}
      className="profileCard"
      style={{ '--fighter-accent': fighter.accent } as React.CSSProperties}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
    >
      <span className="profileLabel">{fighter.shortName}</span>
      <h3>{fighter.displayName}</h3>
      <div className="recordGrid">
        <RecordLine label="戦" value={fighter.record.fights} active={inView} />
        <RecordLine label="勝" value={fighter.record.wins} active={inView} />
        <RecordLine label="敗" value={fighter.record.losses} active={inView} />
        <RecordLine label="分" value={fighter.record.draws} active={inView} />
        <RecordLine label="KO" value={fighter.record.kos} active={inView} />
      </div>
      <p className="bioLine">{fighter.stance} / {fighter.country} / {fighter.weightClass}</p>
    </motion.article>
  );
}

function Profiles() {
  return (
    <section id="profile" className="section profileSection">
      <SectionTitle kicker="Fighter Profile" title="選手Profile" />
      <div className="profileGrid">
        {fighters.map((fighter) => <ProfileCard key={fighter.id} fighter={fighter} />)}
      </div>
    </section>
  );
}

function FighterTimeline({ fighter }: { fighter: Fighter }) {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 35%'] });
  const markerY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <article className="timelineCard" ref={ref} style={{ '--fighter-accent': fighter.accent } as React.CSSProperties}>
      <h3>{fighter.displayName}</h3>
      <div className="timelineTrack">
        <motion.div className="timelineProgress" style={{ scaleY: scrollYProgress }} />
        <motion.div className="timelineMarker" style={{ top: markerY }} />
        {fighter.timeline.map((item, index) => (
          <motion.div
            className="timelineItem"
            key={`${fighter.id}-${item.year}-${index}`}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: index * 0.04 }}
          >
            <span>{item.year}</span>
            <p>{item.event}</p>
          </motion.div>
        ))}
      </div>
    </article>
  );
}

function Timeline() {
  return (
    <section className="section timelineSection">
      <SectionTitle kicker="Career Timeline" title="両者経歴 Timeline" />
      <div className="timelineGrid">
        {fighters.map((fighter) => <FighterTimeline key={fighter.id} fighter={fighter} />)}
      </div>
    </section>
  );
}

function RadarChart({ fighter }: { fighter: Fighter }) {
  const size = 280;
  const center = size / 2;
  const radius = 104;
  const max = 5;
  const points = useMemo(() => {
    return fighter.stats.map((stat, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / fighter.stats.length;
      const statRadius = radius * (stat.value / max);
      return `${center + Math.cos(angle) * statRadius},${center + Math.sin(angle) * statRadius}`;
    }).join(' ');
  }, [fighter.stats]);

  const rings = [1, 2, 3, 4, 5].map((level) => {
    const ringRadius = radius * (level / max);
    return fighter.stats.map((_, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / fighter.stats.length;
      return `${center + Math.cos(angle) * ringRadius},${center + Math.sin(angle) * ringRadius}`;
    }).join(' ');
  });

  return (
    <motion.article
      className="radarCard"
      style={{ '--fighter-accent': fighter.accent } as React.CSSProperties}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
    >
      <h3>{fighter.displayName}</h3>
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${fighter.displayName} radar chart`}>
        {rings.map((ring, index) => <polygon key={index} points={ring} className="radarRing" />)}
        {fighter.stats.map((stat, index) => {
          const angle = -Math.PI / 2 + (Math.PI * 2 * index) / fighter.stats.length;
          const x = center + Math.cos(angle) * (radius + 34);
          const y = center + Math.sin(angle) * (radius + 34);
          return <text key={stat.label} x={x} y={y} textAnchor="middle" dominantBaseline="middle">{stat.label}</text>;
        })}
        <motion.polygon
          points={points}
          className="radarShape"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ originX: '50%', originY: '50%' }}
        />
      </svg>
      <ul>
        {fighter.stats.map((stat) => <li key={stat.label}>{stat.label} <span>{'✩'.repeat(stat.value)}</span></li>)}
      </ul>
    </motion.article>
  );
}

function Comparison() {
  return (
    <section className="section comparisonSection">
      <SectionTitle kicker="Tale of the Tape" title="井上尚弥とジェシー・バム・ロドリゲス戦力" />
      <div className="radarGrid">
        {fighters.map((fighter) => <RadarChart key={fighter.id} fighter={fighter} />)}
      </div>
    </section>
  );
}

function Predictions() {
  return (
    <section className="section predictionSection">
      <SectionTitle kicker="Fight Picks" title="勝敗予想" />
      <div className="predictionGrid">
        {predictions.map((prediction, index) => (
          <motion.a
            className="predictionCard"
            href={prediction.url}
            target="_blank"
            rel="noreferrer"
            key={prediction.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: index * 0.08 }}
          >
            <span>YouTube 仮リンク</span>
            <h3>{prediction.title}</h3>
            <p className="channel">{prediction.channel}</p>
            <p><strong>予想:</strong> {prediction.pick}</p>
            <p>{prediction.reason}</p>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>非公式ファンメイド仮想対戦LPです。</p>
      <p>正式発表・試合決定を意味するものではありません。</p>
      <p>選手、所属団体、プロモーター、配信会社とは関係ありません。</p>
      <p>公式ロゴ・団体ロゴ・配信会社ロゴは使用していません。</p>
      <p>画像・動画は権利確認済み素材のみ使用する想定です。現在の選手画像はAIイラスト/シルエット/プレースホルダーで代替しています。</p>
    </footer>
  );
}

function App() {
  const isVer2 = typeof window !== 'undefined' && window.location.pathname.split('/').includes('ver2');
  const [openingComplete, setOpeningComplete] = useState(!isVer2);

  return (
    <>
      {isVer2 && !openingComplete && <OpeningSequence onComplete={() => setOpeningComplete(true)} />}
      <main className={isVer2 && !openingComplete ? 'lpBehindOpening' : undefined}>
      <Hero />
      <Profiles />
      <Timeline />
      <Comparison />
      <Predictions />
      <Footer />
      </main>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
