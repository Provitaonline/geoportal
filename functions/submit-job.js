let AWS = require('aws-sdk')
let GitHub = require('github-api')
const {config} = require('./utils/s3Config')

AWS.config.update({credentials: config.credentials, region: config.region})

const batch = new AWS.Batch()

exports.handler = (event, context, callback) => {

  const token = event.queryStringParameters.token
  const file = event.queryStringParameters.file
  const type = event.queryStringParameters.type
  const parm = event.queryStringParameters.parm

  let parameters = {
    inputFile: file
  }

  if (type === 'rtiles') {
    parameters.colorTable = parm
  }

  const github = new GitHub({token: token})
  github.getRepo(config.githubInfo.owner, config.githubInfo.repo).getCollaborators().then(() => {
    batch.submitJob({
      jobName: 'geoportalp-' + type,
      jobDefinition: 'geoportalp-' + type,
      jobQueue: 'geoportalp-' + type,
      parameters: parameters
    }, ((err, data) => {
      if (err) {
        callback(err)
      } else {
        callback(null, {statusCode: 201, body: ''})
      }
    }))
  }).catch((e) => {
    console.log(e)
    callback(null, {statusCode: 401, body: 'User must be a repository collaborator'})
  })
}
