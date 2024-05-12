import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '../utils/utility-class.js'
import { trycatch } from '../middlewares/error.js'
import { User } from '../models/user.js'

export const newUser = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, photo, gender, _id, dob } = req.body

    let user = await User.findById(_id)

    if (user)
      return res
        .status(200)
        .json({ message: `Welcome ${user.name}`, success: true })

    if (!_id || !name || !email || !photo || !gender || !dob)
      return next(new ErrorHandler('Please enter all fields', 400))

    user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob: new Date(dob),
    })

    res.status(201).json({ success: true, message: `Welcome, ${name}` })
  }
)

export const getAllUsers = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({})

    res.status(201).json({ success: true, users })
  }
)

export const getUserById = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) return next(new ErrorHandler("User doesn't exist", 400))

    res.status(201).json({ success: true, user })
  }
)

export const deleteUserById = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) return next(new ErrorHandler("User doesn't exist", 400))

    await user.deleteOne()

    res.status(201).json({ success: true, message: `User deleted` })
  }
)
