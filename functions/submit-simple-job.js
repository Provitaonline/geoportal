let AWS = require('aws-sdk')
let GitHub = require('github-api')
const {config} = require('./utils/s3Config')

AWS.config.update({credentials: config.credentials, region: config.region})

const batch = new AWS.Batch()

exports.handler = (event, context, callback) => {

  const token = event.headers.authorization
  const jobName = event.queryStringParameters.jobname

  const github = new GitHub({token: token})
  github.getRepo(config.githubInfo.owner, config.githubInfo.repo).getCollaborators().then(() => {
    batch.submitJob({
      jobName: 'geoportalp-' + jobName,
      jobDefinition: 'geoportalp-' + jobName,
      jobQueue: 'geoportalp-' + jobName
    }, ((err, data) => {
      if (err) {
        callback(err)
      } else {
        callback(null, {statusCode: 201, body: ''})
      }
    }))
  }).catch((e) => {
    console.log(e)
    return callback(null, {statusCode: 401, body: 'User must be a repository collaborator'})
  })
}
