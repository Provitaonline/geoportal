const simpleOauth = require('simple-oauth2')

const SITE_URL = process.env.URL || 'http://localhost:8888'

/* Auth values */
const TOKEN_HOST = 'https://github.com'
const TOKEN_PATH =  '/login/oauth/access_token'
const AUTHORIZE_HOST = 'https://github.com'
const AUTHORIZE_PATH = '/login/oauth/authorize'
const REDIRECT_URL = `${SITE_URL}/.netlify/functions/auth-callbackXX`

/* Env key name */
const clientIdKey = 'GITHUB_OAUTH_CLIENT_ID'
const clientSecretKey = 'GITHUB_OAUTH_CLIENT_SECRET'

const config = {
  /* values set in terminal session or in netlify environment variables */
  clientId: process.env[clientIdKey],
  clientSecret: process.env[clientSecretKey],
  /* OAuth API endpoints */
  tokenHost: TOKEN_HOST,
  tokenPath: TOKEN_PATH,
  authorizeHost: AUTHORIZE_HOST,
  authorizePath: AUTHORIZE_PATH,
  /* redirect_uri is the callback url after successful signin */
  redirect_uri: REDIRECT_URL,
}

function authInstance(credentials) {
  if (!credentials.client.id) {
    throw new Error(`MISSING REQUIRED ENV VARS. Please set ${clientIdKey}`)
  }
  if (!credentials.client.secret) {
    throw new Error(`MISSING REQUIRED ENV VARS. Please set ${clientSecretKey}`)
  }
  return simpleOauth.create(credentials)
}

module.exports = {
  /* Export config for functions */
  config: config,
  /* Create oauth2 instance to use in our functions */
  oauth: authInstance({
    client: {
      id: config.clientId,
      secret: config.clientSecret
    },
    auth: {
      tokenHost: config.tokenHost,
      tokenPath: config.tokenPath,
      authorizeHost: config.authorizeHost,
      authorizePath: config.authorizePath
    }
  })
}
