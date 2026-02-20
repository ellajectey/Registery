import { useState, useEffect } from 'react'
import config from '../data/config'

// ── Step identifiers ──────────────────────────────────────
// 'choose'   → initial 3-option screen
// 'money'    → send money flow
// 'book'     → book for delivery flow
// 'book-confirm' → book confirmation step
// 'direct'   → redirect to external source
// 'done'     → success screen

export default function GiftModal({ item, onClose, onGifted }) {
  const [step,      setStep]      = useState('choose')
  const [giftName,  setGiftName]  = useState('')
  const [giftEmail, setGiftEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Close on Escape key
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const reference = `${giftName.trim() || 'Your Name'} – ${item.id}`

  // ── Submit gift action to Apps Script ────────────────────
  const submitAction = async (type) => {
    setSubmitting(true)
    const payload = {
      action:    'gift',
      itemId:    item.id,
      itemName:  item.name,
      giftType:  type,           // 'money' | 'book' | 'direct'
      giftName,
      giftEmail,
      timestamp: new Date().toISOString(),
    }
    if (config.REGISTRY_URL) {
      try {
        await fetch(config.REGISTRY_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload),
        })
      } catch (_) { /* still proceed */ }
    }
    onGifted(item.id, type)   // update local state in parent
    setStep('done')
    setSubmitting(false)
  }

  return (
    <div className="gm-backdrop" onClick={onClose}>
      <div className="gm-panel" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="gm-header">
          <div>
            <p className="gm-eyebrow">{item.id}</p>
            <h3 className="gm-title">{item.name}</h3>
            <p className="gm-price">{fmt(item.price)}</p>
          </div>
          <button className="gm-close" onClick={onClose}>✕</button>
        </div>

        {/* ═══════════════════════════════════════════════
            STEP: choose
        ═══════════════════════════════════════════════ */}
        {step === 'choose' && (
          <div className="gm-body">
            <p className="gm-intro">How would you like to gift this item?</p>
            <div className="gm-options">

              <button className="gm-option" onClick={() => setStep('money')}>
                <span className="gm-option-icon">💸</span>
                <div>
                  <div className="gm-option-label">Send Money</div>
                  <div className="gm-option-desc">Transfer the amount via bank or mobile money</div>
                </div>
                <span className="gm-option-arrow">→</span>
              </button>

              <button className="gm-option" onClick={() => setStep('book')}>
                <span className="gm-option-icon">🎁</span>
                <div>
                  <div className="gm-option-label">Book for Delivery</div>
                  <div className="gm-option-desc">Reserve the item and bring it to the traditional or reception</div>
                </div>
                <span className="gm-option-arrow">→</span>
              </button>

              {item.allowDirectPurchase && item.link && (
                <button className="gm-option" onClick={() => setStep('direct')}>
                  <span className="gm-option-icon">🛒</span>
                  <div>
                    <div className="gm-option-label">Buy Directly from Store</div>
                    <div className="gm-option-desc">Purchase from the retailer and arrange shipping yourself</div>
                  </div>
                  <span className="gm-option-arrow">→</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            STEP: money
        ═══════════════════════════════════════════════ */}
        {step === 'money' && (
          <div className="gm-body">
            <button className="gm-back" onClick={() => setStep('choose')}>← Back</button>
            <p className="gm-intro">Enter your details, then transfer the amount using either option below.</p>

            {/* Guest details */}
            <div className="gm-fields">
              <div className="gm-field">
                <label className="gm-field-label">Your Name</label>
                <input className="gm-field-input" placeholder="Full name" value={giftName} onChange={e => setGiftName(e.target.value)} />
              </div>
              <div className="gm-field">
                <label className="gm-field-label">Your Email (optional)</label>
                <input className="gm-field-input" type="email" placeholder="For confirmation" value={giftEmail} onChange={e => setGiftEmail(e.target.value)} />
              </div>
            </div>

            {/* Reference box */}
            <div className="gm-reference-box">
              <p className="gm-reference-label">Use this as your payment reference</p>
              <p className="gm-reference-value">{reference}</p>
              <p className="gm-reference-hint">{config.payment.referenceFormat}</p>
            </div>

            {/* Bank card */}
            <div className="gm-payment-cards">
              <div className="gm-payment-card">
                <div className="gm-payment-card-header">
                  <span className="gm-payment-logo">{config.payment.bank.logo}</span>
                  <span className="gm-payment-provider">{config.payment.bank.name}</span>
                </div>
                <div className="gm-payment-row"><span>Account Name</span><strong>{config.payment.bank.accountName}</strong></div>
                <div className="gm-payment-row"><span>Account No.</span><strong>{config.payment.bank.accountNumber}</strong></div>
                <div className="gm-payment-row"><span>Branch</span><strong>{config.payment.bank.branch}</strong></div>
                <div className="gm-payment-row amount"><span>Amount</span><strong>{fmt(item.price)}</strong></div>
              </div>

              <div className="gm-payment-card">
                <div className="gm-payment-card-header">
                  <span className="gm-payment-logo">{config.payment.mobileMoney.logo}</span>
                  <span className="gm-payment-provider">{config.payment.mobileMoney.provider}</span>
                </div>
                <div className="gm-payment-row"><span>Name</span><strong>{config.payment.mobileMoney.accountName}</strong></div>
                <div className="gm-payment-row"><span>Number</span><strong>{config.payment.mobileMoney.number}</strong></div>
                <div className="gm-payment-row amount"><span>Amount</span><strong>{fmt(item.price)}</strong></div>
              </div>
            </div>

            <button
              className="gm-submit-btn"
              disabled={!giftName.trim() || submitting}
              onClick={() => submitAction('money')}
            >
              {submitting ? 'Confirming…' : "I've Sent the Money"}
            </button>
            <p className="gm-submit-note">Clicking this marks the item as pending confirmation. We will verify and update the registry shortly.</p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            STEP: book
        ═══════════════════════════════════════════════ */}
        {step === 'book' && (
          <div className="gm-body">
            <button className="gm-back" onClick={() => setStep('choose')}>← Back</button>
            <p className="gm-intro">Reserve this item and bring it as a gift on the day.</p>

            <div className="gm-fields">
              <div className="gm-field">
                <label className="gm-field-label">Your Name</label>
                <input className="gm-field-input" placeholder="Full name" value={giftName} onChange={e => setGiftName(e.target.value)} />
              </div>
              <div className="gm-field">
                <label className="gm-field-label">Your Email (optional)</label>
                <input className="gm-field-input" type="email" placeholder="For confirmation" value={giftEmail} onChange={e => setGiftEmail(e.target.value)} />
              </div>
            </div>

            <div className="gm-info-box">
              <p className="gm-info-icon">📦</p>
              <p className="gm-info-text">
                You can bring the item to either the <strong>Traditional Ceremony</strong> or the <strong>Wedding Reception</strong>. 
                Our team will be available to receive gifts at both events.
              </p>
            </div>

            <button
              className="gm-submit-btn"
              disabled={!giftName.trim() || submitting}
              onClick={() => setStep('book-confirm')}
            >
              Continue
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            STEP: book-confirm
        ═══════════════════════════════════════════════ */}
        {step === 'book-confirm' && (
          <div className="gm-body">
            <button className="gm-back" onClick={() => setStep('book')}>← Back</button>

            <div className="gm-confirm-box">
              <p className="gm-confirm-icon">🎁</p>
              <h4 className="gm-confirm-title">Are you sure?</h4>
              <p className="gm-confirm-text">
                By confirming, <strong>{giftName}</strong> will be registered as gifting:
              </p>
              <div className="gm-confirm-item">
                <span className="gm-confirm-item-id">{item.id}</span>
                <span className="gm-confirm-item-name">{item.name}</span>
                <span className="gm-confirm-item-price">{fmt(item.price)}</span>
              </div>
              <p className="gm-confirm-text" style={{ marginTop: '0.8rem' }}>
                This item will show as <strong>Pending</strong> on the registry until we receive it.
                Please bring it to the <strong>Traditional</strong> or <strong>Reception</strong>.
              </p>
            </div>

            <div className="gm-confirm-actions">
              <button className="gm-secondary-btn" onClick={() => setStep('book')}>Go Back</button>
              <button
                className="gm-submit-btn"
                disabled={submitting}
                onClick={() => submitAction('book')}
              >
                {submitting ? 'Confirming…' : 'Yes, I will bring this gift'}
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            STEP: direct
        ═══════════════════════════════════════════════ */}
        {step === 'direct' && (
          <div className="gm-body">
            <button className="gm-back" onClick={() => setStep('choose')}>← Back</button>
            <p className="gm-intro">Purchase this item directly from the retailer.</p>

            <div className="gm-fields">
              <div className="gm-field">
                <label className="gm-field-label">Your Name</label>
                <input className="gm-field-input" placeholder="Full name" value={giftName} onChange={e => setGiftName(e.target.value)} />
              </div>
              <div className="gm-field">
                <label className="gm-field-label">Your Email (optional)</label>
                <input className="gm-field-input" type="email" placeholder="For confirmation" value={giftEmail} onChange={e => setGiftEmail(e.target.value)} />
              </div>
            </div>

            <div className="gm-info-box">
              <p className="gm-info-icon">🛒</p>
              <p className="gm-info-text">
                You will be taken to the retailer's website. Please arrange delivery to our address — 
                contact us at <strong>{config.email}</strong> for delivery details.
              </p>
            </div>

            <div className="gm-confirm-actions">
              <button
                className="gm-secondary-btn"
                disabled={!giftName.trim() || submitting}
                onClick={() => submitAction('direct')}
              >
                {submitting ? 'Registering…' : 'Mark as purchasing'}
              </button>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="gm-submit-btn"
                style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
                onClick={() => { if (giftName.trim()) submitAction('direct') }}
              >
                Go to Store →
              </a>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            STEP: done
        ═══════════════════════════════════════════════ */}
        {step === 'done' && (
          <div className="gm-body gm-done">
            <span className="gm-done-icon">💝</span>
            <h4 className="gm-done-title">Thank you, {giftName || 'friend'}!</h4>
            <p className="gm-done-text">
              Your gift of <strong>{item.name}</strong> has been recorded as pending.
              Eleanor & James will confirm and update the registry once received.
            </p>
            <p className="gm-done-ref">Reference: <strong>{item.id}</strong></p>
            <button className="gm-submit-btn" onClick={onClose}>Close</button>
          </div>
        )}

      </div>
    </div>
  )
}

const fmt = (p) => {
  const n = parseFloat(String(p).replace(/[^0-9.]/g, ''))
  return isNaN(n) ? String(p) : '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}
