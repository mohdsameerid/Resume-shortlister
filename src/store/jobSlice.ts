import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface JobState {
  jobDescription: string
  skills: string[]
}

const initialState: JobState = {
  jobDescription: '',
  skills: [],
}

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setJobDescription(state, action: PayloadAction<string>) {
      state.jobDescription = action.payload
    },
    setSkills(state, action: PayloadAction<string[]>) {
      state.skills = action.payload
    },
  },
})

export const { setJobDescription, setSkills } = jobSlice.actions
export default jobSlice.reducer
