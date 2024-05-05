import express from 'express'
import {
  allOrders,
  deleteOrder,
  myOrders,
  newOrder,
  singleOrder,
  updateStatus,
} from '../controllers/orderController.js'
import { adminOnly } from '../middlewares/auth.js'

const router = express.Router()

router.post('/new', newOrder)
router.get('/my-orders', myOrders)
router.get('/all', adminOnly, allOrders)

router.route('/:id').get(singleOrder).patch(updateStatus).delete(deleteOrder)

export default router
