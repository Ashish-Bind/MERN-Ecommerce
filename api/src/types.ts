import { NextFunction, Request, Response } from 'express'

export type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>
