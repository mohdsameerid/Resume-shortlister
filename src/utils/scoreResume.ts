import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

export interface ScoreResult {
  score: number
  matched: string[]
  missing: string[]
  reason: string
}

export async function scoreResume(
  rawText: string,
  jobDescription: string,
  skills: string[],
): Promise<ScoreResult> {
  const prompt = `You are a technical recruiter. Score the candidate resume against the job description.

Job Description:
${jobDescription}

Required Skills:
${skills.join(', ')}

Resume Text:
${rawText}

Return ONLY valid JSON — no markdown, no code fences, no explanation — in exactly this shape:
{"score":<0-100>,"matched":[<skills found in resume>],"missing":[<skills not found>],"reason":"<1-2 sentence summary>"}
`

  const result = await model.generateContent(prompt)
  const raw = result.response.text().trim()

  // Strip accidental markdown fences
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()

  const parsed = JSON.parse(cleaned) as ScoreResult

  return {
    score: Number(parsed.score),
    matched: Array.isArray(parsed.matched) ? parsed.matched : [],
    missing: Array.isArray(parsed.missing) ? parsed.missing : [],
    reason: String(parsed.reason ?? ''),
  }
}
