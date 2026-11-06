import { z } from 'zod'
import { mkdir, writeFile } from 'node:fs/promises'

const rawExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  force: z.string().nullable(),
  level: z.string(),
  mechanic: z.string().nullable(),
  equipment: z.string().nullable(),
  primaryMuscles: z.array(z.string()),
  secondaryMuscles: z.array(z.string()),
  instructions: z.array(z.string()),
  category: z.string(),
  images: z.array(z.string()),
})

const EXERCISES_URL =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'

const response = await fetch(EXERCISES_URL)

if (!response.ok) throw new Error(`Download failed ${response.status}`)

const data: unknown = await response.json()
const exercises = z.array(rawExerciseSchema).parse(data)
const sample = exercises.slice(0, 20)

const outputUrl = new URL('../data/exercises.sample.json', import.meta.url)
await mkdir(new URL('../data/', import.meta.url), { recursive: true })
await writeFile(outputUrl, JSON.stringify(sample, null, 2) + '\n')

console.log(
  `Received ${exercises.length} exercises!, only ${sample.length} were kept`,
)
console.log(`Exercises saved at ${outputUrl.pathname}`)
