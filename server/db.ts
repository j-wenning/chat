import { MongoClient } from 'mongodb'
import { cursorTo } from 'readline'
import exitHandler from './exit-handler'
const { connect: mongoConnect } = MongoClient
const { stdout } = process
const mongoOptions = { useUnifiedTopology: true }

export default async (env: any): Promise<any> => {
  const { DB_URL: dbURL } = env
  const client = await mongoConnect(dbURL, mongoOptions).catch((err: any) => { throw err })
  exitHandler(() => {
    client.close()
    cursorTo(process.stdout, 0)
    stdout.write('Mongo client connection terminated.\n')
  })
  return client.db()
}
