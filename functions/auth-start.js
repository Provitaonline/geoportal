const {config} = require('./utils/auth')

console.log(config)

exports.handler = async (event, context) => {
  try {
    const subject = event.queryStringParameters.name || 'Mundo'
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hola ${subject}` })
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
