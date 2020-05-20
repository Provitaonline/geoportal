const simpleOauth = require('simple-oauth2')

const SITE_URL = process.env.URL
const isLocalhost = process.env.URL.includes('localhost')
/* Auth values */
const TOKEN_HOST = 'https://geoportalp.auth.us-west-2.amazoncognito.com'
const TOKEN_PATH =  '/oauth2/token'
const AUTHORIZE_HOST = 'https://geoportalp.auth.us-west-2.amazoncognito.com'
const AUTHORIZE_PATH = '/oauth2/authorize'
const REDIRECT_URL = `${SITE_URL}/.netlify/functions/auth-callback`

const clientIdKey = 'COGNITO_OAUTH_CLIENT_ID'
const clientSecretKey = 'COGNITO_OAUTH_CLIENT_SECRET'

const config = {
  clientId: process.env[clientIdKey],
  clientSecret: process.env[clientSecretKey],
  // Github OAuth API endpoints
  tokenHost: TOKEN_HOST,
  tokenPath: TOKEN_PATH,
  authorizeHost: AUTHORIZE_HOST,
  authorizePath: AUTHORIZE_PATH,
  // redirect_uri is the callback url after successful signin */
  redirect_uri: REDIRECT_URL,
  siteUrl: SITE_URL
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
  config: config,
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
