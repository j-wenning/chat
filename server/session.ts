import session from 'express-session'
import MongoStore from 'connect-mongo'

export default (env: any): any => {
  const {
    SESSION_SECRET: sessionSecret,
    SESSION_EXPIRY: sessionExpiry,
    DB_URL: dbURL
  } = env
  return session({
    resave: true,
    saveUninitialized: false,
    secret: sessionSecret,
    store: MongoStore.create({ mongoUrl: dbURL, collectionName: 'sessions' }),
    cookie: { maxAge: sessionExpiry, sameSite: true }
  })
}
