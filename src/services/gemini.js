/**
 * Gemini AI Service — CyberShield AI
 * Handles all AI interactions: scam analysis & complaint generation
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL_NAME = 'llama-3.3-70b-versatile'

/* ─── Core request helper (Groq) ─── */
async function callGemini(prompt) {
  if (!GROQ_API_KEY) {
    throw new Error('VITE_GROQ_API_KEY is not set in .env')
  }

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message ?? `Groq API error ${res.status}`)
    }

    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content
    if (!text) throw new Error('Empty response from Groq')

    // Strip markdown fences if present
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    try {
      return JSON.parse(cleaned)
    } catch {
      // If JSON parsing fails, try to extract JSON from the text
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      if (jsonMatch) return JSON.parse(jsonMatch[0])
      throw new Error('Failed to parse AI response as JSON')
    }
  } catch (err) {
    throw err
  }
}

/* ─── Scam Analyzer ─── */
export async function analyzeScam(input) {
  const prompt = `You are an expert cybercrime analyst working for India's Cyber Crime Coordination Centre (I4C).
Analyze the following message, URL, or content for signs of cyber fraud.

Return ONLY a valid JSON object with exactly this structure (no extra text):
{
  "riskScore": <integer 0-100>,
  "threatLevel": "<one of: LOW | MEDIUM | HIGH | CRITICAL>",
  "attackType": "<e.g. Phishing, Vishing, OTP Fraud, UPI Scam, Investment Scam, Romance Scam, Identity Theft, Malware>",
  "summary": "<2-3 sentences explaining why this is or isn't a scam in plain English>",
  "indicators": [
    { "flag": "<short flag name>", "description": "<why this is suspicious>" }
  ],
  "actions": ["<action step 1>", "<action step 2>", "<action step 3>"],
  "reportTo": "<e.g. Call 1930, visit cybercrime.gov.in, report to local police>",
  "isScam": <true | false>
}

Keep indicators to 4-6 items. Be concise and accurate for an Indian context.

Content to analyze:
"""
${input}
"""
`
  return callGemini(prompt)
}

/* ─── URL/QR Analyzer ─── */
export async function analyzeURL(url) {
  const prompt = `You are a cybersecurity URL analyst for India's cyber crime prevention team.
Analyze the following URL for signs of phishing, malware, or fraud.

Return ONLY a valid JSON object with exactly this structure:
{
  "riskScore": <integer 0-100>,
  "threatLevel": "<LOW | MEDIUM | HIGH | CRITICAL>",
  "domain": "<extracted domain name>",
  "isHTTPS": <true | false>,
  "isShortenedURL": <true | false>,
  "isIPAddress": <true | false>,
  "suspiciousTLD": <true | false>,
  "suspiciousKeywords": ["<keyword1>", "<keyword2>"],
  "summary": "<2-3 sentence analysis>",
  "indicators": [
    { "flag": "<flag name>", "description": "<explanation>" }
  ],
  "isScam": <true | false>
}

URL to analyze:
"""
${url}
"""
`
  return callGemini(prompt)
}

/* ─── Complaint Generator ─── */
export async function generateComplaint(formData) {
  const prompt = `You are a cybercrime complaint officer helping an Indian citizen file an official complaint.
Generate a formal, professional complaint report based on the information provided.

Return ONLY a valid JSON object with exactly this structure:
{
  "title": "<Short complaint title>",
  "incidentType": "<Type of cybercrime>",
  "referenceNumber": "<Generate realistic ref like CY-2026-${Math.floor(Math.random()*90000+10000)}>",
  "summary": "<3-4 sentence formal summary of the incident>",
  "timeline": [
    "<date/time - event description>",
    "<date/time - event description>"
  ],
  "evidencePoints": [
    "<evidence item 1>",
    "<evidence item 2>"
  ],
  "formalComplaint": "<Full formal complaint text of 200-250 words suitable for submission to police or cybercrime.gov.in. Use formal language. Include all relevant details.>",
  "nextSteps": [
    "<Step 1>",
    "<Step 2>",
    "<Step 3>"
  ],
  "reportingAuthorities": ["cybercrime.gov.in", "Local Cyber Crime Cell", "National Helpline 1930"]
}

Victim Information:
Name: ${formData.name || 'Not provided'}
Phone: ${formData.phone || 'Not provided'}
Email: ${formData.email || 'Not provided'}
Location: ${formData.location || 'India'}

Incident Details:
Date: ${formData.date || 'Recent'}
Amount Lost: ${formData.amount || 'Unknown'}
Description: ${formData.description || ''}

Additional Notes: ${formData.notes || 'None'}
`
  return callGemini(prompt)
}

/* ─── Scam Explanation (for Academy) ─── */
export async function explainScam(scenario) {
  const prompt = `You are a cybersecurity educator teaching Indian citizens about cyber fraud.
Explain why the following message is or isn't a scam in simple, clear language a non-technical person can understand.

Return ONLY a valid JSON object:
{
  "isScam": <true | false>,
  "explanation": "<2-3 sentences in simple language>",
  "keyWarningSign": "<the single most important red flag>",
  "tipToRemember": "<one practical safety tip>"
}

Message/Scenario:
"""
${scenario}
"""
`
  return callGemini(prompt)
}
