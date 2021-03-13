import type { RequestHandler } from 'express'
import mongo from './mongo'

export default (async (_, res, next) => {
  try {
    const [pubkey] = await mongo.client?.db().collection('pubkey')
      .find({}, {
        sort: [['_id', -1]],
        limit: 1,
        projection: { _id: 0, salt: 1 }
      }).toArray() || []
    res.json(pubkey)
  } catch (err) { next(err) }
}) as RequestHandler
