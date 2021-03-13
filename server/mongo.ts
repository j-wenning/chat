import { MongoClient } from 'mongodb'
import { cursorTo } from 'readline'
import exitHandler from './exit-handler'
const { connect: mongoConnect } = MongoClient
const { stdout } = process
const mongoOptions = { useUnifiedTopology: true }
const { DB_URL: dbURL = '' } = process.env
const _export = {
  client: {} as MongoClient
}

mongoConnect(dbURL, mongoOptions, (err, client) => {
  if (err) throw err
  exitHandler(() => {
    client.close()
    cursorTo(process.stdout, 0)
    stdout.write('Mongo client connection terminated.\n')
  })
  stdout.write('Mongo client connection created.\n')
  _export.client = client
})

export default _export
