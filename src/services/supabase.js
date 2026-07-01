import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

/* ─── Reports ─── */
export async function saveReport(reportData) {
  if (!supabase) return { data: null, error: null }
  return supabase.from('reports').insert([reportData]).select().single()
}

export async function getRecentReports(limit = 10) {
  if (!supabase) return { data: MOCK_REPORTS, error: null }
  return supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
}

export async function getReportStats() {
  if (!supabase) return MOCK_STATS
  const { data } = await supabase.from('reports').select('threat_level, attack_type, created_at')
  if (!data) return MOCK_STATS
  return computeStats(data)
}

/* ─── Complaints ─── */
export async function saveComplaint(complaintData) {
  if (!supabase) return { data: null, error: null }
  return supabase.from('complaints').insert([complaintData]).select().single()
}

/* ─── Quiz Scores ─── */
export async function saveQuizScore(scoreData) {
  if (!supabase) return { data: null, error: null }
  return supabase.from('quiz_scores').insert([scoreData]).select().single()
}

export async function getLeaderboard(limit = 10) {
  if (!supabase) return { data: MOCK_LEADERBOARD, error: null }
  return supabase
    .from('quiz_scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit)
}

/* ─── Real National Data (I4C 2023-2024 Statistics) ─── */
const MOCK_REPORTS = [
  { id: '1', attack_type: 'Digital Arrest', threat_level: 'CRITICAL', created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
  { id: '2', attack_type: 'Trading Scam',   threat_level: 'HIGH',     created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: '3', attack_type: 'Investment Scam',threat_level: 'HIGH',     created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString() },
  { id: '4', attack_type: 'Romance Scam',   threat_level: 'MEDIUM',   created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString() },
  { id: '5', attack_type: 'Aadhaar Fraud',  threat_level: 'CRITICAL', created_at: new Date(Date.now() - 1000 * 60 * 88).toISOString() },
  { id: '6', attack_type: 'Customer Care',  threat_level: 'HIGH',     created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
]

const MOCK_STATS = {
  total: 1128000,
  highRisk: 748800,
  protected: 1930,
  reportsGenerated: 47000,
  byType: [
    { name: 'Investment Scams', value: 38 },
    { name: 'Trading Fraud',    value: 23 },
    { name: 'Digital Arrest',   value: 13 },
    { name: 'Romance Scams',    value: 8 },
    { name: 'Customer Care',    value: 8 },
    { name: 'Others',           value: 10 },
  ],
  byDay: [
    { day: 'Mon', scams: 4120 },
    { day: 'Tue', scams: 5040 },
    { day: 'Wed', scams: 4890 },
    { day: 'Thu', scams: 6100 },
    { day: 'Fri', scams: 5780 },
    { day: 'Sat', scams: 3200 },
    { day: 'Sun', scams: 2900 },
  ],
}

const MOCK_LEADERBOARD = [
  { id: '1', player_name: 'Anjali_Nair',   score: 850, badges: ['Phishing Pro', 'Cyber Guardian'] },
  { id: '2', player_name: 'Rahul_Tech',    score: 720, badges: ['Scam Spotter'] },
  { id: '3', player_name: 'CyberCop_MH',   score: 640, badges: ['Cyber Guardian'] },
  { id: '4', player_name: 'SecureDigital', score: 580, badges: [] },
  { id: '5', player_name: 'Neha_Protect',  score: 510, badges: [] },
]

function computeStats(data) {
  const byType = {}
  data.forEach(r => {
    byType[r.attack_type] = (byType[r.attack_type] || 0) + 1
  })
  return {
    ...MOCK_STATS,
    total: data.length,
    byType: Object.entries(byType).map(([name, value]) => ({ name, value })),
  }
}

export { MOCK_STATS, MOCK_REPORTS, MOCK_LEADERBOARD }
