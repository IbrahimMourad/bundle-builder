import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { catalogRouter } from './routes/catalog.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 3001
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: clientOrigin }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', catalogRouter)

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
