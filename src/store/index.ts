import { configureStore } from '@reduxjs/toolkit'
import jobReducer from './jobSlice'
import candidatesReducer from './candidatesSlice'

export const store = configureStore({
  reducer: {
    job: jobReducer,
    candidates: candidatesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
