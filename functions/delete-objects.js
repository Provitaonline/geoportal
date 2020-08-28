let AWS = require('aws-sdk')
let GitHub = require('github-api')
const {config} = require('./utils/s3Config')

AWS.config.update({credentials: config.credentials, region: config.region})

const s3 = new AWS.S3()

exports.handler = (event, context, callback) => {

  console.log('delete-objects function')

  const token = event.queryStringParameters.token
  const objects = JSON.parse(decodeURIComponent(event.queryStringParameters.objects)).map((key) => {return {Key: key}})

  console.log(objects)

  const github = new GitHub({token: token})
  github.getRepo(config.githubInfo.owner, config.githubInfo.repo).getCollaborators().then(() => {
    s3.deleteObjects({
      Bucket: config.bucket,
      Delete: {
        Objects: objects
      }
    }, ((err, data) => {
      if (err) {
        callback(err)
      } else {
        if (data.Errors.length) {
          callback(null, {statusCode: 406, body: JSON.stringify(data.Errors)})
        } else {
          callback(null, {statusCode: 201, body: ''})
        }
      }
    }))
  }).catch((e) => {
    console.log(e)
    callback(null, {statusCode: 401, body: 'User must be a repository collaborator'})
  })
}
