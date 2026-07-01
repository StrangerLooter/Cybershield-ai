import { Shield, Target, Users, Cpu, Globe, Phone, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import './About.css'

const TECH_STACK = [
  { name: 'React + Vite', desc: 'Frontend framework' },
  { name: 'Groq + Llama 3', desc: 'Ultra-fast LLM inference' },
  { name: 'Supabase', desc: 'Database & backend' },
  { name: 'Recharts', desc: 'Analytics charts' },
  { name: 'jsPDF', desc: 'Complaint PDF export' },
  { name: 'jsQR', desc: 'QR code decoding' },
]

export default function About() {
  return (
    <div className="about-page page-wrapper">
      <section className="about-hero">
        <div className="about-hero__glow" />
        <div className="container text-center">
          <div className="section-label" style={{ justifyContent: 'center', margin: '0 auto 20px' }}>
            <Shield size={14} /> About CyberShield AI
          </div>
          <h1>Built for a <span className="gradient-text">Safer Digital India</span></h1>
          <p style={{ maxWidth: '580px', margin: '20px auto 0', fontSize: '1.05rem' }}>
            Every day, thousands of Indians fall victim to cyber fraud. CyberShield AI was built to give every citizen access to expert-level cyber safety guidance — for free.
          </p>
        </div>
      </section>

      <div className="container about-body">
        {/* Mission & Vision */}
        <div className="grid-2" style={{ marginBottom: '40px' }}>
          <div className="card about-mission-card">
            <div className="about-mission-icon"><Target size={24} /></div>
            <h3>Our Mission</h3>
            <p>To make AI-powered cyber fraud detection accessible to every Indian citizen — whether they're a farmer receiving a fake KCC message or a senior citizen targeted by a "digital arrest" scam. CyberShield AI acts as a personal cyber safety expert in your pocket.</p>
          </div>
          <div className="card about-mission-card">
            <div className="about-mission-icon"><Globe size={24} /></div>
            <h3>Our Vision</h3>
            <p>A India where no citizen loses their life savings to cyber fraud because they had access to real-time threat intelligence. We envision CyberShield AI as a core tool for police cyber cells, banks, and government digital literacy programs.</p>
          </div>
        </div>

        {/* Police Collaboration */}
        <div className="card about-police-section" style={{ marginBottom: '40px' }}>
          <div className="about-police-badge">
            <Shield size={36} />
          </div>
          <div>
            <h3>Designed for Police Collaboration</h3>
            <p style={{ marginBottom: '16px' }}>
              CyberShield AI is built with law enforcement needs in mind. Every feature maps directly to the real-world workflow of India's Cyber Crime Cells.
            </p>
            <ul className="about-police-list">
              {[
                'Complaint reports are pre-formatted for FIR documentation',
                'Risk scores align with I4C threat classification standards',
                'Dashboard analytics mirror Cyber Crime Cell reporting formats',
                '1930 helpline integration built into every analysis result',
                'Complaint reference numbers for case tracking',
              ].map(item => (
                <li key={item}>
                  <Shield size={13} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                cybercrime.gov.in <ExternalLink size={12} />
              </a>
              <a href="tel:1930" className="btn btn-ghost btn-sm">
                <Phone size={13} /> 1930 Helpline
              </a>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div style={{ marginBottom: '40px' }}>
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <div className="section-label" style={{ justifyContent: 'center', margin: '0 auto 16px' }}>
              <Cpu size={14} /> Technology Stack
            </div>
            <h2>Built with Modern Technology</h2>
          </div>
          <div className="grid-3">
            {TECH_STACK.map(({ name, desc }) => (
              <div key={name} className="card about-tech-card">
                <div className="about-tech-card__name">{name}</div>
                <div className="about-tech-card__desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/analyzer" className="btn btn-primary btn-lg">
            Try CyberShield AI Now
          </Link>
        </div>
      </div>
    </div>
  )
}
