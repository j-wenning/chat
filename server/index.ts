(async () => {
  require('dotenv/config')
  const env = require('./parse-env')(process.env)
  const { PORT: port } = env
  const exitHandler = require('./exit-handler')
  const app = require('express')()
  const db = await require('./db')(env).catch((err: any): void => { console.error(err) })
  const { cursorTo } = require('readline')
  const { stdout } = process

  app.use(require('./session')(env))

  app.use((_: any, res: any): void => { res.send('Hello (:') })

  app.listen(port, (): void => { stdout.write(`Listening on port ${port}.\n`) })

  exitHandler((): void => {
    cursorTo(process.stdout, 0)
    stdout.write(`Application terminated.\nPort ${port} freed.\n`)
  })
})()
