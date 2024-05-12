import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import toast from 'react-hot-toast'
import { NavigateFunction } from 'react-router-dom'
import { MessageResponse } from '../types'
import moment from 'moment'

type Res =
  | {
      data: MessageResponse
    }
  | {
      error: FetchBaseQueryError | SerializedError
    }

export const responseToast = (
  res: Res,
  navigate: NavigateFunction | null,
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

export const getLastMonths = ({ length }: { length: number }) => {
  const current = moment()
  current.date(1)

  const lastMonths = []

  for (let i = 0; i < length; i++) {
    const monthDate = current.clone().subtract(i, 'months')
    const month = monthDate.format('MMMM')

    lastMonths.unshift(month)
  }

  return lastMonths
}
