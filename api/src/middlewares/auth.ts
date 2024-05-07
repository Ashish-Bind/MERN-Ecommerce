import { User } from '../models/user.js'
import ErrorHandler from '../utils/utility-class.js'
import { trycatch } from './error.js'

export const adminOnly = trycatch(async (req, res, next) => {
  const { id } = req.query

  if (!id) return next(new ErrorHandler('Login as admin to proceed', 401))

  const user = await User.findById(id)

  if (!user) return next(new ErrorHandler(`User doesn't exist`, 401))

  if (user.role !== 'admin')
    return next(new ErrorHandler(`Unauthorized access as Admin`, 403))

  next()
})
