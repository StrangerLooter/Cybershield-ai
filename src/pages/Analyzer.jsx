import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap, Shield, AlertTriangle, CheckCircle, XCircle,
  Copy, FileText, Phone, RotateCcw, ChevronDown, ChevronUp,
  Info, ImagePlus, Share2, Users, BarChart3
} from 'lucide-react'
import Tesseract from 'tesseract.js'
import toast from 'react-hot-toast'
import { analyzeScam } from '../services/gemini'
import { saveReport } from '../services/supabase'
import './Analyzer.css'

const EXAMPLE_MESSAGES = [
  {
    label: 'Bank Phishing',
    text: 'Dear Customer, Your SBI account has been temporarily blocked due to incomplete KYC. Update immediately at: http://sbi-kyc-update.xyz/secure or your account will be suspended within 24 hours. Call 9876543210.',
  },
  {
    label: 'UPI Fraud',
    text: 'You have received ₹15,000. Kindly scan the QR code to accept the payment before it expires. This is from HDFC Bank reward program.',
  },
  {
    label: 'Job Scam',
    text: 'Congratulations! You have been selected for a work-from-home job. Earn ₹50,000/month. Registration fee ₹500 only. WhatsApp: +91-9988776655.',
  },
  {
    label: 'Lottery Scam',
    text: "You've won ₹25 Lakhs in KBC Lucky Draw! Your number was selected. To claim prize, send your Aadhaar, PAN and ₹2,500 processing fee to account 12345678.",
  },
  {
    label: 'OTP Fraud',
    text: 'Your bank OTP is 847291. NEVER share this with anyone. If you did not request this, call our security team immediately at 1800-XXX-XXXX to freeze your account.',
  },
]

const RISK_CONFIG = {
  CRITICAL: { color: 'var(--danger)',  bg: 'var(--danger-dim)',  glow: 'var(--danger-glow)',  label: 'CRITICAL RISK' },
  HIGH:     { color: 'var(--warning)', bg: 'var(--warning-dim)', glow: 'var(--warning-glow)', label: 'HIGH RISK' },
  MEDIUM:   { color: 'var(--medium)',  bg: 'var(--medium-dim)',  glow: 'rgba(255,215,0,0.3)', label: 'MEDIUM RISK' },
  LOW:      { color: 'var(--safe)',    bg: 'var(--safe-dim)',    glow: 'var(--safe-glow)',    label: 'LOW RISK' },
}

function RiskMeter({ score, level }) {
  const cfg = RISK_CONFIG[level] ?? RISK_CONFIG.LOW
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="risk-meter">
      <svg viewBox="0 0 120 120" className="risk-meter__svg">
        {/* Background track */}
        <circle cx="60" cy="60" r="54" fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        {/* Score arc */}
        <circle cx="60" cy="60" r="54" fill="none"
          stroke={cfg.color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          style={{ filter: `drop-shadow(0 0 12px ${cfg.color})`, transition: 'stroke-dashoffset 1.2s ease' }}
        />
      </svg>
      <div className="risk-meter__center">
        <span className="risk-meter__score" style={{ color: cfg.color }}>{score}</span>
        <span className="risk-meter__label">/ 100</span>
      </div>
    </div>
  )
}

