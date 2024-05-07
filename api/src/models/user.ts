import mongoose, { Document } from 'mongoose'
import validator from 'validator'

interface UserType extends Document {
  _id: string
  photo: string
  name: string
  role: 'admin' | 'user'
  gender: 'male' | 'female'
  email: string
  dob: Date
  createdAt: Date
  updatedAt: Date
  age: number
}

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: [true, 'Please enter ID'] },
    photo: {
      type: String,
      required: [true, 'Please add Profile Image'],
    },
    name: {
      type: String,
      required: [true, 'Please enter Name'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Please enter Gender'],
    },
    email: {
      type: String,
      unique: [true, 'Email already exists'],
      required: [true, 'Please enter Name'],
      validate: validator.default.isEmail,
    },
    dob: {
      type: Date,
      required: [true, 'Please enter DOB'],
    },
  },
  { timestamps: true }
)

userSchema.virtual('age').get(function () {
  const today = new Date()
  const dob = this.dob

  let age = today.getFullYear() - dob.getFullYear()

  return age
})

export const User = mongoose.model<UserType>('User', userSchema)
