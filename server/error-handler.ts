import type { ErrorRequestHandler } from "express"

export default ((err, req, res, next) => {
  if (err.type !== 'clientError') {
    console.error(err.stack)
    err.code = 500
  }
  res.statusCode = err.code
  res.send(err.msg || '')
}) as ErrorRequestHandler
