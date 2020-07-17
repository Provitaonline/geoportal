let AWS = require('aws-sdk')
let GitHub = require('github-api')

let credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRET
}

AWS.config.update({credentials: credentials, region: 'us-west-2'})

const s3 = new AWS.S3()

exports.handler = (event, context, callback) => {

  const token = event.queryStringParameters.token
  const name = event.queryStringParameters.name
  const type = event.queryStringParameters.type
  const owner = event.queryStringParameters.owner
  const repo = event.queryStringParameters.repo

  const github = new GitHub({token: token})
  github.getRepo(owner, repo).getCollaborators().then(() => {
    let presignedPost = s3.createPresignedPost({
      Bucket: 'geoportalp',
      Conditions: [
        ["content-length-range", 	0, 1000000000],
      ],
      Fields: {
        'acl': 'public-read',
        'Content-Type': type,
        'key': 'files/' + name
      }
    })
    callback(null, {statusCode: 200, body: JSON.stringify(presignedPost)})
  }).catch((e) => {
    callback(null, {statusCode: 401, body: 'User must be a repository collaborator'})
  })
}
