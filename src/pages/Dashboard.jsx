import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Shield, AlertTriangle, Users, TrendingUp,
  FileText, Activity, Clock
} from 'lucide-react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, CartesianGrid
} from 'recharts'
import { MOCK_STATS, MOCK_REPORTS } from '../services/supabase'
import './Dashboard.css'

const PIE_COLORS = ['#00E5FF', '#FF3333', '#FF8C00', '#8B5CF6', '#00FF88', '#6B7280']

const THREAT_LEVELS = [
  { level: 'CRITICAL', color: 'var(--danger)',  count: 41 },
  { level: 'HIGH',     color: 'var(--warning)', count: 87 },
  { level: 'MEDIUM',   color: 'var(--medium)',  count: 124 },
  { level: 'LOW',      color: 'var(--safe)',    count: 63 },
]

function timeAgo(isoDate) {
  const diff = Math.floor((Date.now() - new Date(isoDate)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function StatCard({ icon: Icon, label, value, change, color }) {
  return (
    <div className="dash-stat-card card">
      <div className="dash-stat-card__header">
        <div className="dash-stat-card__icon" style={{ background: `${color}22`, color }}>
          <Icon size={20} />
        </div>
        {change && (
          <span className="dash-stat-card__change">
            <TrendingUp size={11} /> {change}
          </span>
        )}
      </div>
      <div className="dash-stat-card__value">{value}</div>
      <div className="dash-stat-card__label">{label}</div>
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [reports,   setReports] = useState(MOCK_REPORTS)
  const [stats]                 = useState(MOCK_STATS)

  return (
    <div className="dashboard-page page-wrapper">
      <section className="dashboard-header">
        <div className="container">
          <div className="dashboard-header__inner">
            <div>
              <div className="section-label">
                <LayoutDashboard size={14} /> Live Dashboard
              </div>
              <h1 style={{ marginTop: '12px' }}>Cyber Threat Intelligence</h1>
              <p>Real-time scam detection analytics across India</p>
            </div>
            <div className="dashboard-live-badge">
              <span className="dashboard-live-dot" />
              LIVE
            </div>
          </div>
        </div>
      </section>

      <div className="container dashboard-body">
        {/* ── Stats Row ── */}
        <div className="grid-4 dashboard-stats">
          <StatCard icon={Shield}      label="Scams Detected Today"   value="14,219" change="+12% vs yesterday" color="var(--accent-primary)" />
          <StatCard icon={AlertTriangle} label="Critical Risk Reports" value="41"    change="+5 in last hour"   color="var(--danger)" />
          <StatCard icon={Users}       label="Protected Citizens"     value="1,234" change="+8 today"          color="var(--safe)" />
          <StatCard icon={FileText}    label="Complaints Generated"   value="852"   change="+23 today"         color="var(--warning)" />
        </div>

        {/* ── Charts Row ── */}
        <div className="dashboard-charts-row">
          {/* Scams by Day */}
          <div className="card dashboard-chart-card">
            <h3 className="chart-title">Scams Detected — Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.byDay} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="scams" fill="#00E5FF" radius={[4, 4, 0, 0]} name="Scams">
                  {stats.byDay.map((_, i) => (
                    <Cell key={i} fill={i === 5 ? '#FF3333' : '#00E5FF'} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fraud Types Pie */}
          <div className="card dashboard-chart-card dashboard-chart-card--sm">
            <h3 className="chart-title">Fraud Type Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.byType}
                  cx="50%" cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stats.byType.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="pie-legend">
              {stats.byType.map(({ name, value }, i) => (
                <li key={name} className="pie-legend__item">
                  <span className="pie-legend__dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span>{name}</span>
                  <strong>{value}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Threat Level + Activity ── */}
        <div className="dashboard-bottom-row">
          {/* Threat Level Breakdown */}
          <div className="card">
            <h3 className="chart-title" style={{ marginBottom: '20px' }}>Threat Level Distribution</h3>
            {THREAT_LEVELS.map(({ level, color, count }) => (
              <div key={level} className="threat-bar-row">
                <span className="threat-bar-label" style={{ color }}>{level}</span>
                <div className="threat-bar-track">
                  <div className="threat-bar-fill" style={{
                    width: `${(count / 315) * 100}%`,
                    background: color,
                    boxShadow: `0 0 8px ${color}`,
                  }} />
                </div>
                <span className="threat-bar-count">{count}</span>
              </div>
            ))}
          </div>

          {/* Heatmap (Coming Soon) */}
          <div className="card">
            <div className="chart-title-row">
              <h3 className="chart-title">Law Enforcement Heatmap</h3>
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>Coming Soon</span>
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.03)',
              border: '1px dashed var(--border)',
              borderRadius: '8px',
              height: '180px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '16px',
              textAlign: 'center',
              padding: '20px'
            }}>
              <span style={{ fontSize: '2rem', marginBottom: '8px' }}>🗺️</span>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Geographic visualization of scam hotspots across India for Cyber Crime Cells.
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="chart-title-row">
              <h3 className="chart-title">Recent Reports</h3>
              <span className="flex gap-1 items-center" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Activity size={13} /> Live Feed
              </span>
            </div>
            <ul className="activity-feed">
              {reports.map((r) => (
                <li key={r.id} className="activity-item">
                  <div className="activity-item__dot" style={{
                    background: r.threat_level === 'CRITICAL' ? 'var(--danger)' :
                                r.threat_level === 'HIGH'     ? 'var(--warning)' :
                                r.threat_level === 'MEDIUM'   ? 'var(--medium)' : 'var(--safe)',
                  }} />
                  <div className="activity-item__body">
                    <span className="activity-item__type">{r.attack_type}</span>
                    <span className="activity-item__level" style={{
                      color: r.threat_level === 'CRITICAL' ? 'var(--danger)' : r.threat_level === 'HIGH' ? 'var(--warning)' : 'var(--medium)',
                    }}>{r.threat_level}</span>
                  </div>
                  <span className="activity-item__time">
                    <Clock size={11} /> {timeAgo(r.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Most Common Scam ── */}
        <div className="card dashboard-top-scam">
          <div className="dashboard-top-scam__icon">⚠</div>
          <div>
            <div className="section-label" style={{ marginBottom: '8px' }}>Most Common Scam This Week</div>
            <h3>Phishing — Fake Bank Portals (35% of all reports)</h3>
            <p style={{ fontSize: '0.88rem', marginTop: '8px' }}>
              Fraudsters are sending SMS claiming accounts are blocked with links to fake SBI, HDFC, and ICICI portals.
              Most victims are aged 40–65. Always verify through official bank apps.
            </p>
          </div>
          <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
            Report Now
          </a>
        </div>
      </div>
    </div>
  )
}
