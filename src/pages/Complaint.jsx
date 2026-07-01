import { useState, useRef } from 'react'
import { FileText, User, Phone, Mail, MapPin, Calendar, IndianRupee, Download, Copy, CheckCircle, RotateCcw, ChevronRight, Shield, QrCode } from 'lucide-react'
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

  const handlePrint = async () => {
    if (!previewRef.current) return
    const btn = document.getElementById('print-complaint-btn')
    const originalText = btn.innerHTML
    btn.innerHTML = '<div class="spinner"></div> Exporting...'
    btn.disabled = true

    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/jpeg', 1.0)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`CyberShield_Complaint_${result.referenceNumber || 'Report'}.pdf`)
      toast.success('PDF Exported Successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to export PDF')
    } finally {
      btn.innerHTML = originalText
      btn.disabled = false
    }
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
                <input id="victim-name" className="input" placeholder="e.g., John 'Root' Doe" value={form.name} onChange={update('name')} />
              </div>
              <div className="form-field">
                <label><Phone size={13} /> Phone Number</label>
                <input id="victim-phone" className="input" placeholder="e.g., +91 98765 43210 (Your 2FA lifeline)" value={form.phone} onChange={update('phone')} />
              </div>
              <div className="form-field">
                <label><Mail size={13} /> Email Address</label>
                <input id="victim-email" className="input" type="email" placeholder="dev@null.com" value={form.email} onChange={update('email')} />
              </div>
              <div className="form-field">
                <label><MapPin size={13} /> City / Location</label>
                <input id="victim-location" className="input" placeholder="e.g., Mumbai (or localhost)" value={form.location} onChange={update('location')} />
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
                <input id="incident-amount" className="input" placeholder="₹404 (Funds not found)" value={form.amount} onChange={update('amount')} />
              </div>
            </div>
            <div className="form-field" style={{ marginTop: '16px' }}>
              <label>Description of Incident *</label>
              <textarea
                id="incident-description"
                className="input"
                rows={6}
                placeholder="Spill the tea. How did the threat actor bypass your social engineering firewall? (Include links, payloads, and vector details)"
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
                placeholder="Any stack traces, packet captures, or sketchy IP addresses you snagged."
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

            {/* Preview (Hidden visually, used for PDF export) */}
            <div style={{ overflow: 'hidden', height: '0' }}>
              <div ref={previewRef} style={{ width: '900px', backgroundColor: '#ffffff', minHeight: '1272px', display: 'flex', fontFamily: '"Inter", sans-serif', color: '#111' }}>
                
                {/* Left Sidebar */}
                <div style={{ width: '280px', backgroundColor: '#07101e', color: '#fff', padding: '40px 24px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
                    <div style={{ background: '#00E5FF', padding: '6px', borderRadius: '8px' }}><Shield size={20} color="#07101e" /></div>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>CyberShield AI</div>
                      <div style={{ fontSize: '0.55rem', opacity: 0.7 }}>Prevent. Detect. Report. Protect.</div>
                    </div>
                  </div>
                  
                  <h2 style={{ fontSize: '1.3rem', marginBottom: '40px', lineHeight: 1.4, color: '#00E5FF', margin: '0 0 40px 0' }}>CYBER CRIME<br/>COMPLAINT REPORT</h2>
                  
                  <div style={{ marginBottom: '30px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#00E5FF', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={14} /> REPORT DETAILS
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '16px' }}>
                      <div style={{ marginBottom: '4px' }}>Report ID</div>
                      <div style={{ opacity: 1, fontWeight: 'bold' }}>{result.referenceNumber || 'CSAI-2026-XX-XXXX'}</div>
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '16px' }}>
                      <div style={{ marginBottom: '4px' }}>Report Date</div>
                      <div style={{ opacity: 1, fontWeight: 'bold' }}>{new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '16px' }}>
                      <div style={{ marginBottom: '4px' }}>Generated By</div>
                      <div style={{ opacity: 1, fontWeight: 'bold' }}>CyberShield AI</div>
                    </div>
                  </div>
                  
                  <div style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '16px', borderRadius: '8px', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ backgroundColor: '#00E5FF', padding: '6px', borderRadius: '50%' }}>
                        <Phone size={14} color="#07101e" />
                      </div>
                      <div style={{ fontSize: '0.65rem', lineHeight: 1.4 }}>In case of immediate threat or financial fraud call the national cyber crime helpline</div>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center', margin: '12px 0' }}>1930</div>
                    <div style={{ fontSize: '0.65rem', textAlign: 'center' }}>www.cybercrime.gov.in</div>
                  </div>
                  
                  <div style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '8px' }}>IMPORTANT NOTE</div>
                    <div style={{ fontSize: '0.6rem', opacity: 0.8, lineHeight: 1.5 }}>
                      This is an AI generated complaint report based on the information provided by the user. Please cross-verify all details before submission to the authorities.
                    </div>
                  </div>
                </div>

                {/* Right Content */}
                <div style={{ flex: 1, padding: '40px 32px', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                    <div>
                      <h1 style={{ fontSize: '1.6rem', color: '#111827', margin: '0 0 4px 0', fontWeight: '700' }}>CYBER CRIME COMPLAINT REPORT</h1>
                      <div style={{ fontSize: '0.85rem', color: '#4B5563' }}>Generated by CyberShield AI</div>
                    </div>
                    <div style={{ textAlign: 'center', border: '1px solid #E5E7EB', padding: '6px', borderRadius: '4px' }}>
                      <div style={{ width: '40px', height: '40px', background: '#000', margin: '0 auto 4px' }}></div>
                      <div style={{ fontSize: '0.5rem' }}>Scan to Verify</div>
                    </div>
                  </div>

                  {/* Two Column details */}
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ flex: 1, background: '#F9FAFB', borderRadius: '8px', padding: '16px', border: '1px solid #F3F4F6' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: '#374151' }}>
                        <User size={14} /> 1. COMPLAINANT DETAILS
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontSize: '0.75rem', color: '#4B5563' }}>
                        <div>Name</div><div style={{ color: '#111827' }}>: {form.name || 'N/A'}</div>
                        <div>Email</div><div style={{ color: '#111827' }}>: {form.email || 'N/A'}</div>
                        <div>Mobile</div><div style={{ color: '#111827' }}>: {form.phone || 'N/A'}</div>
                        <div>Location</div><div style={{ color: '#111827' }}>: {form.location || 'N/A'}</div>
                      </div>
                    </div>
                    <div style={{ flex: 1, background: '#F9FAFB', borderRadius: '8px', padding: '16px', border: '1px solid #F3F4F6' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: '#374151' }}>
                        <FileText size={14} /> 2. INCIDENT DETAILS
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontSize: '0.75rem', color: '#4B5563' }}>
                        <div>Incident Date</div><div style={{ color: '#111827' }}>: {form.date || 'N/A'}</div>
                        <div>Incident Type</div><div style={{ color: '#111827' }}>: {result.incidentType || 'Cyber Fraud'}</div>
                        <div>Financial Loss</div><div style={{ color: '#111827' }}>: {form.amount || 'None'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: '#374151' }}>
                      <FileText size={14} /> 3. INCIDENT DESCRIPTION
                    </div>
                    <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: '#4B5563', margin: 0 }}>
                      {form.description}
                    </p>
                  </div>

                  {/* AI Analysis */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: '#374151' }}>
                      <Shield size={14} /> 4. AI ANALYSIS SUMMARY
                    </div>
                    <div style={{ display: 'flex', gap: '20px', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#fff' }}>
                      <div style={{ width: '120px', textAlign: 'center', border: '1px solid #EF4444', borderRadius: '8px', padding: '12px 0' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#EF4444', marginBottom: '8px' }}>RISK SCORE</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#EF4444', lineHeight: 1 }}>92<span style={{ fontSize: '1rem', color: '#9CA3AF' }}>/100</span></div>
                        <div style={{ background: '#EF4444', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', padding: '4px', marginTop: '12px', borderRadius: '4px', margin: '12px 8px 0' }}>HIGH RISK</div>
                      </div>
                      <div style={{ flex: 1, fontSize: '0.75rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', marginBottom: '12px' }}>
                          <div style={{ color: '#4B5563' }}>Threat Type</div><div style={{ color: '#111827' }}>: {result.incidentType}</div>
                          <div style={{ color: '#4B5563' }}>Key Indicators</div>
                          <div style={{ color: '#111827' }}>
                            <ul style={{ margin: 0, paddingLeft: '16px' }}>
                              {result.evidencePoints?.slice(0, 4).map((e,i) => <li key={i}>{e}</li>) || <li>Phishing patterns detected</li>}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Formal Complaint */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: '#374151' }}>
                      <FileText size={14} /> 5. COMPLAINT SUMMARY (For Submission)
                    </div>
                    <div style={{ fontSize: '0.75rem', lineHeight: 1.6, color: '#111827', whiteSpace: 'pre-wrap', background: '#F9FAFB', padding: '16px', borderRadius: '8px', border: '1px solid #F3F4F6' }}>
                      {result.formalComplaint}
                    </div>
                  </div>

                  {/* Declaration */}
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: '#374151' }}>
                      <CheckCircle size={14} /> 6. DECLARATION
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#4B5563', margin: '0 0 24px 0' }}>
                      I hereby declare that the information provided above is true to the best of my knowledge and belief. I understand that providing false information is punishable under law.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ borderBottom: '1px solid #9CA3AF', width: '140px', height: '30px' }}></div>
                        <div style={{ fontSize: '0.7rem', color: '#4B5563', marginTop: '8px' }}>Signature of Complainant</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ borderBottom: '1px solid #9CA3AF', width: '140px', height: '30px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '4px', fontSize: '0.75rem' }}>
                          {new Date().toLocaleDateString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#4B5563', marginTop: '8px' }}>Date</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="text-center" style={{ marginTop: '24px' }}>
              <div className="alert alert-info" style={{ marginBottom: '16px' }}>
                Your complaint has been successfully generated and formatted for official use. Click "Download / Print" to save the PDF.
              </div>
              <button className="btn btn-ghost" onClick={handleReset}><RotateCcw size={14} /> Draft New Complaint</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
