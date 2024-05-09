export interface User {
  name: string
  email: string
  gender: string
  _id: string
  photo: string
  role: string
  dob: string
}

export type MessageResponse = {
  success: boolean
  message: string
}

/* Reducer Types */

export interface UserReducerInitialState {
  user: User | null
  loading: boolean
}
