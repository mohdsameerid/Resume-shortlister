import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCandidates } from '../store/candidatesSlice'
import { extractPdfText } from '../utils/extractPdfText'

type ExtractionStatus = 'extracting' | 'done' | 'error'

interface FileEntry {
  file: File
  status: ExtractionStatus
  rawText: string
  error?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ResumeUpload() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [entries, setEntries] = useState<FileEntry[]>([])

  const processFiles = useCallback(async (newFiles: File[]) => {
    const existing = new Set(entries.map((e) => e.file.name))
    const toAdd = newFiles.filter((f) => !existing.has(f.name))
    if (!toAdd.length) return

    const initial: FileEntry[] = toAdd.map((file) => ({
      file,
      status: 'extracting',
      rawText: '',
    }))

    setEntries((prev) => [...prev, ...initial])

    const results = await Promise.allSettled(toAdd.map((file) => extractPdfText(file)))

    setEntries((prev) => {
      const next = [...prev]
      results.forEach((result, idx) => {
        const entryIdx = next.findIndex((e) => e.file.name === toAdd[idx].name)
        if (entryIdx === -1) return
        if (result.status === 'fulfilled') {
          next[entryIdx] = { ...next[entryIdx], status: 'done', rawText: result.value }
        } else {
          next[entryIdx] = {
            ...next[entryIdx],
            status: 'error',
            error: result.reason instanceof Error ? result.reason.message : 'Failed to parse',
          }
        }
      })
      return next
    })
  }, [entries])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
    onDrop: processFiles,
  })

  function removeEntry(name: string) {
    setEntries((prev) => prev.filter((e) => e.file.name !== name))
  }

  function handleStartScoring() {
    const candidates = entries
      .filter((e) => e.status === 'done')
      .map(({ file, rawText }) => ({ fileName: file.name, rawText }))
    dispatch(setCandidates(candidates))
    navigate('/shortlist')
  }

  const doneCount = entries.filter((e) => e.status === 'done').length
  const extractingCount = entries.filter((e) => e.status === 'extracting').length
  const errorCount = entries.filter((e) => e.status === 'error').length
  const hasAnyDone = doneCount > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 py-10 px-4">
      {/* Hero */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
            <path fillRule="evenodd" d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.25 6a.75.75 0 0 0-1.5 0v4.94l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V9.75Z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Resumes</h1>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
          Drop PDF resumes below. Text is extracted entirely in your browser — nothing leaves your device.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={[
            'rounded-2xl border-2 border-dashed px-6 py-14 text-center cursor-pointer transition-all duration-200',
            isDragActive
              ? 'border-indigo-400 bg-indigo-50 scale-[1.01] shadow-lg shadow-indigo-100'
              : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 shadow-sm',
          ].join(' ')}
        >
          <input {...getInputProps()} />
          <div className={`transition-transform duration-200 ${isDragActive ? 'scale-110' : ''}`}>
            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isDragActive ? 'bg-indigo-100' : 'bg-gray-50'}`}>
              <svg
                className={`h-8 w-8 transition-colors ${isDragActive ? 'text-indigo-500' : 'text-gray-300'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
          </div>

          {isDragActive ? (
            <p className="text-base font-semibold text-indigo-600">Release to add these PDFs</p>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-700">
                Drag & drop PDF files here, or{' '}
                <span className="text-indigo-600 underline underline-offset-2 decoration-indigo-300">browse files</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">PDF only · Multiple files supported · 100% local</p>
            </>
          )}
        </div>

        {/* Progress summary */}
        {entries.length > 0 && (
          <div className="flex items-center gap-4 px-1">
            <span className="text-sm text-gray-500 flex-1">
              {extractingCount > 0
                ? `Extracting text from ${extractingCount} file${extractingCount !== 1 ? 's' : ''}…`
                : `${entries.length} file${entries.length !== 1 ? 's' : ''} added`}
            </span>
            {doneCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2.5 py-1">
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                </svg>
                {doneCount} ready
              </span>
            )}
            {errorCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-full px-2.5 py-1">
                {errorCount} error{errorCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* File list */}
        {entries.length > 0 && (
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li
                key={entry.file.name}
                className={[
                  'flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-all',
                  entry.status === 'done'
                    ? 'border-green-100 shadow-sm'
                    : entry.status === 'error'
                    ? 'border-red-100'
                    : 'border-gray-100',
                ].join(' ')}
              >
                {/* PDF badge */}
                <div className={[
                  'shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold tracking-wider',
                  entry.status === 'done'
                    ? 'bg-green-50 text-green-600'
                    : entry.status === 'error'
                    ? 'bg-red-50 text-red-500'
                    : 'bg-indigo-50 text-indigo-500',
                ].join(' ')}>
                  PDF
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{entry.file.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatBytes(entry.file.size)}
                    {entry.status === 'extracting' && (
                      <span className="text-indigo-400"> · Extracting text…</span>
                    )}
                    {entry.status === 'done' && (
                      <span className="text-green-600"> · Ready to score</span>
                    )}
                    {entry.status === 'error' && (
                      <span className="text-red-500"> · {entry.error}</span>
                    )}
                  </p>
                </div>

                {/* Status icon + remove */}
                <div className="shrink-0 flex items-center gap-2">
                  {entry.status === 'extracting' && (
                    <svg className="animate-spin h-4 w-4 text-indigo-400" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {entry.status === 'done' && (
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                    </svg>
                  )}
                  {entry.status === 'error' && (
                    <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                  )}
                  <button
                    onClick={() => removeEntry(entry.file.name)}
                    className="text-gray-200 hover:text-gray-500 transition-colors ml-1"
                    aria-label={`Remove ${entry.file.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Start Scoring CTA */}
        {hasAnyDone && (
          <div className="flex items-center justify-between pt-1">
            {extractingCount > 0 && (
              <p className="text-xs text-gray-400 italic">Waiting for {extractingCount} file{extractingCount !== 1 ? 's' : ''} to finish…</p>
            )}
            <button
              onClick={handleStartScoring}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200/60 hover:from-indigo-700 hover:to-violet-700 transition-all"
            >
              Start Scoring ({doneCount} resume{doneCount !== 1 ? 's' : ''})
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
