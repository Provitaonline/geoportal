let AWS = require('aws-sdk')
let GitHub = require('github-api')
const {config} = require('./utils/s3Config')

AWS.config.update({credentials: config.credentials, region: config.region})

const s3 = new AWS.S3()

exports.handler = (event, context, callback) => {

  const token = event.headers.authorization
  const name = event.queryStringParameters.name
  const type = event.queryStringParameters.type

  const github = new GitHub({token: token})
  github.getRepo(config.githubInfo.owner, config.githubInfo.repo).getCollaborators().then(() => {
    let presignedPost = s3.createPresignedPost({
      Bucket: config.bucket,
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
    console.log(e.response)
    callback(null, {statusCode: 401, body: 'User must be a repository collaborator'})
  })
}
