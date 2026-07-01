import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, Zap, QrCode, FileText, GraduationCap, LayoutDashboard,
  ArrowRight, CheckCircle, AlertTriangle, Lock, Mic, Globe,
  Map, Users, Smartphone, ChevronRight, TrendingUp, Eye, Phone
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Home.css'

gsap.registerPlugin(ScrollTrigger)

/* ─── Static data ─── */
const STATS = [
  { value: '11.28L', label: 'Complaints (2023)', icon: Shield },
  { value: '₹7,488Cr', label: 'Reported Cyber Loss', icon: AlertTriangle },
  { value: '47%',     label: 'Financial Frauds',  icon: TrendingUp },
  { value: '1930',    label: 'National Helpline', icon: Phone },
]

const MVP_FEATURES = [
  {
    icon: Zap,
    title: 'AI Scam Analyzer',
    desc: 'Paste any suspicious SMS, WhatsApp, or email. Our AI delivers a detailed risk score and threat analysis in under 5 seconds.',
    color: 'cyan',
    path: '/analyzer',
    tag: 'LIVE',
  },
  {
    icon: QrCode,
    title: 'QR & URL Scanner',
    desc: 'Upload a QR code image or paste any link. Instantly detect phishing domains, shortened URLs, and malicious patterns.',
    color: 'blue',
    path: '/scanner',
    tag: 'LIVE',
  },
  {
    icon: FileText,
    title: 'Complaint Generator',
    desc: 'One click to generate a police-ready complaint report with incident timeline, evidence summary, and reference number. Export as PDF.',
    color: 'purple',
    path: '/complaint',
    tag: 'LIVE',
  },
  {
    icon: GraduationCap,
    title: 'Cyber Academy',
    desc: 'Interactive scam-spotting quiz with XP points, badges, and leaderboard. Learn to identify fraud before it reaches you.',
    color: 'green',
    path: '/academy',
    tag: 'LIVE',
  },
]

const COMING_SOON = [
  { icon: Mic,        title: 'Voice Assistant',     desc: 'Speak your incident aloud — AI transcribes and analyzes in real time.' },
  { icon: Phone,      title: 'AI Call Analyzer',    desc: 'Detect vishing patterns during live phone calls.' },
  { icon: Globe,      title: 'Browser Extension',   desc: 'Auto-flag suspicious pages while you browse.' },
  { icon: Map,        title: 'Fraud Heatmap',       desc: 'City-wise scam intelligence map for law enforcement.' },
  { icon: Users,      title: "Women's Safety Mode", desc: 'Specialized detection for romance scam & digital harassment.' },
  { icon: Smartphone, title: 'Fake App Detector',   desc: 'Identify counterfeit banking apps before you install.' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Paste Your Message',
    desc: 'Copy any suspicious SMS, WhatsApp message, email, or URL into CyberShield AI.',
  },
  {
    step: '02',
    title: 'AI Analyzes Instantly',
    desc: 'Our Groq-powered Llama 3 engine checks for 40+ fraud indicators and assigns a risk score in seconds.',
  },
  {
    step: '03',
    title: 'Report & Stay Safe',
    desc: 'Get clear action steps, generate a complaint report, and report to 1930 — all in one place.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sub-Inspector R. Sharma',
    role: 'Cyber Crime Cell, Delhi Police',
    text: 'CyberShield AI dramatically reduces the time to triage incoming cybercrime complaints. The AI-generated reports are directly usable for FIR documentation.',
  },
  {
    name: 'Priya Mehta',
    role: 'Banking Professional, Mumbai',
    text: 'I received a "KYC update" message from what seemed like my bank. CyberShield flagged it as 94% risk immediately. It literally saved my account.',
  },
  {
    name: 'Dr. A. Kumar',
    role: 'Cyber Law Professor, NLSIU',
    text: 'The awareness quiz feature is exceptional for educating students. It makes digital safety learning engaging and measurable.',
  },
]

