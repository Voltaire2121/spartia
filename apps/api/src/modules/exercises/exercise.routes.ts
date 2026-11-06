import { Router } from 'express'
import { env } from '../../config/env.js'
import exercises from '../../data/exercises.sample.json' with { type: 'json' }

export const exercisesRouter = Router()

exercisesRouter.get('/', (_req, res) => {
  const data = exercises.map(({ images, ...exercise }) => ({
    ...exercise,
    imageUrls: images.map((path) => new URL(path, env.IMAGE_BASE_URL).href),
  }))

  res.json({ data })
})
