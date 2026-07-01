import { useState } from 'react'
import { GraduationCap, CheckCircle, XCircle, AlertTriangle, Zap, Trophy, Star, RotateCcw, ChevronRight } from 'lucide-react'
import { QUIZ_DATA, BADGES } from '../data/quizData'
import { saveQuizScore, getLeaderboard, MOCK_LEADERBOARD } from '../services/supabase'
import toast from 'react-hot-toast'
import './Academy.css'

export default function Academy() {
  const [phase,       setPhase]       = useState('intro')  // intro | quiz | result
  const [current,    setCurrent]     = useState(0)
  const [answered,   setAnswered]    = useState(null)   // null | true | false
  const [score,      setScore]       = useState(0)
  const [xp,         setXp]         = useState(0)
  const [correct,    setCorrect]    = useState(0)
  const [playerName, setPlayerName] = useState('')
  const [earnedBadges, setEarnedBadges] = useState([])
  const [leaderboard, setLeaderboard]   = useState(MOCK_LEADERBOARD)

  const q = QUIZ_DATA[current]

  const handleAnswer = (answer) => {
    if (answered !== null) return
    setAnswered(answer)
    const isCorrect = answer === q.isScam
    if (isCorrect) {
      setScore(s => s + 10)
      setXp(x => x + q.xp)
      setCorrect(c => c + 1)
      toast.success(`+${q.xp} XP! Correct!`, { icon: '⚡' })
    } else {
      toast.error('Incorrect — read the explanation below', { icon: '📖' })
    }
  }

  const handleNext = () => {
    if (current < QUIZ_DATA.length - 1) {
      setCurrent(c => c + 1)
      setAnswered(null)
    } else {
      // Calculate badges
      const earned = BADGES.filter(b => {
        if (b.id === 'perfect_score') return correct + (answered === q.isScam ? 1 : 0) === QUIZ_DATA.length
        if (b.id === 'cyber_guardian') return xp + q.xp >= 200
        return correct + 1 >= b.threshold
      })
      setEarnedBadges(earned)
      setPhase('result')
    }
  }

  const handleSaveScore = async () => {
    if (!playerName.trim()) { toast.error('Enter your name first'); return }
    try {
      await saveQuizScore({ player_name: playerName, score: xp, badges: earnedBadges.map(b => b.name) })
      toast.success('Score saved to leaderboard!')
    } catch {
      toast.error('Could not save score')
    }
  }

  const handleRestart = () => {
    setPhase('intro'); setCurrent(0); setAnswered(null)
    setScore(0); setXp(0); setCorrect(0); setEarnedBadges([])
  }

  const progress = ((current + (answered !== null ? 1 : 0)) / QUIZ_DATA.length) * 100

  return (
    <div className="academy-page page-wrapper">
      <section className="academy-header">
        <div className="container text-center">
          <div className="section-label" style={{ justifyContent: 'center', margin: '0 auto 20px' }}>
            <GraduationCap size={14} /> Cyber Academy
          </div>
          <h1>Can You Spot the Scam?</h1>
          <p style={{ maxWidth: '520px', margin: '16px auto 0' }}>
            Test your cyber fraud awareness with real-world scenarios. Earn XP, badges, and become a Cyber Guardian.
          </p>
        </div>
      </section>

      <div className="container academy-body">
        {/* ── INTRO ── */}
        {phase === 'intro' && (
          <div className="academy-intro animate-fade-up">
            <div className="academy-intro__stats">
              {[{ icon: '❓', val: QUIZ_DATA.length, label: 'Questions' },
                { icon: '⚡', val: '300+',           label: 'Total XP Available' },
                { icon: '🏆', val: BADGES.length,    label: 'Badges to Earn' }].map(({ icon, val, label }) => (
                <div key={label} className="academy-stat-pill">
                  <span>{icon}</span>
                  <strong>{val}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{label}</span>
                </div>
              ))}
            </div>
            <div className="card academy-intro__card">
              <div className="academy-badges-preview">
                {BADGES.map(b => (
                  <div key={b.id} className="academy-badge-chip">
                    <span>{b.icon}</span>
                    <span>{b.name}</span>
                  </div>
                ))}
              </div>
              <h3 style={{ margin: '24px 0 12px' }}>How to Play</h3>
              <ul className="academy-rules">
                <li><CheckCircle size={14} /> Read each message carefully</li>
                <li><CheckCircle size={14} /> Decide: Is it a SCAM or SAFE?</li>
                <li><CheckCircle size={14} /> Earn XP for correct answers</li>
                <li><CheckCircle size={14} /> Read the explanation to learn</li>
                <li><CheckCircle size={14} /> Save your score to the leaderboard</li>
              </ul>
              <button className="btn btn-primary btn-lg" style={{ marginTop: '28px', width: '100%' }} onClick={() => setPhase('quiz')}>
                <Zap size={18} /> Start Quiz
              </button>
            </div>

            {/* Leaderboard */}
            <div className="card academy-leaderboard">
              <h3 style={{ marginBottom: '20px' }}><Trophy size={18} style={{ color: 'gold', verticalAlign: 'middle' }} /> Leaderboard</h3>
              <table className="leaderboard-table">
                <thead><tr><th>#</th><th>Player</th><th>XP</th><th>Badges</th></tr></thead>
                <tbody>
                  {leaderboard.map((p, i) => (
                    <tr key={p.id} className={i === 0 ? 'leaderboard-row--gold' : ''}>
                      <td className="leaderboard-rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                      <td>{p.player_name}</td>
                      <td><strong style={{ color: 'var(--accent-primary)' }}>{p.score} XP</strong></td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.badges?.length ?? 0} badges</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── QUIZ ── */}
        {phase === 'quiz' && (
          <div className="quiz-container animate-fade-up">
            {/* Header */}
            <div className="quiz-top">
              <div className="quiz-progress-bar">
                <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="quiz-meta">
                <span className="badge badge-info">Question {current + 1} / {QUIZ_DATA.length}</span>
                <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>⚡ {xp} XP</span>
                <span className="badge badge-low">✓ {correct} correct</span>
              </div>
            </div>

            {/* Card */}
            <div className={`quiz-card card ${answered !== null ? (answered === q.isScam ? 'quiz-card--correct' : 'quiz-card--wrong') : ''}`}>
              <div className="quiz-card__category badge badge-info" style={{ marginBottom: '16px' }}>
                {q.category}
              </div>

              <h3 style={{ marginBottom: '20px', fontSize: '1rem' }}>Is this a scam?</h3>

              <div className="quiz-message">
                <div className="quiz-message__bubble">
                  {q.message}
                </div>
              </div>

              {/* Answer Buttons */}
              {answered === null ? (
                <div className="quiz-buttons">
                  <button id="quiz-scam-btn" className="btn btn-danger quiz-btn" onClick={() => handleAnswer(true)}>
                    <AlertTriangle size={18} /> YES, It's a Scam
                  </button>
                  <button id="quiz-safe-btn" className="quiz-btn quiz-btn--safe" onClick={() => handleAnswer(false)}>
                    <CheckCircle size={18} /> NO, It's Safe
                  </button>
                </div>
              ) : (
                <div className={`quiz-verdict ${answered === q.isScam ? 'quiz-verdict--correct' : 'quiz-verdict--wrong'}`}>
                  <div className="quiz-verdict__icon">
                    {answered === q.isScam ? <CheckCircle size={28} /> : <XCircle size={28} />}
                  </div>
                  <div>
                    <strong>{answered === q.isScam ? `Correct! +${q.xp} XP` : 'Incorrect!'}</strong>
                    <p style={{ marginTop: '8px', fontSize: '0.88rem', lineHeight: '1.6' }}>{q.explanation}</p>
                    <div className="quiz-verdict__tip">
                      <Zap size={13} />
                      <strong>Key Sign:</strong> {q.keyWarningSign}
                    </div>
                    <div className="quiz-verdict__tip" style={{ background: 'var(--safe-dim)', borderColor: 'var(--safe-glow)' }}>
                      <Star size={13} style={{ color: 'var(--safe)' }} />
                      <strong>Tip:</strong> {q.tip}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {answered !== null && (
              <div className="text-center" style={{ marginTop: '20px' }}>
                <button className="btn btn-primary" onClick={handleNext}>
                  {current < QUIZ_DATA.length - 1 ? (<>Next Question <ChevronRight size={15} /></>) : (<><Trophy size={15} /> See Results</>)}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── RESULT ── */}
        {phase === 'result' && (
          <div className="quiz-result animate-fade-up">
            <div className="quiz-result__hero card">
              <div className="quiz-result__trophy">🏆</div>
              <h2>Quiz Complete!</h2>
              <div className="quiz-result__scores">
                <div>
                  <div className="quiz-result__big-score" style={{ color: 'var(--accent-primary)' }}>{xp}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total XP</div>
                </div>
                <div>
                  <div className="quiz-result__big-score" style={{ color: 'var(--safe)' }}>{correct}/{QUIZ_DATA.length}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Correct Answers</div>
                </div>
                <div>
                  <div className="quiz-result__big-score" style={{ color: 'var(--warning)' }}>{Math.round(correct / QUIZ_DATA.length * 100)}%</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Accuracy</div>
                </div>
              </div>

              {earnedBadges.length > 0 && (
                <div className="quiz-result__badges">
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Badges Earned:</p>
                  <div className="quiz-result__badges-list">
                    {earnedBadges.map(b => (
                      <div key={b.id} className="result-badge">
                        <span className="result-badge__icon">{b.icon}</span>
                        <span className="result-badge__name">{b.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="quiz-result__save">
                <input className="input" placeholder="Enter your name for leaderboard" value={playerName} onChange={e => setPlayerName(e.target.value)} style={{ flex: 1 }} />
                <button className="btn btn-primary" onClick={handleSaveScore}>
                  <Trophy size={15} /> Save Score
                </button>
              </div>

              <div className="flex gap-2 justify-center" style={{ marginTop: '16px', flexWrap: 'wrap' }}>
                <button className="btn btn-ghost" onClick={handleRestart}>
                  <RotateCcw size={14} /> Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
