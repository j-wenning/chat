import 'dotenv/config'
import express from 'express'
import { cursorTo } from 'readline'
import parseEnv from './parse-env'
import exitHandler from './exit-handler'
import getDB from './db'
import session from './session'

(async () => {
  const env = parseEnv(process.env)
  const { PORT: port } = env
  const app = express()
  const db = await getDB(env).catch((err: any) => console.error(err))
  const { stdout } = process

  app.use(session(env))

  app.use((_: any, res: any): void => { res.send('Hello (:') })

  app.listen(port, (): void => { stdout.write(`Listening on port ${port}.\n`) })

  exitHandler((): void => {
    cursorTo(process.stdout, 0)
    stdout.write(`Application terminated.\nPort ${port} freed.\n`)
  })
})()
