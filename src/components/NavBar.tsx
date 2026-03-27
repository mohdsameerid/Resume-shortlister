import { useLocation, useNavigate } from 'react-router-dom'

const STEPS = [
  { label: 'Job Setup', path: '/setup' },
  { label: 'Upload Resumes', path: '/upload' },
  { label: 'Shortlist', path: '/shortlist' },
]

const WORKFLOW_PATHS = ['/setup', '/upload', '/shortlist']

function stepIndex(pathname: string): number {
  const idx = STEPS.findIndex((s) => s.path === pathname)
  return idx === -1 ? 0 : idx
}

export default function NavBar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isHome = pathname === '/'
  const isWorkflow = WORKFLOW_PATHS.includes(pathname)
  const current = stepIndex(pathname)
  const backPath = current > 0 ? STEPS[current - 1].path : isWorkflow ? '/' : null

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center h-14 gap-6">
        {/* Brand */}
        <button
          onClick={() => navigate('/')}
          className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent tracking-tight shrink-0 select-none hover:opacity-80 transition-opacity"
        >
          ResumeShortlister
        </button>

        {isHome ? (
          <>
            <div className="flex-1" />
            <button
              onClick={() => navigate('/setup')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        ) : (
          <>
            {/* Back */}
            <div className="w-24 shrink-0">
              {backPath && (
                <button
                  onClick={() => navigate(backPath)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {backPath === '/' ? 'Home' : 'Back'}
                </button>
              )}
            </div>

            {/* Step indicator */}
            <nav className="flex-1 flex items-center justify-center">
              <ol className="flex items-center">
                {STEPS.map((step, i) => {
                  const done = i < current
                  const active = i === current

                  return (
                    <li key={step.path} className="flex items-center">
                      {i > 0 && (
                        <div
                          className={[
                            'h-px w-10 mx-2 transition-all duration-500',
                            i <= current
                              ? 'bg-gradient-to-r from-green-400 to-emerald-300'
                              : 'bg-gray-200',
                          ].join(' ')}
                        />
                      )}

                      <div className="flex flex-col items-center gap-0.5">
                        <div
                          className={[
                            'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200',
                            done
                              ? 'bg-green-600 text-white shadow-sm shadow-green-200'
                              : active
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white ring-4 ring-green-100 shadow-sm shadow-green-200'
                              : 'bg-gray-100 text-gray-400',
                          ].join(' ')}
                        >
                          {done ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                              <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            i + 1
                          )}
                        </div>
                        <span
                          className={[
                            'text-xs whitespace-nowrap transition-colors',
                            active ? 'text-green-600 font-semibold' : done ? 'text-gray-500' : 'text-gray-300',
                          ].join(' ')}
                        >
                          {step.label}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </nav>

            <div className="w-24 shrink-0" />
          </>
        )}
      </div>
    </header>
  )
}
