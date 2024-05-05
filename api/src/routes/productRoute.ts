import express from 'express'
import { adminOnly } from '../middlewares/auth.js'
import {
  deleteProduct,
  getAdminProducts,
  getAllCategories,
  getAllProducts,
  getLatestProducts,
  newProduct,
  singleProduct,
  updateProduct,
} from '../controllers/productController.js'
import { singleUpload } from '../middlewares/multer.js'

const router = express.Router()

router.post('/new', adminOnly, singleUpload, newProduct)
router.get('/latest', getLatestProducts)
router.get('/all-categories', getAllCategories)
router.get('/all-products', getAllProducts)
router.get('/admin-products', adminOnly, getAdminProducts)

router
  .route('/:productId')
  .get(singleProduct)
  .delete(adminOnly, deleteProduct)
  .patch(adminOnly, singleUpload, updateProduct)

export default router
