import { Link } from 'react-router-dom'
import './Footer.css'

const PRODUCT_LINKS = [
  { path: '/analyzer',  label: 'Scam Analyzer' },
  { path: '/scanner',   label: 'QR Scanner' },
  { path: '/academy',   label: 'Cyber Academy' },
  { path: '/docs',      label: 'API Documentation' },
]

const RESOURCE_LINKS = [
  { path: '/privacy',  label: 'Privacy Policy' },
  { path: '/terms',    label: 'Terms of Service' },
  { path: '/audit',    label: 'Security Audit' },
  { path: '/support',  label: 'Contact Support' },
]

export default function Footer() {
  return (
    <footer className="sn-footer">
      <div className="sn-footer__inner">
        <div className="sn-footer__grid">
          {/* Brand Column */}
          <div className="sn-footer__brand">
            <Link to="/" className="sn-footer__logo">
              <span className="material-symbols-outlined sn-footer__shield" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              <span className="sn-footer__logo-text">CYBERSHIELD AI</span>
            </Link>
            <p className="sn-footer__desc">
              Building the next generation of sovereign digital defense for 1.4 billion citizens. Powered by advanced AI and human vigilance.
            </p>
          </div>

          {/* Product Column */}
          <div className="sn-footer__col">
            <h5 className="sn-footer__col-title">Product</h5>
            <ul className="sn-footer__links">
              {PRODUCT_LINKS.map(({ path, label }) => (
                <li key={path}>
                  <Link to={path} className="sn-footer__link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="sn-footer__col">
            <h5 className="sn-footer__col-title">Resources</h5>
            <ul className="sn-footer__links">
              {RESOURCE_LINKS.map(({ path, label }) => (
                <li key={path}>
                  <Link to={path} className="sn-footer__link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sn-footer__bottom">
          <div className="sn-footer__copy">© {new Date().getFullYear()} CYBERSHIELD AI. SECURE_PROTOCOL_V2.0</div>
          <div className="sn-footer__meta">
            <span>Latency: 312ms</span>
            <span>Region: AS-SOUTH-1</span>
            <span>Tier: Sentinel Elite</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
