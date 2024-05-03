import { NextFunction, Request, Response } from 'express'

export type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>

export type FilterOptions = {
  search?: string
  category?: string
  price?: number
  sort?: string
  page?: number
}

export interface BaseQuery {
  name?: {
    $regex: string
    $options: string
  }
  price?: {
    $lte: number
  }
  category?: string
}
