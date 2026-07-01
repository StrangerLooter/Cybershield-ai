import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Shield, Menu, X, ChevronRight, Zap } from 'lucide-react'
import './Navbar.css'

const NAV_LINKS = [
  { path: '/',          label: 'Home' },
  { path: '/analyzer',  label: 'Scam Analyzer' },
  { path: '/scanner',   label: 'QR Scanner' },
  { path: '/complaint', label: 'Complaint' },
  { path: '/academy',   label: 'Cyber Academy' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/about',     label: 'About' },
]

export default function Navbar() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location                = useLocation()
  const navRef                  = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setOpen(false) }, [location])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} ref={navRef}>
        <nav className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <Shield size={20} />
          </div>
          <span className="navbar__logo-text">
            CyberShield <span className="navbar__logo-ai">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="navbar__links">
          {NAV_LINKS.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
                end={path === '/'}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link to="/analyzer" className="btn btn-primary btn-sm navbar__cta">
          <Zap size={14} />
          Analyze Now
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar__toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          id="navbar-toggle"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${open ? 'navbar__mobile--open' : ''}`}>
        <ul className="navbar__mobile-links">
          {NAV_LINKS.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                }
                end={path === '/'}
              >
                <ChevronRight size={14} />
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link to="/analyzer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
              <Zap size={14} /> Analyze Now
            </Link>
          </li>
        </ul>
      </div>
    </header>
    </>
  )
}
