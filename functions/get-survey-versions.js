let AWS = require('aws-sdk')
let GitHub = require('github-api')
const {config} = require('./utils/s3Config')

AWS.config.update({credentials: config.credentials, region: config.region})

const s3 = new AWS.S3()

exports.handler = (event, context, callback) => {

  const token = event.headers.authorization

  const github = new GitHub({token: token})
  github.getRepo(config.githubInfo.owner, config.githubInfo.repo).getCollaborators().then(() => {
    s3.listObjectsV2({
      Bucket: config.bucket,
      Delimiter: '/',
      Prefix: 'surveydata/'
    }, ((err, data) => {
      if (err) {
        callback(err)
      } else {
        callback(null, {statusCode: 200, body: JSON.stringify(data.CommonPrefixes.map(item => item.Prefix.substr(19).slice(0, -1)))})
      }
    }))
  }).catch((e) => {
    console.log(e.response)
    callback(null, {statusCode: 401, body: 'User must be a repository collaborator'})
  })
}
