const simpleOauth = require('simple-oauth2')

const SITE_URL = process.env.URL
const isLocalhost = process.env.URL.includes('localhost')
/* Auth values */
const TOKEN_HOST = 'https://github.com'
const TOKEN_PATH =  '/login/oauth/access_token'
const AUTHORIZE_HOST = 'https://github.com'
const AUTHORIZE_PATH = '/login/oauth/authorize'
const REDIRECT_URL = `${SITE_URL}/.netlify/functions/auth-callback`
const DEFAULT_LANG = 'es'

const clientIdKey = isLocalhost ? 'GITHUB_OAUTH_CLIENT_ID_TEST' : 'GITHUB_OAUTH_CLIENT_ID'
const clientSecretKey = isLocalhost ? 'GITHUB_OAUTH_CLIENT_SECRET_TEST' : 'GITHUB_OAUTH_CLIENT_SECRET'

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
  siteUrl: SITE_URL,
  defaultLang: DEFAULT_LANG
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
