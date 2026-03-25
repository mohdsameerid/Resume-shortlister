import { useState, type KeyboardEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setJobDescription, setSkills } from '../store/jobSlice'
import { extractSkills } from '../utils/extractSkills'

const SKILL_COLORS = [
  'bg-violet-100 text-violet-800 border-violet-200',
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-teal-100 text-teal-800 border-teal-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-sky-100 text-sky-800 border-sky-200',
]

function skillColor(index: number) {
  return SKILL_COLORS[index % SKILL_COLORS.length]
}

export default function JobSetup() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [jd, setJd] = useState('')
  const [skills, setLocalSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleExtract() {
    if (!jd.trim()) return
    setLoading(true)
    setError('')
    try {
      const extracted = await extractSkills(jd)
      setLocalSkills(extracted)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract skills')
    } finally {
      setLoading(false)
    }
  }

  function removeSkill(index: number) {
    setLocalSkills((prev) => prev.filter((_, i) => i !== index))
  }

  function addSkill() {
    const trimmed = newSkill.trim()
    if (!trimmed || skills.includes(trimmed)) return
    setLocalSkills((prev) => [...prev, trimmed])
    setNewSkill('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') addSkill()
  }

  function handleContinue() {
    dispatch(setJobDescription(jd))
    dispatch(setSkills(skills))
    navigate('/upload')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 py-10 px-4">
      {/* Hero */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
            <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75-4.5a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Set Up Your Job</h1>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
          Paste a job description and let AI extract the required skills automatically.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-5">
        {/* JD Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-800">
              Job Description
            </label>
            {jd.length > 0 && (
              <span className="text-xs text-gray-400 tabular-nums">{jd.length.toLocaleString()} chars</span>
            )}
          </div>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here — requirements, responsibilities, qualifications…"
            rows={10}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none transition-all leading-relaxed"
          />

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleExtract}
              disabled={loading || !jd.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200/60 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Extracting…
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
                  </svg>
                  Extract Skills with AI
                </>
              )}
            </button>
            {loading && (
              <p className="text-xs text-gray-400 italic">This may take a few seconds…</p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mt-0.5 shrink-0 text-red-500">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Skills Card */}
        {(skills.length > 0 || (jd.trim() && !loading)) && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-800">Required Skills</label>
              {skills.length > 0 && (
                <span className="inline-flex items-center justify-center h-5 rounded-full bg-indigo-600 text-white text-xs font-bold px-2 min-w-[1.25rem]">
                  {skills.length}
                </span>
              )}
              <span className="ml-auto text-xs text-gray-400">Click × to remove · type below to add</span>
            </div>

            {skills.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-100 py-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-200 mx-auto mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
                <p className="text-sm text-gray-400">
                  Click <span className="font-semibold text-indigo-500">Extract Skills with AI</span> above, or add skills manually below.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={`${skill}-${i}`}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all hover:scale-105 ${skillColor(i)}`}
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(i)}
                      className="opacity-50 hover:opacity-100 transition-opacity"
                      aria-label={`Remove ${skill}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                        <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a skill manually… (press Enter)"
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-900 placeholder-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              <button
                onClick={addSkill}
                disabled={!newSkill.trim()}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Continue */}
        <div className="flex items-center justify-between pt-1">
          {skills.length > 0 && (
            <p className="text-xs text-gray-400">
              {skills.length} skill{skills.length !== 1 ? 's' : ''} will be used for scoring
            </p>
          )}
          <button
            onClick={handleContinue}
            disabled={!jd.trim() || skills.length === 0}
            className="ml-auto inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Continue to Upload
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
