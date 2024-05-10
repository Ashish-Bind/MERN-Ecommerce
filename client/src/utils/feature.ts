import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { MessageResponse } from '../types'
import { SerializedError } from '@reduxjs/toolkit'
import { Navigate, NavigateFunction } from 'react-router-dom'
import toast from 'react-hot-toast'

type Res =
  | {
      data: MessageResponse
    }
  | {
      error: FetchBaseQueryError | SerializedError
    }

export const responseToast = (
  res: Res,
  navigate: NavigateFunction,
  url: string
) => {
  if ('data' in res) {
    toast.success(res.data.message)
    if (navigate) navigate(url)
  } else {
    const error = res.error as FetchBaseQueryError
    const messageResponse = error.data as MessageResponse
    toast.error(messageResponse.message)
  }
}
