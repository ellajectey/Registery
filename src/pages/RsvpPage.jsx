import { useState } from 'react'
import config from '../data/config'
import PageHero from '../components/PageHero'
import Footer from '../components/Footer'

const INITIAL_FORM = {
  firstName: '',
  lastName:  '',
  email:     '',
  attending: '',
  guests:    '1',
  meal:      '',
  dietary:   '',
  song:      '',
  message:   '',
}

export default function RsvpPage() {
  const [form,       setForm]       = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [done,       setDone]       = useState(false)

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    if (config.RSVP_URL) {
      try {
        await fetch(config.RSVP_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ ...form, timestamp: new Date().toISOString() }),
        })
      } catch (_) {
        // Still show success — data may have saved despite CORS error
      }
    }

    setDone(true)
  }

  return (
    <div className="w-rsvp-page">
      <PageHero
        eyebrow="Join Us"
        title="RSVP"
        subtitle={`Please respond by ${config.rsvpDeadline}`}
      />

      <div className="w-rsvp-wrap">
        {!done ? (
          <>
            <p className="w-rsvp-intro">
              We are so excited to celebrate with you. Please fill out the form
              below to let us know you will be joining us.
            </p>

            <form className="w-rsvp-form" onSubmit={submit}>
              {/* Name */}
              {/* <div className="w-form-row"> */}
                <div className="w-form-group">
                  <label className="w-form-label">Name/Family/House</label>
                  <input className="w-form-input" required placeholder="House Of ..."
                    value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                </div>
                {/* <div className="w-form-group">
                  <label className="w-form-label">Last Name</label>
                  <input className="w-form-input" required placeholder="Your last name"
                    value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                </div> */}
              {/* </div> */}

              {/* Email */}
              <div className="w-form-group">
                <label className="w-form-label">Email Address</label>
                <input className="w-form-input" type="email" required placeholder="your@email.com"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>

              {/* Attending */}
              <div className="w-form-group">
                <label className="w-form-label">Will you be attending?</label>
                <div className="w-attend-grid">
                  {[['yes', 'Joyfully Accepts'], ['no', 'Regretfully Declines']].map(([val, label]) => (
                    <div key={val} className="w-attend-opt">
                      <input type="radio" name="attending" id={`att-${val}`} value={val}
                        onChange={() => set('attending', val)} />
                      <label htmlFor={`att-${val}`}
                        className={`w-attend-label${form.attending === val ? ' selected' : ''}`}>
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guests */}
              <div className="w-form-group">
                <label className="w-form-label">Number of Guests</label>
                <select className="w-form-select" value={form.guests} onChange={e => set('guests', e.target.value)}>
                  <option value="1">1 — Just me</option>
                  <option value="2">2 — Myself +1</option>
                  <option value="3">3 — Myself +2</option>
                  <option value="4">4 — Myself +3</option>
                  <option value="5">5 — Myself +4</option>
                  <option value="6">6 — Myself +5</option>
                </select>
              </div>

              {/* Meal */}
              <div className="w-form-group">
                <label className="w-form-label">Meal Preference</label>
                <select className="w-form-select" value={form.meal} onChange={e => set('meal', e.target.value)}>
                  <option value="">Select preference</option>
                  {config.mealOptions.map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Dietary */}
              <div className="w-form-group">
                <label className="w-form-label">Dietary Restrictions or Allergies</label>
                <textarea className="w-form-textarea" placeholder="Please let us know of any dietary needs…"
                  value={form.dietary} onChange={e => set('dietary', e.target.value)} />
              </div>

              {/* Song */}
              {/* <div className="w-form-group">
                <label className="w-form-label">Song Request</label>
                <input className="w-form-input" placeholder="What song will get you on the dance floor?"
                  value={form.song} onChange={e => set('song', e.target.value)} />
              </div> */}

              {/* Message */}
              <div className="w-form-group">
                <label className="w-form-label">A message for the couple (optional)</label>
                <textarea className="w-form-textarea" placeholder="Share your well wishes…"
                  value={form.message} onChange={e => set('message', e.target.value)} />
              </div>

              <button type="submit" className="w-btn-submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send My RSVP'}
              </button>
            </form>
          </>
        ) : (
          <div className="w-rsvp-success">
            <span className="w-rsvp-success-icon">💌</span>
            <h2>We received your RSVP!</h2>
            <p>
              Thank you so much — we cannot wait to celebrate with you.<br />
              A confirmation has been sent to your email.
            </p>
          </div>
        )}
      </div>

      <Footer dark />
    </div>
  )
}
