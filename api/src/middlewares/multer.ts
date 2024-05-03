import { randomUUID } from 'crypto'
import multer from 'multer'

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'uploads')
  },
  filename(req, file, callback) {
    const id = randomUUID()

    const fileExtension = file.originalname.split('.').pop()

    const filename = `${id}.${fileExtension}`

    callback(null, filename)
  },
})

export const singleUpload = multer({ storage }).single('photo')
