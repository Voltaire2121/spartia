import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  IMAGE_BASE_URL: z
    .url()
    .default(
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/',
    ),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  console.error('❌ Invalid env variables')
  console.error(z.prettifyError(result.error))
  process.exit(1)
}

export const env = result.data
