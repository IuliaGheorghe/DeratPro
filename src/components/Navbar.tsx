import { useEffect, useState } from 'react'
import { navLinks, site } from '../data/site'
import '../css/navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth > 991 && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`navbar${open ? ' is-open' : ''}`}>
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-status">
            <span className="pulse" />
            <span>Răspundem rapid</span>
          </div>
          <div className="topbar-links">
            <a className="topbar-mail" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <a className="topbar-phone" href={site.phoneHref}>
              {site.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="nav">
        <div className="container nav-inner">
          <a className="brand" href="#hero" onClick={close}>
            <span>
              Derat<b>Pro</b>
            </span>
            <i />
          </a>

          <nav className="nav-links" aria-label="Navigare principală">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <a className="nav-urgent" href={site.phoneHref}>
              Urgențe 24/7
            </a>
            <button
              className="nav-toggle"
              type="button"
              aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <nav id="mobile-menu" className="nav-mobile" aria-label="Navigare mobil">
          <div className="container nav-mobile-inner">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={close} tabIndex={open ? 0 : -1}>
                {l.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
