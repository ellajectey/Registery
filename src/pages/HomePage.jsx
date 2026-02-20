import { useRef, useMemo } from 'react'
import config from '../data/config'
import useHeroCanvas from '../hooks/useHeroCanvas'
import useCountdown from '../hooks/useCountdown'
import Footer from '../components/Footer'

// Generate petals once (stable across renders)
const PETAL_COLORS = ['#C8B8E8', '#8DB89A', '#C9A84C', '#7B5EA7', '#3D6B4F']
const PETALS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left:  `${Math.random() * 100}%`,
  w:     `${6  + Math.random() * 8}px`,
  h:     `${9  + Math.random() * 10}px`,
  dur:   `${9  + Math.random() * 13}s`,
  delay: `${Math.random() * 10}s`,
  col:   PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
  br:    Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%',
}))

export default function HomePage({ navigate }) {
  const canvasRef = useRef(null)
  useHeroCanvas(canvasRef)
  const time = useCountdown(config.weddingDateTime)

  return (
    <div>
      {/* ── HERO ── */}
      <section className="w-hero">
        <img
          className="w-hero-img"
          src={config.heroImage}
          alt={`${config.names.partner1} and ${config.names.partner2}`}
        />
        <div className="w-hero-overlay" />
        <canvas ref={canvasRef} className="w-hero-canvas" />

        {PETALS.map(p => (
          <div
            key={p.id}
            className="w-petal"
            style={{
              left: p.left, width: p.w, height: p.h,
              background: p.col, borderRadius: p.br,
              animationDuration: p.dur, animationDelay: p.delay,
            }}
          />
        ))}

        <div className="w-hero-content">
          <p className="w-hero-prelude">Together with their families</p>
          <h1 className="w-hero-names">
            {config.names.partner1}
            <span className="w-hero-amp">&amp;</span>
            {config.names.partner2}
          </h1>
          <div className="w-hero-divider">
            <div className="w-hero-line" />
            <div className="w-hero-diamond" />
            <div className="w-hero-line" />
          </div>
          <p className="w-hero-date">{config.date}</p>
          <p className="w-hero-venue">{config.venue}</p>
          <div className="w-hero-cta">
            <button className="w-btn" onClick={() => navigate('rsvp')}>
              <span>Kindly RSVP</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      <section className="w-countdown">
        <p className="w-countdown-label">Counting Down to Forever</p>
        <div className="w-countdown-grid">
          {[['d','Days'], ['h','Hours'], ['m','Minutes'], ['s','Seconds']].map(([k, lbl], i) => (
            <div key={k} style={{ display: 'contents' }}>
              {i > 0 && <div className="w-countdown-sep">:</div>}
              <div className="w-countdown-item">
                <span className="w-countdown-num">{time[k] ?? '--'}</span>
                <span className="w-countdown-unit">{lbl}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PHOTO BAND ── */}
      <div className="w-photo-band">
        <img
          className="w-photo-band-img"
          src={config.galleryImage}
          alt={`${config.names.partner1} and ${config.names.partner2} together`}
        />
        <div className="w-photo-band-overlay" />
        <div className="w-photo-band-content">
          <p className="w-photo-band-quote">{config.photoBandQuote}</p>
          <p className="w-photo-band-attr">{config.photoBandAttr}</p>
        </div>
      </div>

      {/* ── STORY ── */}
      <section style={{ background: 'var(--cream)' }}>
        <div className="w-story">
          <span className="w-eyebrow">Our Story</span>
          <h2 className="w-section-title">A love that broke borders</h2>
          {config.story.map((para, i) => (
            <div key={i}>
              {i > 0 && <span className="w-ornament">✦ · ✦ · ✦</span>}
              <p className="w-body">{para}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DETAILS ── */}
      <section className="w-details">
        <span className="w-eyebrow" style={{ textAlign: 'center', color: 'var(--gold)' }}>
          Wedding Details
        </span>
        <div className="w-details-grid">
          {config.details.map(d => (
            <div key={d.label} className="w-detail-card">
              <span className="w-detail-icon">{d.icon}</span>
              <h3>{d.label}</h3>
              <p>{d.body}</p>
              <small>{d.note}</small>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
