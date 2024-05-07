import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '../utils/utility-class.js'
import { trycatch } from '../middlewares/error.js'
import { Product } from '../models/product.js'
import { rm } from 'fs'
import { BaseQuery, FilterOptions } from '../types.js'
import { myCache } from '../app.js'
import { invalidateCache } from '../utils/feature.js'

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

    invalidateCache({ product: true, admin: true })

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

    const limit = Number(process.env.PRODUCT_LIMIT) || 8

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
    let products

    if (!myCache.has(`latest-products`)) {
      products = await Product.find({}).sort({ createdAt: -1 }).limit(10)
      myCache.set(`latest-products`, JSON.stringify(products))
    } else {
      products = JSON.parse(myCache.get(`latest-products`)!)
    }

    res.status(201).json({ success: true, products })
  }
)

export const getAllCategories = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let categories

    if (!myCache.has(`categories`)) {
      categories = await Product.distinct('category')
      myCache.set(`categories`, JSON.stringify(categories))
    } else {
      categories = JSON.parse(myCache.get(`categories`)!)
    }

    res.status(201).json({ success: true, categories })
  }
)

export const singleProduct = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params

    let product

    if (!myCache.has(`product-${productId}`)) {
      product = await Product.findById(productId)

      if (!product) return next(new ErrorHandler('Invalid Product Id', 400))

      myCache.set(`product-${productId}`, JSON.stringify(product))
    } else {
      product = JSON.parse(myCache.get(`product-${productId}`)!)
    }

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

    invalidateCache({
      product: true,
      productId: [productId],
      admin: true,
    })

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

    invalidateCache({
      product: true,
      productId: [productId],
      admin: true,
    })

    res.status(201).json({
      success: true,
      message: `Product deleted having id ${productId}`,
    })
  }
)

export const getAdminProducts = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let products

    if (!myCache.has(`all-products`)) {
      products = await Product.find({})
      myCache.set(`all-products`, JSON.stringify(products))
    } else {
      products = JSON.parse(myCache.get(`all-products`)!)
    }

    res.status(201).json({ success: true, products })
  }
)
