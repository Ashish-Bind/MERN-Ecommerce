import { Response, Request, NextFunction } from 'express'
import ErrorHandler from '../utils/utility-class.js'
import { Controller } from '../types.js'

export const errorMiddleware = (
  error: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.message ||= 'Internal Server Error'
  error.statusCode ||= 500

  return res
    .status(error.statusCode)
    .json({ success: false, message: error.message })
}

export const trycatch = (func: Controller) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next)
  }
}
