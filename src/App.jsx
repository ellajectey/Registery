import { useState } from 'react'
import Nav from './components/Nav'
import HomePage from './pages/HomePage'
import RegistryPage from './pages/RegistryPage'
import FaqPage from './pages/FaqPage'
import RsvpPage from './pages/RsvpPage'

const PAGES = {
  home:     <HomePage />,
  registry: <RegistryPage />,
  faq:      <FaqPage />,
  rsvp:     <RsvpPage />,
}

export default function App() {
  const [page, setPage] = useState('home')

  const navigate = (to) => {
    setPage(to)
    window.scrollTo(0, 0)
  }

  return (
    <div>
      <Nav page={page} navigate={navigate} />
      <div style={{ paddingTop: page === 'home' ? 0 : 70 }}>
        {/* Re-render page component when page changes */}
        {PAGES[page]}
      </div>
    </div>
  )
}
