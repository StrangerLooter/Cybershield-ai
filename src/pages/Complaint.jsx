import { useState, useRef } from 'react'
import { FileText, User, Phone, Mail, MapPin, Calendar, IndianRupee, Download, Copy, CheckCircle, RotateCcw, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateComplaint } from '../services/gemini'
import { saveComplaint } from '../services/supabase'
import './Complaint.css'

const STEPS = ['Victim Details', 'Incident Info', 'Generate & Export']

export default function Complaint() {
  const [step,      setStep]      = useState(0)
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState(null)
  const previewRef                = useRef(null)

  const [form, setForm] = useState({
    name: '', phone: '', email: '', location: '',
    date: '', amount: '', description: '', notes: '',
  })

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleGenerate = async () => {
    if (!form.description.trim()) { toast.error('Please describe the incident'); return }
    setLoading(true)
    try {
      const data = await generateComplaint(form)
      setResult(data)
      setStep(2)
      saveComplaint({ victim_name: form.name, incident_summary: data.summary, generated_text: data.formalComplaint }).catch(() => {})
    } catch (err) {
      toast.error(`Failed to generate: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    if (!previewRef.current) return
    const win = window.open('', '_blank')
    win.document.write(`<html><head><title>CyberShield AI Complaint</title>
      <style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#111;line-height:1.7}
      h1{color:#1a1a2e}h2{color:#333;font-size:1.1rem;border-bottom:1px solid #ddd;padding-bottom:4px}
      .ref{color:#00796B;font-family:monospace;font-weight:bold}
      ul{margin:8px 0}p{margin:8px 0}</style></head><body>`)
    win.document.write(previewRef.current.innerHTML)
    win.document.write('</body></html>')
    win.document.close()
    win.print()
  }

  const copyText = () => {
    if (!result) return
    navigator.clipboard.writeText(result.formalComplaint)
    toast.success('Complaint text copied!')
  }

  const handleReset = () => { setStep(0); setResult(null); setForm({ name:'',phone:'',email:'',location:'',date:'',amount:'',description:'',notes:'' }) }

  return (
    <div className="complaint-page page-wrapper">
      <section className="complaint-header">
        <div className="container text-center">
          <div className="section-label" style={{ justifyContent: 'center', margin: '0 auto 20px' }}>
            <FileText size={14} /> Complaint Generator
          </div>
          <h1>Generate a Police-Ready Complaint</h1>
          <p style={{ maxWidth: '540px', margin: '16px auto 0' }}>
            Fill in your incident details and our AI generates a formal, professional complaint document ready for submission to police or cybercrime.gov.in.
          </p>
        </div>
      </section>

      <div className="container complaint-body">
        {/* Stepper */}
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={s} className={`stepper__step ${i === step ? 'stepper__step--active' : ''} ${i < step ? 'stepper__step--done' : ''}`}>
              <div className="stepper__circle">
                {i < step ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span className="stepper__label">{s}</span>
              {i < STEPS.length - 1 && <div className="stepper__line" />}
            </div>
          ))}
        </div>

        {/* Step 0: Victim Details */}
        {step === 0 && (
          <div className="card complaint-form animate-fade-up">
            <h3 style={{ marginBottom: '24px' }}>Your Details</h3>
            <div className="form-grid">
              <div className="form-field">
                <label><User size={13} /> Full Name</label>
                <input id="victim-name" className="input" placeholder="Your full name" value={form.name} onChange={update('name')} />
              </div>
              <div className="form-field">
                <label><Phone size={13} /> Phone Number</label>
                <input id="victim-phone" className="input" placeholder="+91 98765 43210" value={form.phone} onChange={update('phone')} />
              </div>
              <div className="form-field">
                <label><Mail size={13} /> Email Address</label>
                <input id="victim-email" className="input" type="email" placeholder="your@email.com" value={form.email} onChange={update('email')} />
              </div>
              <div className="form-field">
                <label><MapPin size={13} /> City / Location</label>
                <input id="victim-location" className="input" placeholder="Mumbai, Maharashtra" value={form.location} onChange={update('location')} />
              </div>
            </div>
            <div className="complaint-form__footer">
              <button className="btn btn-primary" onClick={() => setStep(1)}>
                Next: Incident Info <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Incident Info */}
        {step === 1 && (
          <div className="card complaint-form animate-fade-up">
            <h3 style={{ marginBottom: '24px' }}>Incident Information</h3>
            <div className="form-grid">
              <div className="form-field">
                <label><Calendar size={13} /> Date of Incident</label>
                <input id="incident-date" className="input" type="date" value={form.date} onChange={update('date')} />
              </div>
              <div className="form-field">
                <label><IndianRupee size={13} /> Financial Loss (if any)</label>
                <input id="incident-amount" className="input" placeholder="₹25,000 or 'None'" value={form.amount} onChange={update('amount')} />
              </div>
            </div>
            <div className="form-field" style={{ marginTop: '16px' }}>
              <label>Description of Incident *</label>
              <textarea
                id="incident-description"
                className="input"
                rows={6}
                placeholder="Describe what happened in detail. Include: how contact was made, what was asked, what actions you took, any links clicked or payments made..."
                value={form.description}
                onChange={update('description')}
              />
            </div>
            <div className="form-field" style={{ marginTop: '16px' }}>
              <label>Additional Notes / Evidence</label>
              <textarea
                id="incident-notes"
                className="input"
                rows={3}
                placeholder="Screenshots taken, phone numbers involved, bank transaction IDs, email addresses..."
                value={form.notes}
                onChange={update('notes')}
              />
            </div>
            <div className="complaint-form__footer">
              <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
              <button
                id="generate-complaint-btn"
                className="btn btn-primary"
                onClick={handleGenerate}
                disabled={loading || !form.description.trim()}
              >
                {loading ? <><div className="spinner" /> Generating...</> : <><FileText size={15} /> Generate Complaint</>}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Result */}
        {step === 2 && result && (
          <div className="animate-fade-up">
            {/* Export Bar */}
            <div className="complaint-export-bar">
              <div>
                <span className="badge badge-low"><CheckCircle size={12} /> Generated</span>
                <code className="complaint-ref">{result.referenceNumber}</code>
              </div>
              <div className="flex gap-1">
                <button className="btn btn-ghost btn-sm" onClick={copyText}><Copy size={14} /> Copy Text</button>
                <button id="print-complaint-btn" className="btn btn-primary btn-sm" onClick={handlePrint}><Download size={14} /> Download / Print</button>
              </div>
            </div>

            {/* Preview */}
            <div className="card complaint-preview" ref={previewRef}>
              <div className="complaint-preview__letterhead">
                <div>
                  <h2 style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#1a1a2e', margin: 0 }}>CYBERCRIME COMPLAINT REPORT</h2>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>Generated via CyberShield AI | Reference: {result.referenceNumber}</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#666' }}>
                  <p>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p>To: The Cyber Crime Cell</p>
                </div>
              </div>

              <h2 className="complaint-preview__section-title">Subject: {result.title}</h2>

              <div className="complaint-preview__meta">
                <span><strong>Incident Type:</strong> {result.incidentType}</span>
                <span><strong>Victim:</strong> {form.name || 'Complainant'}</span>
                <span><strong>Location:</strong> {form.location || 'India'}</span>
              </div>

              <h2 className="complaint-preview__section-title">Summary</h2>
              <p style={{ fontFamily: 'Georgia, serif', lineHeight: 1.8 }}>{result.summary}</p>

              {result.timeline?.length > 0 && (
                <>
                  <h2 className="complaint-preview__section-title">Incident Timeline</h2>
                  <ul>{result.timeline.map((t, i) => <li key={i} style={{ marginBottom: '6px', fontSize: '0.9rem' }}>{t}</li>)}</ul>
                </>
              )}

              {result.evidencePoints?.length > 0 && (
                <>
                  <h2 className="complaint-preview__section-title">Evidence</h2>
                  <ul>{result.evidencePoints.map((e, i) => <li key={i} style={{ marginBottom: '6px', fontSize: '0.9rem' }}>{e}</li>)}</ul>
                </>
              )}

              <h2 className="complaint-preview__section-title">Formal Complaint</h2>
              <div className="complaint-preview__formal">{result.formalComplaint}</div>

              {result.nextSteps?.length > 0 && (
                <>
                  <h2 className="complaint-preview__section-title">Recommended Next Steps</h2>
                  <ol style={{ paddingLeft: '20px' }}>{result.nextSteps.map((s, i) => <li key={i} style={{ marginBottom: '6px', fontSize: '0.9rem' }}>{s}</li>)}</ol>
                </>
              )}

              <div className="complaint-preview__footer">
                <p>Report this complaint at: <strong>cybercrime.gov.in</strong> | Helpline: <strong>1930</strong></p>
              </div>
            </div>

            <div className="text-center" style={{ marginTop: '24px' }}>
              <button className="btn btn-ghost" onClick={handleReset}><RotateCcw size={14} /> New Complaint</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
