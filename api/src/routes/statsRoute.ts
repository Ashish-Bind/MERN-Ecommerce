import express from 'express'
import { adminOnly } from '../middlewares/auth.js'
import {
  getBarChartStats,
  getDashboardStats,
  getLineChartStats,
  getPieChartStats,
} from '../controllers/statsController.js'

const router = express.Router()

router.get('/dashboard', adminOnly, getDashboardStats)
router.get('/pie', adminOnly, getPieChartStats)
router.get('/bar', adminOnly, getBarChartStats)
router.get('/line', adminOnly, getLineChartStats)

export default router
