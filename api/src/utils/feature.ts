import mongoose from 'mongoose'

export const connectDB = () => {
  mongoose
    .connect(
      'mongodb+srv://bindashish343:RZrFB5jdoUmNc8h1@cluster0.bzelhfo.mongodb.net',
      { dbName: 'ecommerce' }
    )
    .then(() => console.log('Database connected'))
}
