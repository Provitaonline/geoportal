let AWS = require('aws-sdk')
let sanitize = require('sanitize-html')
const {config} = require('./utils/s3Config')

AWS.config.update({credentials: config.credentials, region: config.region})

const s3 = new AWS.S3()

exports.handler = (event, context, callback) => {

  const version = event.queryStringParameters.version
  const survey = event.body

  console.log('survey data ' + version, sanitize(survey, {allowedTags: [], allowedAttributes: []}))
  s3.putObject({
    Body: sanitize(survey, {allowedTags: [], allowedAttributes: []}),
    Bucket: config.bucket,
    Key: 'surveydata/version-' + version + '/' + (new Date()).toISOString() + '-' + (new Date().getTime()).toString(36) + '.csv'
  }, ((err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(null, {statusCode: 201, body: ''})
    }
  }))
}
