import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { catalogRouter } from './routes/catalog.js'

dotenv.config()

const app = express()

function getClientOrigin(): string {
  if (process.env.CLIENT_ORIGIN) {
    return process.env.CLIENT_ORIGIN
  }

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL

  if (vercelHost) {
    return `https://${vercelHost}`
  }

  return 'http://localhost:5173'
}

app.use(cors({ origin: getClientOrigin() }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', catalogRouter)

export { app }
export default app
