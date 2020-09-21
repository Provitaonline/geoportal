let AWS = require('aws-sdk')
let GitHub = require('github-api')
let converter = require('json-2-csv')
const {gzip} = require('node-gzip')
const {config} = require('./utils/s3Config')

AWS.config.update({credentials: config.credentials, region: config.region})

const s3 = new AWS.S3()

exports.handler = async (event, context) => {

  const token = event.queryStringParameters.token
  const version = event.queryStringParameters.version

  function isAuthorized() {
    const github = new GitHub({token: token})

    return new Promise((resolve, reject) => {
      github.getRepo(config.githubInfo.owner, config.githubInfo.repo).getCollaborators().then(() => {
        resolve(true)
      }).catch((e) => {
        reject(false)
      })
    })
  }

  function getListOfFiles() {
    return new Promise((resolve, reject) => {
      s3.listObjectsV2({
        Bucket: config.bucket,
        Prefix: 'surveydata/version-' + version
      }, ((err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve (data.Contents.map(item => item.Key))
        }
      }))
    })
  }

  function getFile(key) {
    return new Promise((resolve, reject) => {
      s3.getObject({
        Bucket: config.bucket,
        Key: key
      }, ((err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve (JSON.parse(data.Body.toString('utf-8')))
        }
      }))
    })
  }

  function convertToCsv(jsonContent) {
    return new Promise((resolve, reject) => {
      converter.json2csv(jsonContent, (err, csvContent) => {
        if (err) {
          reject(err)
        } else {
          resolve(csvContent)
        }
      })
    })
  }

  let result = []
  if (await isAuthorized()) {
    let listOfFiles = await getListOfFiles()

    for (const fileKey of listOfFiles) {
      let record = await getFile(fileKey)
      // Add the date
      let part1 = fileKey.substring(0, fileKey.lastIndexOf('-'))
      record.date = part1.substring(part1.lastIndexOf('/') + 1)
      result.push(record)
    }
    let csvContent = await gzip(await convertToCsv(result))

    return {
      statusCode: 200,
      headers: {'Content-Encoding': 'gzip'},
      body: csvContent.toString('base64'),
      isBase64Encoded: true
    }
  } else {
    return {statusCode: 401, body: 'User must be a repository collaborator'}
  }
}
