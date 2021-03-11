const { MongoClient: { connect: mongoConnect } } = require('mongodb')
const { cursorTo } = require('readline')
const exitHandler = require('./exit-handler')
const { stdout } = process
const mongoOptions = { useUnifiedTopology: true }

module.exports = async (env: any): Promise<any> => {
  const { DB_URL: dbURL } = env
  const client = await mongoConnect(dbURL, mongoOptions).catch((err: any) => { throw err })
  exitHandler(() => {
    client.close()
    cursorTo(process.stdout, 0)
    stdout.write('Mongo client connection terminated.\n')
  })
  return client.db()
}
