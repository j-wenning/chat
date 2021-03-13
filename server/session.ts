import session from 'express-session'
import MongoStore from 'connect-mongo'

const {
  SESSION_SECRET: sessionSecret,
  SESSION_EXPIRY: sessionExpiry,
  DB_URL: dbURL
} = process.env as any

const sessionExport = session({
  resave: true,
  saveUninitialized: false,
  secret: sessionSecret,
  store: MongoStore.create({ mongoUrl: dbURL, collectionName: 'sessions' }),
  cookie: { maxAge: sessionExpiry, sameSite: true }
})

export default sessionExport
