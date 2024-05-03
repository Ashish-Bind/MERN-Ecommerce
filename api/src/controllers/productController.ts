import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '../utils/utility-class.js'
import { trycatch } from '../middlewares/error.js'
import { Product } from '../models/product.js'
import { rm } from 'fs'
import { BaseQuery, FilterOptions } from '../types.js'

export const newProduct = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, stock, category } = req.body

    const photo = req.file

    if (!photo) return next(new ErrorHandler('Please add Photo', 400))

    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log('Deleted')
      })
      return next(new ErrorHandler('Please enter all Fields', 400))
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo?.path,
    })

    res
      .status(201)
      .json({ success: true, message: 'Product created successfully' })
  }
)

export const getAllProducts = trycatch(
  async (
    req: Request<{}, {}, {}, FilterOptions>,
    res: Response,
    next: NextFunction
  ) => {
    const { search, category, price, sort, page } = req.query

    const pageNumber = Number(page) || 1

    const limit = Number(process.env.PRODUCT_LIMIT) || 2

    const skip = (pageNumber - 1) * limit

    const baseQuery: BaseQuery = {}

    if (search) {
      baseQuery.name = {
        $regex: search!,
        $options: 'i',
      }
    }

    if (price) baseQuery.price = { $lte: price }

    if (category) baseQuery.category = category

    const [products, filteredOnlyProduct] = await Promise.all([
      Product.find(baseQuery)
        .sort(sort && { price: sort === 'asc' ? 1 : -1 })
        .limit(limit)
        .skip(skip),
      Product.find(baseQuery),
    ])

    const totalpage = Math.ceil(filteredOnlyProduct.length / limit)

    res.status(201).json({ success: true, products, totalpage })
  }
)

export const getLatestProducts = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const latestProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(10)

    res.status(201).json({ success: true, latestProducts })
  }
)

export const getAllCategories = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await Product.distinct('category')

    res.status(201).json({ success: true, categories })
  }
)

export const singleProduct = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params

    const product = await Product.findById(productId)

    res.status(201).json({ success: true, product })
  }
)

export const updateProduct = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params

    const { name, price, stock, category } = req.body

    const photo = req.file

    const product = await Product.findById(productId)

    if (!product) return next(new ErrorHandler('Invalid Product', 400))

    if (photo) {
      rm(product?.photo!, () => {
        console.log('Old Photo Deleted')
      })
      product.photo = photo.path
    }

    if (name) product.name = name
    if (price) product.price = price
    if (stock) product.stock = stock
    if (category) product.category = category

    await product.save()

    res
      .status(201)
      .json({ success: true, message: 'Product updated successfully' })
  }
)

export const deleteProduct = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params

    const product = await Product.findById(productId)

    if (!product) return next(new ErrorHandler('Invalid Product', 400))

    rm(product.photo!, () => {
      console.log('Old Photo Deleted')
    })

    await product.deleteOne()

    res.status(201).json({
      success: true,
      message: `Product deleted having id ${productId}`,
    })
  }
)
