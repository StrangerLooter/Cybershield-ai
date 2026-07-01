import { Link } from 'react-router-dom'
import { Shield, Mail, Phone, ExternalLink } from 'lucide-react'
import './Footer.css'

const FEATURE_LINKS = [
  { path: '/analyzer',  label: 'Scam Analyzer' },
  { path: '/scanner',   label: 'QR Scanner' },
  { path: '/complaint', label: 'Complaint Generator' },
  { path: '/academy',   label: 'Cyber Academy' },
  { path: '/dashboard', label: 'Dashboard' },
]

const RESOURCE_LINKS = [
  { href: 'https://cybercrime.gov.in', label: 'Cybercrime.gov.in', external: true },
  { href: 'https://www.cert-in.org.in', label: 'CERT-In', external: true },
  { href: 'https://www.meity.gov.in', label: 'MeitY', external: true },
  { href: 'tel:1930', label: 'Helpline: 1930', external: false },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon">
                <Shield size={18} />
              </div>
              <span>CyberShield <span className="footer__logo-ai">AI</span></span>
            </Link>
            <p className="footer__tagline">
              Prevent. Detect. Report. Protect.
            </p>
            <p className="footer__desc">
              India's AI-powered cyber fraud prevention platform, built to protect citizens and assist law enforcement.
            </p>
            <div className="footer__emergency">
              <Phone size={14} />
              <span>Cyber Crime Helpline:</span>
              <a href="tel:1930" className="footer__emergency-number">1930</a>
            </div>
          </div>

          {/* Features */}
          <div className="footer__col">
            <h4 className="footer__col-title">Features</h4>
            <ul className="footer__links">
              {FEATURE_LINKS.map(({ path, label }) => (
                <li key={path}>
                  <Link to={path} className="footer__link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="footer__col">
            <h4 className="footer__col-title">Resources</h4>
            <ul className="footer__links">
              {RESOURCE_LINKS.map(({ href, label, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="footer__link"
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                  >
                    {label}
                    {external && <ExternalLink size={11} />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Coming Soon */}
          <div className="footer__col">
            <h4 className="footer__col-title">Coming Soon</h4>
            <ul className="footer__links">
              {['Voice Assistant', 'AI Call Analyzer', 'Browser Extension', 'Fraud Heatmap', "Women's Safety Mode"].map(item => (
                <li key={item}>
                  <span className="footer__link footer__link--soon">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {new Date().getFullYear()} CyberShield AI. Built for a safer digital India.
          </p>
          <div className="footer__badges">
            <span className="badge badge-info">🛡️ Hackathon Project</span>
            <span className="badge badge-info">🤖 Powered by Groq AI</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
