const { config, oauth } = require('./utils/auth')

exports.handler = async (event, context) => {
  if (!event.queryStringParameters) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Not authorized',
      })
    }
  }

  // Get the grant code
  const code = event.queryStringParameters.code
  /* state helps mitigate CSRF attacks & Restore the previous state of your app */
  const state = event.queryStringParameters.state

  try {
    // Take the grant code and exchange for an accessToken
    const authorizationToken = await oauth.authorizationCode.getToken({
      code: code,
      redirect_uri: config.redirect_uri,
      client_id: config.clientId,
      client_secret: config.clientSecret
    })

    const authResult = oauth.accessToken.create(authorizationToken)

    let eLang = state.substr(0,2)
    let langPath = (config.defaultLang === eLang) ? '' : '/' + eLang

    // Redirect user back to site page
    return {
      statusCode: 302,
      headers: {
        Location: config.siteUrl + langPath + '/admin?token=' + authResult.token.access_token + '&state=' + state,
        'Cache-Control': 'no-cache'
      },
      body: ''
    }


  } catch (e) {
    console.log('Access Token Error', e.message)
    console.log(e)
    return {
      statusCode: e.statusCode || 500,
      body: e.message
    }
  }
}
