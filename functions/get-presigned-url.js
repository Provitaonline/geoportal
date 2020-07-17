let AWS = require('aws-sdk')

let credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRET
}

AWS.config.update({credentials: credentials, region: 'us-west-2'})

const s3 = new AWS.S3()

exports.handler = async (event, context) => {

  const token = event.queryStringParameters.token
  const name = event.queryStringParameters.name
  const type = event.queryStringParameters.type

  let presignedPost = s3.createPresignedPost({
    Bucket: 'geoportalp',
    Fields: {
      'Content-Type': type,
      'key': 'files/' + name
    }
  })

  console.log(presignedPost)

  return {
    statusCode: 200,
    body: JSON.stringify(presignedPost)
  }
}
