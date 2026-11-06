import express from 'express'
import { exercisesRouter } from './modules/exercises/exercise.routes.js'
export const app = express()

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/v1/exercises', exercisesRouter)
