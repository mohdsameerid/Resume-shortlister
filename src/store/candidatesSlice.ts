import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { scoreResume, type ScoreResult } from '../utils/scoreResume'
import type { RootState } from './index'

export type CandidateStatus = 'idle' | 'loading' | 'done' | 'error'

export interface Candidate {
  fileName: string
  rawText: string
  status: CandidateStatus
  score?: number
  matched?: string[]
  missing?: string[]
  reason?: string
  error?: string
  markedForInterview: boolean
}

interface CandidatesState {
  candidates: Candidate[]
}

const initialState: CandidatesState = {
  candidates: [],
}

// Thunk: re-score a single candidate
export const scoreOneCandidate = createAsyncThunk<
  void,
  string,
  { state: RootState }
>('candidates/scoreOne', async (fileName, { getState, dispatch }) => {
  const { candidates } = getState().candidates
  const { jobDescription, skills } = getState().job
  const candidate = candidates.find((c) => c.fileName === fileName)
  if (!candidate) return

  dispatch(setCandidateStatus({ fileName, status: 'loading' }))
  try {
    const result = await scoreResume(candidate.rawText, jobDescription, skills)
    dispatch(setCandidateScore({ fileName, result }))
  } catch (err) {
    dispatch(
      setCandidateError({
        fileName,
        error: err instanceof Error ? err.message : 'Scoring failed',
      }),
    )
  }
})

// Thunk: score all candidates concurrently
export const scoreAllCandidates = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('candidates/scoreAll', async (_, { getState, dispatch }) => {
  const { candidates } = getState().candidates
  const { jobDescription, skills } = getState().job

  await Promise.all(
    candidates.map(async (candidate) => {
      dispatch(setCandidateStatus({ fileName: candidate.fileName, status: 'loading' }))
      try {
        const result = await scoreResume(candidate.rawText, jobDescription, skills)
        dispatch(setCandidateScore({ fileName: candidate.fileName, result }))
      } catch (err) {
        dispatch(
          setCandidateError({
            fileName: candidate.fileName,
            error: err instanceof Error ? err.message : 'Scoring failed',
          }),
        )
      }
    }),
  )
})

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setCandidates(state, action: PayloadAction<Pick<Candidate, 'fileName' | 'rawText'>[]>) {
      state.candidates = action.payload.map((c) => ({
        ...c,
        status: 'idle',
        markedForInterview: false,
      }))
    },
    toggleInterview(state, action: PayloadAction<string>) {
      const c = state.candidates.find((c) => c.fileName === action.payload)
      if (c) c.markedForInterview = !c.markedForInterview
    },
    clearCandidates(state) {
      state.candidates = []
    },
    setCandidateStatus(
      state,
      action: PayloadAction<{ fileName: string; status: CandidateStatus }>,
    ) {
      const c = state.candidates.find((c) => c.fileName === action.payload.fileName)
      if (c) c.status = action.payload.status
    },
    setCandidateScore(
      state,
      action: PayloadAction<{ fileName: string; result: ScoreResult }>,
    ) {
      const c = state.candidates.find((c) => c.fileName === action.payload.fileName)
      if (c) {
        const { score, matched, missing, reason } = action.payload.result
        c.status = 'done'
        c.score = score
        c.matched = matched
        c.missing = missing
        c.reason = reason
      }
    },
    setCandidateError(
      state,
      action: PayloadAction<{ fileName: string; error: string }>,
    ) {
      const c = state.candidates.find((c) => c.fileName === action.payload.fileName)
      if (c) {
        c.status = 'error'
        c.error = action.payload.error
      }
    },
  },
})

export const {
  setCandidates,
  clearCandidates,
  toggleInterview,
  setCandidateStatus,
  setCandidateScore,
  setCandidateError,
} = candidatesSlice.actions

export default candidatesSlice.reducer
