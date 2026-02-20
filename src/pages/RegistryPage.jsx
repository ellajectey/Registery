import { useState, useEffect } from 'react'
import config from '../data/config'
import DEMO_REGISTRY from '../data/demoRegistry'
import PageHero from '../components/PageHero'
import Footer from '../components/Footer'
import GiftModal from '../components/GiftModal'

const fmt = (p) => {
  const n = parseFloat(String(p).replace(/[^0-9.]/g, ''))
  return isNaN(n) ? String(p) : 'GHS' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function getRibbon(item) {
  if (item.status === 'fulfilled' || item.purchased >= item.quantity)
    return { cls: 'ribbon-fulfilled', label: 'Fulfilled' }
  if (item.status === 'pending')
    return { cls: 'ribbon-pending', label: 'Pending Confirmation' }
  if (item.purchased > 0)
    return { cls: 'ribbon-partial', label: 'Partially Gifted' }
  return { cls: 'ribbon-available', label: 'Available' }
}

function RegistryCard({ item, idx, onGift }) {
  const ribbon      = getRibbon(item)
  const remaining   = Math.max(0, item.quantity - item.purchased)
  const pct         = Math.min(100, Math.round((item.purchased / item.quantity) * 100))
  const isUnavailable = item.status === 'fulfilled' || item.status === 'pending' || remaining === 0

  return (
    <div className="w-reg-card" style={{ animationDelay: `${idx * 0.06}s` }}>
      <div className="w-reg-img-wrap">
        <img
          className="w-reg-img"
          src={item.image || 'https://images.unsplash.com/photo-1606293926075-69a5658f1c1c?w=400&q=80'}
          alt={item.name}
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1606293926075-69a5658f1c1c?w=400&q=80' }}
        />
        <div className={`w-reg-ribbon ${ribbon.cls}`}>{ribbon.label}</div>
        <div className="w-reg-item-id">{item.id}</div>
      </div>

      <div className="w-reg-bar">
        <div className="w-reg-bar-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="w-reg-body">
        {item.category && <div className="w-reg-cat">{item.category}</div>}
        <div className="w-reg-name">{item.name}</div>
        <div className="w-reg-desc">{item.description}</div>

        <div className="w-reg-meta">
          <div className="w-reg-price">{fmt(item.price)}</div>
          <div className="w-reg-qty">
            <span className="qty-left">{remaining} remaining</span><br />
            {item.purchased} of {item.quantity} gifted
          </div>
        </div>

        {isUnavailable ? (
          <div className="w-reg-btn done">
            <span>
              {item.status === 'pending' ? '⏳ Pending Confirmation' : '✓ Fully Gifted'}
            </span>
          </div>
        ) : (
          <button className="w-reg-btn" onClick={() => onGift(item)}>
            <span>Gift This Item</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default function RegistryPage() {
  const [items,     setItems]     = useState([])
  const [filter,    setFilter]    = useState('All')
  const [status,    setStatus]    = useState('loading')
  const [barWidth,  setBarWidth]  = useState(0)
  const [modalItem, setModalItem] = useState(null)

  useEffect(() => {
    if (!config.REGISTRY_URL) {
      setItems(DEMO_REGISTRY)
      setStatus('ready')
      return
    }
    fetch(config.REGISTRY_URL)
      .then(r => r.json())
      .then(d => { setItems(d.items || []); setStatus('ready') })
      .catch(() => setStatus('error'))
  }, [])

  const fulfilled = items.filter(i => i.status === 'fulfilled' || i.purchased >= i.quantity).length
  const pct       = items.length ? Math.round((fulfilled / items.length) * 100) : 0

  useEffect(() => {
    if (status === 'ready') setTimeout(() => setBarWidth(pct), 200)
  }, [status, pct])

  const handleGifted = (itemId) => {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, status: 'pending' } : i))
  }

  const categories = ['All', ...new Set(items.map(i => i.category).filter(Boolean))]
  const visible    = filter === 'All' ? items : items.filter(i => i.category === filter)

  return (
    <div className="w-reg-page">
      <PageHero
        eyebrow="Our Wishes"
        title="Wedding Registry"
        subtitle="Curated items from our hearts to your hands"
      />

      {status === 'ready' && (
        <>
          <div className="w-reg-summary">
            <div className="w-reg-stat">
              <div className="num">{items.length}</div>
              <div className="lbl">Items</div>
            </div>
            <div className="w-reg-stat">
              <div className="num">{fulfilled}</div>
              <div className="lbl">Fulfilled</div>
            </div>
            <div className="w-reg-progress-wrap">
              <div className="w-reg-progress-labels">
                <span>Registry Progress</span>
                <span>{pct}%</span>
              </div>
              <div className="w-reg-progress-track">
                <div className="w-reg-progress-fill" style={{ width: `${barWidth}%` }} />
              </div>
            </div>
          </div>

          <div className="w-reg-filters">
            {categories.map(c => (
              <button
                key={c}
                className={`w-filter-btn${filter === c ? ' active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="w-reg-grid">
            {visible.map((item, i) => (
              <RegistryCard key={`${item.id}-${i}`} item={item} idx={i} onGift={setModalItem} />
            ))}
          </div>
        </>
      )}

      {status === 'loading' && (
        <div className="w-reg-loading">
          <div className="w-spinner" />
          <p>Loading registry…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="w-reg-error">
          <p>Could not load registry. Paste your Apps Script URL into <code>REGISTRY_URL</code> in <code>src/data/config.js</code>.</p>
        </div>
      )}

      {modalItem && (
        <GiftModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onGifted={(id) => { handleGifted(id); setModalItem(null) }}
        />
      )}

      <Footer />
    </div>
  )
}
