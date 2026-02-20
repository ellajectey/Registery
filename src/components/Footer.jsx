import config from '../data/config'

export default function Footer({ dark = false }) {
  return (
    <footer className="w-footer" style={dark ? { background: 'rgba(0,0,0,0.25)' } : {}}>
      <p className="w-footer-names">
        {config.names.partner1} &amp; {config.names.partner2}
      </p>
      <p className="w-footer-sub">
        {config.date} · {config.venue}
      </p>
    </footer>
  )
}
