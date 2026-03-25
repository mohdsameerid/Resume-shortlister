import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

export async function extractSkills(jobDescription: string): Promise<string[]> {
  const prompt = `Extract the required skills from the following job description. Return ONLY a JSON array of strings, no explanation, no markdown, no code blocks — just the raw JSON array.

Example output format: ["JavaScript", "React", "TypeScript", "REST APIs"]

Job Description:
${jobDescription}`

  const result = await model.generateContent(prompt)
  const raw = result.response.text().trim()

  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()

  const parsed = JSON.parse(cleaned)
  if (!Array.isArray(parsed)) {
    throw new Error('Response was not a JSON array')
  }

  return parsed as string[]
}
