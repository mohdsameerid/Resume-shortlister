import { useNavigate } from 'react-router-dom'

const STEPS = [
  {
    number: '01',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75-4.5a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
      </svg>
    ),
    title: 'Paste the Job Description',
    description: 'Copy-paste any job posting. Our AI reads it and automatically extracts every required skill — no manual tagging needed.',
    color: 'from-green-500 to-emerald-600',
    border: 'border-green-100',
  },
  {
    number: '02',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.25 6a.75.75 0 0 0-1.5 0v4.94l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V9.75Z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Upload Candidate Resumes',
    description: "Drag & drop multiple PDF resumes at once. Text extraction happens entirely in your browser — resumes never leave your device.",
    color: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-100',
  },
  {
    number: '03',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Get AI-Powered Scores',
    description: 'Every resume gets a match score (0–100), matched & missing skills highlighted, and a plain-English summary. Export to CSV in one click.',
    color: 'from-teal-500 to-green-600',
    border: 'border-teal-100',
  },
]

const FEATURES = [
  { icon: '🔒', title: '100% Private', desc: 'Resumes are parsed in your browser. No files are uploaded to any server.' },
  { icon: '⚡', title: 'Instant Scoring', desc: 'All resumes are scored in parallel — get results in seconds, not hours.' },
  { icon: '🎯', title: 'Skill-Based Matching', desc: 'Scores reflect actual skill overlap, not just keyword frequency.' },
  { icon: '📊', title: 'Export & Share', desc: 'Download a clean CSV with scores, matched skills, and AI reasons.' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-green-950 to-emerald-950 text-white">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-green-500/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-green-300 mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            AI-Powered Resume Screening
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Shortlist the right{' '}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              candidates
            </span>
            <br />
            in minutes — not days.
          </h1>

          {/* Subtext */}
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Paste a job description, upload resumes, and let AI score every candidate against your
            requirements. Get ranked results with matched skills and a plain-English summary — instantly.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/setup')}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-green-900/40 hover:from-green-400 hover:to-emerald-500 transition-all hover:scale-105 active:scale-100"
            >
              Get Started — it's free
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-medium text-slate-300 hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              See how it works
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          {/* Trust strip */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            {['No sign-up required', 'Resumes stay on your device', 'Works with any PDF resume', 'Export shortlist to CSV'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-green-500">
                  <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-green-50/50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 mb-4">
              How it works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Three steps to your shortlist
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              No training data, no complex setup. Just paste, upload, and score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className={`relative rounded-2xl border ${step.border} bg-white p-6 shadow-sm hover:shadow-md transition-shadow`}>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-300">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                <span className="text-xs font-bold text-gray-300 tracking-widest uppercase mb-4 block">Step {step.number}</span>

                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} text-white shadow-md mb-5`}>
                  {step.icon}
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/setup')}
              className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-8 py-4 text-sm font-bold text-white hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
            >
              Start shortlisting now
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              Built for speed & privacy
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Everything you need to screen resumes faster, with no compromise on candidate privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="rounded-2xl bg-slate-50 border border-slate-100 p-5 hover:border-green-200 hover:bg-green-50/40 transition-colors group">
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="text-sm font-bold text-gray-900 mb-1.5 group-hover:text-green-700 transition-colors">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
            Ready to find your next great hire?
          </h2>
          <p className="text-green-100 mb-8 leading-relaxed">
            It only takes a minute to set up. No account, no billing, no data stored.
          </p>
          <button
            onClick={() => navigate('/setup')}
            className="inline-flex items-center gap-2 rounded-2xl bg-white text-green-700 px-8 py-4 text-base font-bold shadow-xl hover:bg-green-50 transition-all hover:scale-105 active:scale-100"
          >
            Get Started — it's free
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="py-6 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            ResumeShortlister
          </span>
          <p className="text-xs text-gray-400">AI-powered · 100% in-browser · No account needed</p>
        </div>
      </footer>
    </div>
  )
}