/* ─── Particle background ─── */
function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const particles = []
    const count = 80

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < count; i++) {
      particles.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 1.5 + 0.5,
        a:  Math.random() * 0.5 + 0.1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 90, 31, ${p.a})`
        ctx.fill()

        // Connect close particles
        for (let j = i + 1; j < particles.length; j++) {
          const q   = particles[j]
          const dx  = p.x - q.x
          const dy  = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(255, 90, 31, ${0.08 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__particles" />
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, duration = 1800 }) {
  const [display, setDisplay] = useState('0')
  const ref = useRef(null)
  const observerRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    observerRef.current = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observerRef.current.disconnect()

      const isNumeric = /^[\d,]+$/.test(target.replace(/[^0-9]/g, ''))
      if (!isNumeric) { setDisplay(target); return }

      const numStr  = target.replace(/[^0-9]/g, '')
      const numEnd  = parseInt(numStr, 10)
      const prefix  = target.match(/^[^0-9]*/)?.[0] ?? ''
      const suffix  = target.match(/[^0-9]*$/)?.[0] ?? ''

      const start = performance.now()
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased    = 1 - Math.pow(1 - progress, 3)
        const current  = Math.round(eased * numEnd)
        setDisplay(`${prefix}${current.toLocaleString('en-IN')}${suffix}`)
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.2 })

    if (el) observerRef.current.observe(el)
    return () => observerRef.current?.disconnect()
  }, [target, duration])

  return <span ref={ref}>{display}</span>
}



/* ─── Main Component ─── */
export default function Home() {
  const containerRef = useRef(null)

  useEffect(() => {
    // Basic GSAP context for cleanup
    let ctx = gsap.context(() => {
      // 1. Reveal sections on scroll
      gsap.utils.toArray('.section').forEach(section => {
        gsap.fromTo(section, 
          { opacity: 0, y: 40 },
          { 
            opacity: 1, y: 0, 
            duration: 0.8, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
            }
          }
        )
      })

      // 2. Stagger feature cards
      gsap.fromTo('.feature-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%',
          }
        }
      )

      // 3. Stagger step cards (How it works)
      gsap.fromTo('.hiw-step',
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0,
          stagger: 0.2,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.hiw-grid',
            start: 'top 80%',
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="home" ref={containerRef}>
      {/* ── Hero ── */}
      <section className="hero">
        <ParticleField />
        <div className="hero__glow-orb hero__glow-orb--1" />
        <div className="hero__glow-orb hero__glow-orb--2" />

        <div className="container hero__content">
          <div className="hero__badge animate-fade-up">
            <span className="hero__badge-dot" />
            AI-Powered Cyber Fraud Prevention
          </div>

          <h1 className="hero__title animate-fade-up delay-1">
            Your Personal
            <span className="gradient-text"> Cyber Safety</span>
            <br />Assistant
          </h1>

          <p className="hero__subtitle animate-fade-up delay-2">
            Every day, thousands of people receive suspicious messages. Most don't know
            whether they're real or fraud. <strong>CyberShield AI</strong> detects scams,
            explains the risk, and helps you report cybercrime — in seconds.
          </p>

          <div className="hero__ctas animate-fade-up delay-3">
            <Link to="/analyzer" className="btn btn-primary btn-lg">
              <Zap size={18} />
              Analyze a Message
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              Learn More
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="hero__trust animate-fade-up delay-4">
            <CheckCircle size={14} className="hero__trust-icon" />
            <span>Trusted by Cyber Crime Cells</span>
            <span className="hero__trust-sep">•</span>
            <CheckCircle size={14} className="hero__trust-icon" />
            <span>40+ Fraud Indicators</span>
            <span className="hero__trust-sep">•</span>
            <CheckCircle size={14} className="hero__trust-icon" />
            <span>1930 Integration</span>
          </div>
        </div>

        {/* Floating Demo Card */}
        <div className="container">
          <div className="hero__demo animate-fade-up delay-5">
            <div className="hero__demo-header">
              <div className="hero__demo-dots">
                <span /><span /><span />
              </div>
              <span className="hero__demo-title">Live Analysis Preview</span>
            </div>
            <div className="hero__demo-body">
              <div className="hero__demo-input">
                <p className="hero__demo-msg">
                  "Your SBI account will be blocked. Verify your KYC immediately at: sbi-update-kyc.xyz/secure-login"
                </p>
              </div>
              <div className="hero__demo-result">
                <div className="hero__demo-score">
                  <div className="hero__demo-score-ring">
                    <svg viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,51,51,0.15)" strokeWidth="6" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#FF3333"
                        strokeWidth="6" strokeLinecap="round"
                        strokeDasharray="213.6" strokeDashoffset="13"
                        transform="rotate(-90 40 40)"
                        style={{ filter: 'drop-shadow(0 0 8px #FF3333)' }}
                      />
                    </svg>
                    <span>96%</span>
                  </div>
                  <div>
                    <div className="badge badge-critical">⚠ CRITICAL RISK</div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>Phishing Attack Detected</p>
                  </div>
                </div>
                <ul className="hero__demo-flags">
                  {['Fake domain (sbi-update-kyc.xyz)', 'Creates urgency / fear', 'Requests sensitive login', 'Suspicious TLD (.xyz)'].map(f => (
                    <li key={f}>
                      <AlertTriangle size={12} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="hero__demo-actions">
                  <button className="btn btn-danger btn-sm">Report to 1930</button>
                  <button className="btn btn-ghost btn-sm">Generate Complaint</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="section stats-section">
        <div className="container">
          <div className="grid-4">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="stat-card glass-card">
                <div className="stat-card__icon">
                  <Icon size={22} />
                </div>
                <div className="stat-card__value">
                  <AnimatedCounter target={value} />
                </div>
                <div className="stat-card__label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MVP Features ── */}
      <section className="section features-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <div className="section-label">
              <Shield size={14} />
              Core Features
            </div>
            <h2>Everything You Need to Stay Safe Online</h2>
            <p style={{ maxWidth: '560px', margin: '16px auto 0' }}>
              Four AI-powered tools built specifically for Indian citizens and law enforcement to prevent, detect, and respond to cyber fraud.
            </p>
          </div>

          <div className="grid-2 features-grid">
            {MVP_FEATURES.map(({ icon: Icon, title, desc, color, path, tag }) => (
              <Link to={path} key={title} className={`feature-card feature-card--${color}`}>
                <div className="feature-card__tag">{tag}</div>
                <div className={`feature-card__icon feature-card__icon--${color}`}>
                  <Icon size={26} />
                </div>
                <h3 className="feature-card__title">{title}</h3>
                <p className="feature-card__desc">{desc}</p>
                <div className="feature-card__cta">
                  Try Now <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section hiw-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <div className="section-label">
              <Zap size={14} />
              How It Works
            </div>
            <h2>From Suspicion to Safety in 3 Steps</h2>
          </div>

          <div className="hiw-grid">
            {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
              <div key={step} className="hiw-step">
                <div className="hiw-step__number">{step}</div>
                <div className="hiw-step__connector" style={{ display: i < 2 ? 'block' : 'none' }} />
                <h3 className="hiw-step__title">{title}</h3>
                <p className="hiw-step__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coming Soon ── */}
      <section className="section coming-soon-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <div className="section-label">
              <Lock size={14} />
              Product Roadmap
            </div>
            <h2>What's Coming Next</h2>
            <p style={{ maxWidth: '500px', margin: '16px auto 0' }}>
              CyberShield AI is growing. Here's what our team is building for the next version.
            </p>
          </div>

          <div className="grid-3">
            {COMING_SOON.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="coming-card">
                <div className="coming-card__lock">
                  <Lock size={12} />
                </div>
                <div className="coming-card__icon">
                  <Icon size={22} />
                </div>
                <h4 className="coming-card__title">{title}</h4>
                <p className="coming-card__desc">{desc}</p>
                <span className="badge badge-info" style={{ marginTop: '16px' }}>Coming Soon</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <div className="section-label">
              <Users size={14} />
              Testimonials
            </div>
            <h2>Trusted by Citizens & Law Enforcement</h2>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map(({ name, role, text }) => (
              <div key={name} className="testimonial-card glass-card">
                <div className="testimonial-card__quote">"</div>
                <p className="testimonial-card__text">{text}</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <div className="testimonial-card__name">{name}</div>
                    <div className="testimonial-card__role">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <div className="cta-banner__glow" />
          <div className="section-label" style={{ justifyContent: 'center' }}>
            <Shield size={14} />
            Get Protected Now
          </div>
          <h2>Received a Suspicious Message?</h2>
          <p style={{ maxWidth: '500px', margin: '16px auto 24px' }}>
            Don't wait. Paste it into CyberShield AI and know within 5 seconds whether it's a scam — for free.
          </p>
          <div className="flex justify-center gap-2" style={{ flexWrap: 'wrap' }}>
            <Link to="/analyzer" className="btn btn-primary btn-lg">
              <Zap size={18} />
              Analyze a Suspicious Message
            </Link>
            <a href="tel:1930" className="btn btn-secondary btn-lg">
              <Phone size={16} />
              Call 1930 Helpline
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