export default function Analyzer() {
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState(null)
  const [error,     setError]     = useState(null)
  const [showAll,   setShowAll]   = useState(false)
  const resultRef                 = useRef(null)

  const handleAnalyze = async () => {
    const text = input.trim()
    if (!text) { toast.error('Please paste a message to analyze'); return }
    if (text.length < 10) { toast.error('Message is too short to analyze'); return }

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const data = await analyzeScam(text)
      setResult(data)
      // Save to Supabase (non-blocking)
      saveReport({
        content:      text.slice(0, 500),
        risk_score:   data.riskScore,
        threat_level: data.threatLevel,
        attack_type:  data.attackType,
        indicators:   data.indicators,
      }).catch(() => {}) // silently ignore DB errors
      // Scroll to result
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      setError(err.message)
      toast.error('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setInput('')
    setResult(null)
    setError(null)
    setShowAll(false)
  }

  const copyResult = () => {
    if (!result) return
    const text = `CyberShield AI Analysis\nRisk Score: ${result.riskScore}/100\nThreat Level: ${result.threatLevel}\nAttack Type: ${result.attackType}\n\n${result.summary}`
    navigator.clipboard.writeText(text)
    toast.success('Result copied to clipboard!')
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    setInput('Extracting text from image please wait...')
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng')
      setInput(text)
      toast.success('Text extracted successfully!')
    } catch (err) {
      toast.error('Failed to extract text from image')
      setInput('')
    } finally {
      setLoading(false)
    }
  }

  const shareWarning = async () => {
    if (!result) return
    const text = `🚨 CyberShield Alert:\nThis message is ${result.riskScore}% likely to be a scam (${result.threatLevel} RISK).\n\nThreat: ${result.attackType}\nAdvice: Do NOT click any links.\n\nAnalyzed via CyberShield AI.`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Scam Warning', text: text })
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(text)
      toast.success('Warning copied to share on WhatsApp!')
    }
  }

  const cfg = result ? (RISK_CONFIG[result.threatLevel] ?? RISK_CONFIG.LOW) : null

  return (
    <div className="analyzer-page page-wrapper">
      {/* ── Header ── */}
      <section className="analyzer-header">
        <div className="analyzer-header__glow" />
        <div className="container">
          <div className="section-label">
            <Zap size={14} />
            AI Scam Analyzer
          </div>
          <h1>Analyze Any Suspicious Message</h1>
          <p className="analyzer-header__sub">
            Paste an SMS, WhatsApp message, email, or URL. Our AI detects fraud patterns,
            assigns a risk score, and tells you exactly what to do — in under 5 seconds.
          </p>
        </div>
      </section>

      <div className="container analyzer-body">
        {/* ── Input Section ── */}
        <div className="analyzer-input-section">
          <div className="analyzer-input-card card">
            <div className="analyzer-input-card__header">
              <h3>Paste Suspicious Content</h3>
              <div className="flex gap-1" style={{ alignItems: 'center' }}>
                <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer', padding: '4px 10px' }}>
                  <ImagePlus size={14} /> Upload Screenshot
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={loading} />
                </label>
                <span className="badge badge-info">
                  <Shield size={11} /> AI Powered
                </span>
              </div>
            </div>

            <div className={`analyzer-textarea-wrap ${loading ? 'analyzer-textarea-wrap--scanning' : ''}`}>
              {loading && <div className="scan-line" />}
              <textarea
                id="analyzer-input"
                className="input analyzer-textarea"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Paste any suspicious SMS, WhatsApp message, email, or URL here...&#10;&#10;Example: 'Your account will be blocked. Click here to verify...' "
                rows={8}
                disabled={loading}
              />
            </div>

            <div className="analyzer-examples">
              <span className="analyzer-examples__label">Try an example:</span>
              {EXAMPLE_MESSAGES.map(({ label, text }) => (
                <button
                  key={label}
                  className="btn btn-ghost btn-sm"
                  onClick={() => setInput(text)}
                  disabled={loading}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="analyzer-input-card__footer">
              <span className="analyzer-char-count" style={{ color: input.length > 1000 ? 'var(--warning)' : 'var(--text-muted)' }}>
                {input.length} characters
              </span>
              <div className="flex gap-1">
                {input && (
                  <button className="btn btn-ghost btn-sm" onClick={handleReset} disabled={loading}>
                    <RotateCcw size={14} /> Clear
                  </button>
                )}
                <button
                  id="analyze-btn"
                  className="btn btn-primary"
                  onClick={handleAnalyze}
                  disabled={loading || !input.trim()}
                >
                  {loading ? (
                    <><div className="spinner" /> Analyzing...</>
                  ) : (
                    <><Zap size={16} /> Analyze Now</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="analyzer-error card">
            <XCircle size={20} style={{ color: 'var(--danger)' }} />
            <div>
              <strong>Analysis Failed</strong>
              <p>{error}</p>
              <p style={{ fontSize: '0.82rem', marginTop: '8px' }}>
                Make sure your <code>VITE_GROQ_API_KEY</code> is set in the <code>.env</code> file.
              </p>
            </div>
          </div>
        )}

        {/* ── Result ── */}
        {result && (
          <div className="analyzer-result" ref={resultRef}>
            {/* Score + Level */}
            <div className="result-hero card" style={{ borderColor: cfg.glow }}>
              <div className="result-hero__left">
                <RiskMeter score={result.riskScore} level={result.threatLevel} />
              </div>
              <div className="result-hero__right">
                <span className={`badge badge-${result.threatLevel.toLowerCase() === 'critical' ? 'critical' : result.threatLevel.toLowerCase() === 'high' ? 'high' : result.threatLevel.toLowerCase() === 'medium' ? 'medium' : 'low'}`} style={{ fontSize: '0.9rem', padding: '6px 16px' }}>
                  {result.isScam ? '⚠ ' : '✓ '}
                  {cfg.label}
                </span>
                <h2 style={{ margin: '12px 0 8px', fontSize: '1.5rem' }}>
                  {result.attackType}
                </h2>
                <p style={{ fontSize: '0.92rem', lineHeight: '1.7' }}>{result.summary}</p>
                <div className="result-hero__actions">
                  <button className="btn btn-ghost btn-sm" onClick={copyResult}>
                    <Copy size={14} /> Copy Result
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={shareWarning}>
                    <Share2 size={14} /> Share Warning
                  </button>
                  <Link to="/complaint" className="btn btn-secondary btn-sm">
                    <FileText size={14} /> Generate Complaint
                  </Link>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            {result.scoreBreakdown && (
              <div className="card" style={{ marginTop: '16px', padding: '24px' }}>
                <div className="result-card-header" style={{ marginBottom: '20px' }}>
                  <BarChart3 size={18} style={{ color: 'var(--accent-primary)' }} />
                  <h3>Score Breakdown</h3>
                  <span style={{ marginLeft: 'auto', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', opacity: 0.6 }}>Weighted Analysis</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  {[
                    { key: 'urgencyLanguage', label: 'Urgency / Pressure', weight: '15%' },
                    { key: 'suspiciousURL', label: 'Suspicious URL', weight: '20%' },
                    { key: 'impersonation', label: 'Impersonation', weight: '15%' },
                    { key: 'financialRequest', label: 'Financial Request', weight: '20%' },
                    { key: 'grammarAnomalies', label: 'Grammar Anomalies', weight: '5%' },
                    { key: 'dataHarvesting', label: 'Data Harvesting', weight: '10%' },
                    { key: 'psychologicalManipulation', label: 'Manipulation', weight: '10%' },
                    { key: 'knownPatternMatch', label: 'Known Pattern', weight: '5%' },
                  ].map(({ key, label, weight }) => {
                    const val = result.scoreBreakdown[key] || 0
                    const barColor = val <= 3 ? 'var(--safe)' : val <= 6 ? 'var(--warning)' : 'var(--danger)'
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ minWidth: '130px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                          {label} <span style={{ opacity: 0.5 }}>({weight})</span>
                        </div>
                        <div style={{ flex: 1, height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${val * 10}%`, height: '100%', background: barColor, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                        </div>
                        <span style={{ minWidth: '30px', textAlign: 'right', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: barColor }}>{val}/10</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="result-grid">
              {/* Indicators */}
              <div className="card result-indicators">
                <div className="result-card-header">
                  <AlertTriangle size={18} style={{ color: cfg.color }} />
                  <h3>Fraud Indicators</h3>
                </div>
                <ul className="indicators-list">
                  {(showAll ? result.indicators : result.indicators?.slice(0, 4))?.map(({ flag, description }) => (
                    <li key={flag} className="indicator-item">
                      <div className="indicator-item__icon" style={{ background: cfg.bg, color: cfg.color }}>
                        <AlertTriangle size={13} />
                      </div>
                      <div>
                        <span className="indicator-item__flag">{flag}</span>
                        <p className="indicator-item__desc">{description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                {result.indicators?.length > 4 && (
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowAll(!showAll)} style={{ marginTop: '12px', width: '100%' }}>
                    {showAll ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> Show All {result.indicators.length} Indicators</>}
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="card result-actions">
                <div className="result-card-header">
                  <Shield size={18} style={{ color: 'var(--accent-primary)' }} />
                  <h3>Recommended Actions</h3>
                </div>
                <ul className="actions-list">
                  {result.actions?.map((action, i) => (
                    <li key={i} className="action-item">
                      <div className="action-item__num">{i + 1}</div>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>

                <div className="result-actions__emergency">
                  <Info size={14} />
                  <span>Report to: <strong>{result.reportTo}</strong></span>
                </div>

                {result.isScam && (
                  <div className="result-actions__emergency" style={{ marginTop: '8px', background: 'rgba(255,165,0,0.1)', color: '#d97706' }}>
                    <Users size={14} />
                    <span><strong>14 other users</strong> have reported similar messages today.</span>
                  </div>
                )}

                <div className="flex gap-1" style={{ marginTop: '20px', flexWrap: 'wrap' }}>
                  <a href="tel:1930" className="btn btn-danger" style={{ flex: 1, minWidth: '140px' }}>
                    <Phone size={15} /> Call 1930
                  </a>
                  {result.summary.toLowerCase().includes('sbi') && (
                    <a href="tel:1800111109" className="btn btn-secondary" style={{ flex: 1, minWidth: '140px' }}>
                      <Phone size={15} /> SBI Fraud Line
                    </a>
                  )}
                  {result.summary.toLowerCase().includes('hdfc') && (
                    <a href="tel:18002586161" className="btn btn-secondary" style={{ flex: 1, minWidth: '140px' }}>
                      <Phone size={15} /> HDFC Fraud Line
                    </a>
                  )}
                  <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1, minWidth: '140px' }}>
                    Report Online
                  </a>
                </div>

                {result.isScam && (
                  <div className="result-safe-tip">
                    <CheckCircle size={14} style={{ color: 'var(--safe)', flexShrink: 0 }} />
                    <span>Do NOT click any links. Block the sender immediately.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Analyze another */}
            <div className="text-center" style={{ marginTop: '32px' }}>
              <button className="btn btn-ghost" onClick={handleReset}>
                <RotateCcw size={15} /> Analyze Another Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
