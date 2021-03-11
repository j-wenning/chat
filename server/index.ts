require('dotenv/config')
const env = require('./parse-env.ts')(process.env)
const { PORT: port } = env
const express = require('express')
const app = express()

app.use(require('./session.ts')(env))

app.use((_: any, res: any) => res.send('Hello (:'))

app.listen(port, () => console.log('Listening on port ' + port))
