import { useState, useRef, useCallback } from 'react'
import { QrCode, Link as LinkIcon, AlertTriangle, CheckCircle, Shield, RotateCcw, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import jsQR from 'jsqr'
import { analyzeURL } from '../services/gemini'
import './QRScanner.css'

const RISK_CONFIG = {
  CRITICAL: { color: 'var(--danger)',  label: 'Critical Risk' },
  HIGH:     { color: 'var(--warning)', label: 'High Risk' },
  MEDIUM:   { color: 'var(--medium)',  label: 'Medium Risk' },
  LOW:      { color: 'var(--safe)',    label: 'Low Risk' },
}

export default function QRScanner() {
  const [mode,       setMode]       = useState('url') // 'url' | 'qr'
  const [urlInput,   setUrlInput]   = useState('')
  const [qrFile,     setQrFile]     = useState(null)
  const [qrPreview,  setQrPreview]  = useState(null)
  const [extractedUrl, setExtractedUrl] = useState('')
  const [loading,    setLoading]    = useState(false)
  const [result,     setResult]     = useState(null)
  const [dragging,   setDragging]   = useState(false)
  const fileInputRef                = useRef(null)
  const resultRef                   = useRef(null)

  const decodeQR = async (file) => {
    return new Promise((resolve, reject) => {
      const img    = new Image()
      const reader = new FileReader()
      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width  = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, canvas.width, canvas.height)
          if (code) resolve(code.data)
          else reject(new Error('No QR code found in image'))
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    setQrFile(file)
    const url = URL.createObjectURL(file)
    setQrPreview(url)
    setResult(null)
    setExtractedUrl('')

    try {
      const decoded = await decodeQR(file)
      setExtractedUrl(decoded)
      toast.success('QR code decoded successfully!')
    } catch {
      toast.error('Could not decode QR code. Try a clearer image.')
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleAnalyze = async () => {
    const url = mode === 'url' ? urlInput.trim() : extractedUrl.trim()
    if (!url) { toast.error('Please provide a URL to analyze'); return }

    setLoading(true)
    setResult(null)
    try {
      const data = await analyzeURL(url)
      setResult(data)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      toast.error(`Analysis failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setUrlInput(''); setQrFile(null); setQrPreview(null)
    setExtractedUrl(''); setResult(null)
  }

  const cfg = result ? (RISK_CONFIG[result.threatLevel] ?? RISK_CONFIG.LOW) : null

  return (
    <div className="qr-page page-wrapper">
      <section className="qr-header">
        <div className="container text-center">
          <div className="section-label" style={{ justifyContent: 'center', margin: '0 auto 20px' }}>
            <QrCode size={14} /> QR & URL Scanner
          </div>
          <h1>Scan Any QR Code or Link</h1>
          <p style={{ maxWidth: '540px', margin: '16px auto 0' }}>
            Upload a QR code image or paste a suspicious URL. Our AI checks for phishing, malware, and fraud patterns instantly.
          </p>
        </div>
      </section>

      <div className="container qr-body">
        {/* Mode Toggle */}
        <div className="qr-mode-toggle">
          <button id="qr-mode-url" className={`qr-mode-btn ${mode === 'url' ? 'qr-mode-btn--active' : ''}`} onClick={() => setMode('url')}>
            <LinkIcon size={15} /> URL / Link
          </button>
          <button id="qr-mode-qr" className={`qr-mode-btn ${mode === 'qr' ? 'qr-mode-btn--active' : ''}`} onClick={() => setMode('qr')}>
            <QrCode size={15} /> QR Code Image
          </button>
        </div>

        <div className="qr-main">
          <div className="card qr-input-card">
            {mode === 'url' ? (
              <>
                <h3 style={{ marginBottom: '16px' }}>Paste a Suspicious URL</h3>
                <input
                  id="url-input"
                  type="url"
                  className="input"
                  placeholder="https://suspicious-link.xyz/verify-account"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                />
                <div className="qr-url-examples">
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Examples:</span>
                  {['bit.ly/3xyz', 'sbi-update.tk/login', '192.168.1.1/bank'].map(ex => (
                    <button key={ex} className="btn btn-ghost btn-sm" onClick={() => setUrlInput('http://' + ex)}>{ex}</button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 style={{ marginBottom: '16px' }}>Upload QR Code Image</h3>
                <div
                  className={`qr-dropzone ${dragging ? 'qr-dropzone--dragging' : ''} ${qrPreview ? 'qr-dropzone--has-file' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => !qrPreview && fileInputRef.current?.click()}
                >
                  {qrPreview ? (
                    <div className="qr-preview">
                      <div className="qr-preview__img-wrap">
                        <img src={qrPreview} alt="QR Preview" className="qr-preview__img" />
                        <div className="qr-scan-line" />
                      </div>
                      {extractedUrl && (
                        <div className="qr-extracted">
                          <span className="badge badge-info">Decoded URL</span>
                          <code className="qr-extracted__url">{extractedUrl}</code>
                          <button className="btn btn-ghost btn-sm" onClick={() => { navigator.clipboard.writeText(extractedUrl); toast.success('Copied!') }}>
                            <Copy size={13} /> Copy
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="qr-dropzone__placeholder">
                      <div className="qr-dropzone__icon"><QrCode size={36} /></div>
                      <p>Drag & drop a QR code image</p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>or click to browse</p>
                      <span className="badge badge-info" style={{ marginTop: '12px' }}>PNG, JPG, WEBP</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => e.target.files[0] && handleFile(e.target.files[0])}
                />
                {qrPreview && (
                  <button className="btn btn-ghost btn-sm" onClick={() => { setQrFile(null); setQrPreview(null); setExtractedUrl(''); setResult(null) }} style={{ marginTop: '8px' }}>
                    <RotateCcw size={13} /> Upload Different Image
                  </button>
                )}
              </>
            )}

            <div style={{ marginTop: '20px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={handleReset}><RotateCcw size={14} /> Reset</button>
              <button
                id="qr-analyze-btn"
                className="btn btn-primary"
                onClick={handleAnalyze}
                disabled={loading || (mode === 'url' ? !urlInput.trim() : !extractedUrl)}
              >
                {loading ? <><div className="spinner" /> Analyzing...</> : <><Shield size={15} /> Analyze</>}
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="card qr-result" ref={resultRef} style={{ borderColor: cfg.glow }}>
              <div className="qr-result__header">
                {result.isScam
                  ? <AlertTriangle size={24} style={{ color: cfg.color }} />
                  : <CheckCircle size={24} style={{ color: 'var(--safe)' }} />}
                <div>
                  <div className={`badge badge-${result.threatLevel?.toLowerCase() === 'critical' ? 'critical' : result.threatLevel?.toLowerCase() === 'high' ? 'high' : result.threatLevel?.toLowerCase() === 'medium' ? 'medium' : 'low'}`}>
                    {cfg.label}
                  </div>
                  <h3 style={{ margin: '8px 0 4px' }}>{result.domain}</h3>
                  <p style={{ fontSize: '0.88rem' }}>{result.summary}</p>
                </div>
                <div className="qr-result__score" style={{ color: cfg.color }}>
                  <span className="qr-result__score-val">{result.riskScore}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/100</span>
                </div>
              </div>

              <div className="qr-result__checks">
                {[
                  { label: 'HTTPS Secure',      val: result.isHTTPS,         good: true },
                  { label: 'Shortened URL',      val: result.isShortenedURL,  good: false },
                  { label: 'IP Address URL',     val: result.isIPAddress,     good: false },
                  { label: 'Suspicious TLD',     val: result.suspiciousTLD,   good: false },
                ].map(({ label, val, good }) => (
                  <div key={label} className="qr-check">
                    {(val === good)
                      ? <CheckCircle size={15} style={{ color: 'var(--safe)' }} />
                      : <AlertTriangle size={15} style={{ color: 'var(--danger)' }} />}
                    <span style={{ fontSize: '0.85rem', color: val !== good ? 'var(--danger)' : 'var(--text-secondary)' }}>{label}</span>
                  </div>
                ))}
              </div>

              {result.indicators?.length > 0 && (
                <ul style={{ listStyle: 'none', marginTop: '16px' }}>
                  {result.indicators.map(({ flag, description }) => (
                    <li key={flag} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '6px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
                      <AlertTriangle size={13} style={{ color: cfg.color, flexShrink: 0, marginTop: '2px' }} />
                      <span><strong style={{ color: 'var(--text-primary)' }}>{flag}:</strong> {description}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
