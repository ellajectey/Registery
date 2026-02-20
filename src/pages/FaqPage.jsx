import { useState } from 'react'
import config from '../data/config'
import FAQ from '../data/faq'
import PageHero from '../components/PageHero'
import Footer from '../components/Footer'

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="w-faq-item">
      <div className="w-faq-q" onClick={onToggle}>
        <h3>{item.q}</h3>
        <div className={`w-faq-icon${isOpen ? ' open' : ''}`}>+</div>
      </div>
      <div className={`w-faq-a${isOpen ? ' open' : ''}`}>
        {item.a}
      </div>
    </div>
  )
}

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState(null)

  const toggle = (i) => setOpenIdx(openIdx === i ? null : i)

  return (
    <div className="w-faq-page">
      <PageHero
        eyebrow="Everything You Need"
        title="Frequently Asked Questions"
        subtitle="We have answered the most common questions below"
      />

      <div className="w-faq-wrap">
        <p className="w-faq-hint">
          Have a question not listed? Email us at {config.email}
        </p>

        {FAQ.map((item, i) => (
          <FaqItem
            key={i}
            item={item}
            isOpen={openIdx === i}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>

      <Footer />
    </div>
  )
}
