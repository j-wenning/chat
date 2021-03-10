require('dotenv/config')
const {
  PORT: port
} = process.env
const express = require('express')
const app = express()

app.use((req, res) => res.send('Hello (:'))

app.listen(port, () => console.log('Listening on port ' + port))
