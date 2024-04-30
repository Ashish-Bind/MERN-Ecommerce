import express from 'express'
import {
  deleteUserById,
  getAllUsers,
  getUserById,
  newUser,
} from '../controllers/userController.js'
import { adminOnly } from '../middlewares/auth.js'

const router = express.Router()

router.post('/new', newUser)
router.get('/all-users', adminOnly, getAllUsers)
router.route('/:userId').get(getUserById).delete(adminOnly, deleteUserById)

export default router
