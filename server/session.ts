const session = require('express-session')
const sessionStore = require('connect-mongo').default

module.exports = (env: any): any => {
  const {
    SESSION_SECRET: sessionSecret,
    SESSION_EXPIRY: sessionExpiry,
    DB_URL: dbURL
  } = env
  return session({
    resave: true,
    saveUninitialized: false,
    secret: sessionSecret,
    store: sessionStore.create({ mongoUrl: dbURL, collectionName: 'sessions' }),
    cookie: { maxAge: sessionExpiry, sameSite: true }
  })
}
