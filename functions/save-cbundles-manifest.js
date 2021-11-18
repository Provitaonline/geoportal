let AWS = require('aws-sdk')
let GitHub = require('github-api')
const {config} = require('./utils/s3Config')

AWS.config.update({credentials: config.credentials, region: config.region})

const s3 = new AWS.S3()

exports.handler = (event, context, callback) => {

  const token = event.headers.authorization
  const manifest = event.body

  const github = new GitHub({token: token})
  github.getRepo(config.githubInfo.owner, config.githubInfo.repo).getCollaborators().then(() => {
    s3.putObject({
      ACL: 'public-read',
      Body: manifest,
      Bucket: config.bucket,
      ContentType: 'application/json',
      Key: 'cbundles/manifest.json'
    }, ((err, data) => {
      if (err) {
        callback(err)
      } else {
        callback(null, {statusCode: 201, body: ''})
      }
    }))
  }).catch((e) => {
    console.log(e.response)
    callback(null, {statusCode: 401, body: 'User must be a repository collaborator'})
  })
}
