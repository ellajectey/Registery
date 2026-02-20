import { useState, useEffect } from 'react'
import Nav from './components/Nav'
import HomePage from './pages/HomePage'
import RegistryPage from './pages/RegistryPage'
import FaqPage from './pages/FaqPage'
import RsvpPage from './pages/RsvpPage'
import config from './data/config'
import DEMO_REGISTRY from './data/demoRegistry'
import { fetchRegistry } from './utils/sheetsApi'

const PAGES = { home: true, registry: true, faq: true, rsvp: true }

export default function App() {
  const getPageFromHash = () => {
    const raw = (location && location.hash) ? location.hash.replace(/^#/, '') : ''
    return PAGES[raw] ? raw : 'home'
  }

  const [page, setPage] = useState(getPageFromHash)
  const [registryItems, setRegistryItems] = useState([])
  const [registryStatus, setRegistryStatus] = useState('loading')

  useEffect(() => {
    let mounted = true
    if (!config.REGISTRY_URL) {
      setRegistryItems(DEMO_REGISTRY)
      setRegistryStatus('ready')
      return
    }
    fetchRegistry()
      .then(items => { if (!mounted) return; setRegistryItems(items); setRegistryStatus('ready') })
      .catch(() => { if (!mounted) return; setRegistryStatus('error') })
    return () => { mounted = false }
  }, [])

  const refreshRegistry = async () => {
    // prevent duplicate refresh
    if (registryStatus === 'loading') return
    setRegistryStatus('loading')
    if (!config.REGISTRY_URL) {
      setRegistryItems(DEMO_REGISTRY)
      setRegistryStatus('ready')
      return
    }
    try {
      const items = await fetchRegistry()
      setRegistryItems(items)
      setRegistryStatus('ready')
    } catch (e) {
      setRegistryStatus('error')
    }
  }

  useEffect(() => {
    const onHashChange = () => {
      const h = getPageFromHash()
      setPage(h)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    // ensure state matches current hash on mount
    onHashChange()
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (to) => {
    if (!PAGES[to]) return
    setPage(to)
    if ((location && location.hash.replace(/^#/, '')) !== to) {
      // update the hash which creates history entries (back/forward support)
      location.hash = `#${to}`
    }
    window.scrollTo(0, 0)
  }

  return (
    <div>
      <Nav page={page} navigate={navigate} />
      <div style={{ paddingTop: page === 'home' ? 0 : 70 }}>
        {page === 'home' && <HomePage />}
        {page === 'registry' && (
          <RegistryPage items={registryItems} setItems={setRegistryItems} status={registryStatus} />
        )}
        {page === 'faq' && <FaqPage />}
        {page === 'rsvp' && <RsvpPage />}
      </div>
      {page === 'registry' && (
        <button
          className={`refresh-btn${registryStatus === 'loading' ? ' loading' : ''}`}
          onClick={refreshRegistry}
          title="Refresh registry"
        >
          {registryStatus === 'loading' ? (
            <span className="refresh-spinner" aria-hidden="true" />
          ) : (
            '↻'
          )}
        </button>
      )}
    </div>
  )
}
