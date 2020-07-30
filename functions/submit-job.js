let AWS = require('aws-sdk')
let GitHub = require('github-api')
const {config} = require('./utils/s3Config')

AWS.config.update({credentials: config.credentials, region: config.region})

const batch = new AWS.Batch()

exports.handler = (event, context, callback) => {

  const token = event.queryStringParameters.token
  const file = event.queryStringParameters.file
  const type = event.queryStringParameters.type
  const ctable = event.queryStringParameters.ctable
  const exact = event.queryStringParameters.exact

  let jobNameSuffix
  let parameters = {
    inputFile: file
  }

  if (type === 'raster') {
    jobNameSuffix = 'rtiles'
    parameters.colorTable = ctable
    parameters.exactColorEntry = exact ? exact : ''
  } else {
    jobNameSuffix = 'vtiles'
  }

  const github = new GitHub({token: token})
  github.getRepo(config.githubInfo.owner, config.githubInfo.repo).getCollaborators().then(() => {
    batch.submitJob({
      jobName: 'geoportalp-' + jobNameSuffix,
      jobDefinition: 'geoportalp-' + jobNameSuffix,
      jobQueue: 'geoportalp-' + jobNameSuffix,
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
