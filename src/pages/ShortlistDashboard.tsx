import { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { scoreAllCandidates, toggleInterview } from '../store/candidatesSlice'
import type { Candidate } from '../store/candidatesSlice'

// ─── helpers ────────────────────────────────────────────────────────────────

function parseName(fileName: string): string {
  return fileName
    .replace(/\.pdf$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

type Band = 'all' | 'strong' | 'review'

function scoreBand(score: number): 'strong' | 'review' | 'weak' {
  if (score >= 80) return 'strong'
  if (score >= 50) return 'review'
  return 'weak'
}

const bandColors = {
  strong: {
    ring: '#22c55e',
    text: 'text-green-700',
    border: 'border-green-200',
    bg: 'bg-green-50/50',
    badge: 'bg-green-100 text-green-800',
  },
  review: {
    ring: '#f59e0b',
    text: 'text-amber-700',
    border: 'border-amber-200',
    bg: 'bg-amber-50/40',
    badge: 'bg-amber-100 text-amber-800',
  },
  weak: {
    ring: '#ef4444',
    text: 'text-red-600',
    border: 'border-red-200',
    bg: 'bg-red-50/30',
    badge: 'bg-red-100 text-red-700',
  },
}

const avatarPalette = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500',
]

function avatarColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return avatarPalette[h % avatarPalette.length]
}

// ─── CSV export ──────────────────────────────────────────────────────────────

function escapeCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`
}

function exportCSV(candidates: Candidate[]) {
  const headers = ['Name', 'Score', 'Matched Skills', 'Missing Skills', 'AI Reason', 'Interview']
  const rows = candidates
    .filter((c) => c.status === 'done')
    .map((c) => [
      parseName(c.fileName),
      String(c.score ?? ''),
      (c.matched ?? []).join('; '),
      (c.missing ?? []).join('; '),
      c.reason ?? '',
      c.markedForInterview ? 'Yes' : 'No',
    ])

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCell).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'shortlist.csv'
  a.click()
  URL.revokeObjectURL(url)
}

// ─── ScoreRing ───────────────────────────────────────────────────────────────

function ScoreRing({ score, band }: { score: number; band: 'strong' | 'review' | 'weak' }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ

  return (
    <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#f1f5f9" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={bandColors[band].ring}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <span className={`text-sm font-bold ${bandColors[band].text}`}>{score}</span>
    </div>
  )
}

// ─── CandidateCard ───────────────────────────────────────────────────────────

function CandidateCard({ candidate, rank }: { candidate: Candidate; rank: number }) {
  const dispatch = useDispatch<AppDispatch>()
  const name = parseName(candidate.fileName)
  const band = scoreBand(candidate.score ?? 0)

  return (
    <div className={`rounded-2xl border ${bandColors[band].border} ${bandColors[band].bg} bg-white p-5 space-y-4 shadow-sm flex flex-col relative overflow-hidden transition-shadow hover:shadow-md`}>
      {/* Subtle top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${band === 'strong' ? 'bg-green-400' : band === 'review' ? 'bg-amber-400' : 'bg-red-400'}`} />

      {/* Header */}
      <div className="flex items-center gap-3">
        {/* Rank badge */}
        <div className="shrink-0 flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${avatarColor(name)}`}>
            {initials(name)}
          </div>
          <span className="text-xs text-gray-300 font-medium mt-0.5">#{rank}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-400 truncate">{candidate.fileName}</p>
          {candidate.status === 'done' && candidate.score !== undefined && (
            <span className={`inline-block mt-1 text-xs font-semibold rounded-full px-2 py-0.5 ${bandColors[band].badge}`}>
              {band === 'strong' ? 'Strong Match' : band === 'review' ? 'Worth Review' : 'Weak Match'}
            </span>
          )}
        </div>

        {candidate.status === 'loading' && (
          <svg className="animate-spin h-5 w-5 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}

        {candidate.status === 'done' && candidate.score !== undefined && (
          <ScoreRing score={candidate.score} band={band} />
        )}

        {candidate.status === 'error' && (
          <span className="text-xs font-medium text-red-500 bg-red-50 rounded-full px-2 py-1 shrink-0">Error</span>
        )}
      </div>

      {/* Skills */}
      {candidate.status === 'done' && (
        <>
          {(candidate.matched?.length ?? 0) > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Matched</p>
              <div className="flex flex-wrap gap-1.5">
                {candidate.matched!.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 text-xs px-2.5 py-0.5 font-medium">
                    <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(candidate.missing?.length ?? 0) > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-1.5">Missing</p>
              <div className="flex flex-wrap gap-1.5">
                {candidate.missing!.map((s) => (
                  <span key={s} className="inline-block rounded-full bg-gray-100 text-gray-400 text-xs px-2.5 py-0.5 line-through decoration-gray-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {candidate.reason && (
            <p className="text-xs text-gray-500 italic leading-relaxed border-t border-gray-100 pt-3">
              {candidate.reason}
            </p>
          )}
        </>
      )}

      {candidate.status === 'loading' && (
        <div className="space-y-2">
          <div className="h-3 rounded-full bg-gray-100 animate-pulse w-3/4" />
          <div className="h-3 rounded-full bg-gray-100 animate-pulse w-1/2" />
        </div>
      )}

      {candidate.status === 'error' && (
        <p className="text-xs text-red-400 italic">{candidate.error}</p>
      )}

      {/* Interview toggle */}
      {candidate.status === 'done' && (
        <div className="pt-1 mt-auto">
          <button
            onClick={() => dispatch(toggleInterview(candidate.fileName))}
            className={[
              'w-full rounded-xl px-3 py-2.5 text-xs font-semibold transition-all flex items-center justify-center gap-1.5',
              candidate.markedForInterview
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm shadow-green-200'
                : 'bg-gray-50 border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700',
            ].join(' ')}
          >
            {candidate.markedForInterview ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                </svg>
                Marked for Interview
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                  <path fillRule="evenodd" d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
                </svg>
                Mark for Interview
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── ShortlistDashboard ──────────────────────────────────────────────────────

export default function ShortlistDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const candidates = useSelector((s: RootState) => s.candidates.candidates)
  const requiredSkills = useSelector((s: RootState) => s.job.skills)

  const [bandFilter, setBandFilter] = useState<Band>('all')
  const [checkedSkills, setCheckedSkills] = useState<Set<string>>(new Set())

  const isScoring = candidates.some((c) => c.status === 'loading')
  const anyScored = candidates.some((c) => c.status === 'done')

  const scored = candidates.filter((c) => c.status === 'done' && c.score !== undefined)
  const avgScore = scored.length
    ? Math.round(scored.reduce((a, c) => a + c.score!, 0) / scored.length)
    : 0
  const shortlisted = scored.filter((c) => c.score! >= 80).length
  const interviewCount = candidates.filter((c) => c.markedForInterview).length

  const sorted = useMemo(
    () =>
      [...candidates].sort((a, b) => {
        if (a.score === undefined && b.score === undefined) return 0
        if (a.score === undefined) return 1
        if (b.score === undefined) return -1
        return b.score - a.score
      }),
    [candidates],
  )

  const filtered = useMemo(() => {
    return sorted.filter((c) => {
      if (bandFilter === 'strong' && (c.score === undefined || c.score < 80)) return false
      if (bandFilter === 'review' && (c.score === undefined || c.score < 50 || c.score >= 80)) return false
      if (checkedSkills.size > 0) {
        const matched = new Set(c.matched ?? [])
        for (const sk of checkedSkills) {
          if (!matched.has(sk)) return false
        }
      }
      return true
    })
  }, [sorted, bandFilter, checkedSkills])

  function toggleSkill(skill: string) {
    setCheckedSkills((prev) => {
      const next = new Set(prev)
      next.has(skill) ? next.delete(skill) : next.add(skill)
      return next
    })
  }

  const bandButtons: { label: string; value: Band; color: string }[] = [
    { label: 'All', value: 'all', color: '' },
    { label: 'Strong match (80+)', value: 'strong', color: 'text-green-700' },
    { label: 'Review (50–79)', value: 'review', color: 'text-amber-700' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50">
      {/* Action bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-3 shadow-sm">
        <div className="flex-1">
          {candidates.length === 0 ? (
            <p className="text-sm text-gray-400">No resumes loaded — go back and upload some.</p>
          ) : isScoring ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-indigo-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-500">Scoring resumes with AI…</p>
            </div>
          ) : anyScored ? (
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">{scored.length}</span> of {candidates.length} scored
            </p>
          ) : (
            <p className="text-sm text-gray-500">Ready to score {candidates.length} resume{candidates.length !== 1 ? 's' : ''}</p>
          )}
        </div>

        {anyScored && (
          <button
            onClick={() => exportCSV(candidates)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M8.75 2.75a.75.75 0 0 0-1.5 0v5.69L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
              <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
            </svg>
            Export CSV
          </button>
        )}

        {!anyScored && !isScoring && candidates.length > 0 && (
          <button
            onClick={() => dispatch(scoreAllCandidates())}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200/60 hover:from-indigo-700 hover:to-violet-700 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
            </svg>
            Score All with AI
          </button>
        )}

        {isScoring && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-600">
            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Scoring…
          </div>
        )}
      </div>

      {/* Stats bar */}
      {anyScored && (
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Uploaded" value={candidates.length} icon="📄" />
            <StatCard
              label="Strong Matches"
              value={shortlisted}
              icon="🎯"
              colorClass="text-green-700"
              bgClass="bg-green-50"
            />
            <StatCard
              label="Avg Score"
              value={`${avgScore}%`}
              icon="📊"
              colorClass={avgScore >= 80 ? 'text-green-700' : avgScore >= 50 ? 'text-amber-700' : 'text-red-600'}
              bgClass={avgScore >= 80 ? 'bg-green-50' : avgScore >= 50 ? 'bg-amber-50' : 'bg-red-50'}
            />
            <StatCard
              label="For Interview"
              value={interviewCount}
              icon="🗓️"
              colorClass="text-indigo-700"
              bgClass="bg-indigo-50"
            />
          </div>
        </div>
      )}

      <div className="flex gap-6 p-6 max-w-7xl mx-auto">
        {/* Sidebar */}
        {requiredSkills.length > 0 && (
          <aside className="w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm sticky top-20">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Filter by Skill
              </p>
              <div className="space-y-1.5">
                {requiredSkills.map((skill) => (
                  <label key={skill} className="flex items-center gap-2 cursor-pointer group py-0.5">
                    <input
                      type="checkbox"
                      checked={checkedSkills.has(skill)}
                      onChange={() => toggleSkill(skill)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 leading-snug transition-colors">
                      {skill}
                    </span>
                  </label>
                ))}
              </div>
              {checkedSkills.size > 0 && (
                <button
                  onClick={() => setCheckedSkills(new Set())}
                  className="mt-3 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                >
                  Clear filters ({checkedSkills.size})
                </button>
              )}
            </div>
          </aside>
        )}

        {/* Main */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Band filter pills */}
          <div className="flex gap-2 flex-wrap items-center">
            {bandButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setBandFilter(btn.value)}
                className={[
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                  bandFilter === btn.value
                    ? 'bg-gray-900 text-white shadow-sm'
                    : `bg-white border border-gray-200 ${btn.color || 'text-gray-600'} hover:bg-gray-50`,
                ].join(' ')}
              >
                {btn.label}
              </button>
            ))}
            <span className="ml-auto text-sm text-gray-400 font-medium">
              {filtered.length} candidate{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Cards grid */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-gray-200 mx-auto mb-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
              </svg>
              <p className="text-sm font-medium text-gray-400">
                {candidates.length === 0
                  ? 'No resumes uploaded. Go back and upload some.'
                  : 'No candidates match the current filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map((c, idx) => (
                <CandidateCard key={c.fileName} candidate={c} rank={idx + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  colorClass = 'text-gray-800',
  bgClass = 'bg-gray-50',
}: {
  label: string
  value: string | number
  icon: string
  colorClass?: string
  bgClass?: string
}) {
  return (
    <div className={`rounded-xl ${bgClass} px-4 py-3 flex items-center gap-3`}>
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className={`text-xl font-bold ${colorClass}`}>{value}</p>
      </div>
    </div>
  )
}
