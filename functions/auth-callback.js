const querystring = require('querystring')
const { config, oauth } = require('./utils/auth')

/* Function to handle github auth callback */
exports.handler = async (event, context) => {
  // Exit early
  /*if (!event.queryStringParameters) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Not authorized',
      })
    }
  } */

  /* Grant the grant code */
  const code = event.queryStringParameters.code
  /* state helps mitigate CSRF attacks & Restore the previous state of your app */
  const state = querystring.parse(event.queryStringParameters.state)

  try {
    /* Take the grant code and exchange for an accessToken */
    const authorizationToken = await oauth.authorizationCode.getToken({
      code: code,
      redirect_uri: config.redirect_uri,
      client_id: config.clientId,
      client_secret: config.clientSecret
    })

    const authResult = oauth.accessToken.create(authorizationToken)

    // const user = await getUser(token)

    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({
    //     user: user,
    //     authResult: authResult,
    //     state: state,
    //     encode: Buffer.from(token, 'binary').toString('base64')
    //   })
    // }

    /*const encodedUserData = querystring.stringify({
      email: user.email || "NA",
      full_name: user.full_name || "NA",
      avatar: user.avatar_url || "NA"
    }) */

    console.log('auth token', authResult.token)
    console.log('state', state)

    /* Redirect user to authorizationURI */
    return {
      statusCode: 302,
      headers: {
        Location: config.siteUrl,
        'Cache-Control': 'no-cache' // Disable caching of this response
      },
      body: '' // return body for local dev
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
