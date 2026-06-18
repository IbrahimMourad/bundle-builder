import { Router } from 'express'
import { getCatalog } from '../services/catalogService.js'

export const catalogRouter = Router()

catalogRouter.get('/catalog', async (_req, res) => {
  try {
    const catalog = await getCatalog()
    res.json(catalog)
  } catch (error) {
    console.error('GET /api/catalog failed:', error)
    res.status(500).json({ error: 'Failed to load catalog' })
  }
})
