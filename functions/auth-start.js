const {config, oauth} = require('./utils/auth')

/* Do initial auth redirect */
exports.handler = async (event, context) => {

  const state = event.queryStringParameters.state
  // Generate authorizationURI
  const authorizationURI = oauth.authorizationCode.authorizeURL({
    redirect_uri: config.redirect_uri,
    /* Specify how your app needs to access the user’s account. */
    scope: 'openid profile',
    /* State helps mitigate CSRF attacks & Restore the previous state of your app */
    state: state
  })

  // Redirect user to authorizationURI
  return {
    statusCode: 302,
    headers: {
      Location: authorizationURI,
      'Cache-Control': 'no-cache'
    },
    body: ''
  }
}
