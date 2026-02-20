export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <div className="w-page-hero">
      <span className="w-eyebrow" style={{ color: 'var(--gold-light)' }}>
        {eyebrow}
      </span>
      <h2 className="w-page-hero-title">{title}</h2>
      {subtitle && <p className="w-page-hero-sub">{subtitle}</p>}
    </div>
  )
}
