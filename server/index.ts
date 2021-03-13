import './env'
import './mongo'
import { cursorTo } from 'readline'
import express from 'express'
import session from './session'
import getPubkey from './get-pubkey'
import errorHandler from './error-handler'
import exitHandler from './exit-handler'

const app = express()
const { PORT: port } = process.env
const { stdout } = process

app.use(express.json())

app.use(session)

app.get('/pubkey', getPubkey)

app.use(errorHandler)

app.listen(port, () => { stdout.write(`Listening on port ${port}.\n`) })

exitHandler(() => {
  cursorTo(process.stdout, 0)
  stdout.write(`Application terminated.\nPort ${port} freed.\n`)
})
