import { useState, useEffect } from 'react'
import config from '../data/config'

const LINKS = [
  { id: 'home',     label: 'Home' },
  { id: 'registry', label: 'Registry' },
  { id: 'faq',      label: "FAQ's" },
  { id: 'rsvp',     label: 'RSVP' },
]

export default function Nav({ page, navigate }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`w-nav${scrolled ? ' scrolled' : ''}`}>
      <button className="w-nav-logo" onClick={() => navigate('home')}>
        {config.names.partner1[0]} &amp; {config.names.partner2[0]}
      </button>
      <ul className="w-nav-links">
        {LINKS.map(l => (
          <li key={l.id}>
            <button
              className={`w-nav-link${page === l.id ? ' active' : ''}`}
              onClick={() => navigate(l.id)}
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
