import { NextResponse } from "next/server"

interface Meta {
  total?: number
  page?: number
  limit?: number
  totalPages?: number
}

interface ResponseData<T> {
  statusCode: number
  success: boolean
  message: string
  data?: T
  meta?: Meta
}

export const sendResponse = <T>({
  statusCode,
  success,
  message,
  data,
  meta,
}: ResponseData<T>) => {
  return NextResponse.json(
    {
      success,
      statusCode,
      message,
      ...(meta && { meta }),
      ...(data !== undefined && { data }),
    },
    {
      status: statusCode,
    }
  )
}
