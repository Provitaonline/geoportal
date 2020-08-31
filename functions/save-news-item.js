let AWS = require('aws-sdk')
let GitHub = require('github-api')
const {config} = require('./utils/s3Config')

AWS.config.update({credentials: config.credentials, region: config.region})

const s3 = new AWS.S3()

exports.handler = (event, context, callback) => {

  const token = event.queryStringParameters.token
  const newsItem = JSON.parse(event.body)

  const github = new GitHub({token: token})
  github.getRepo(config.githubInfo.owner, config.githubInfo.repo).getCollaborators().then(() => {
    if (newsItem.thumb) {
      let parts = newsItem.thumb.split(',')
      let info = parts[0].split(/[:;]/)
      let thumbKey = newsItem.key.replace(/news\//,'news/thumbs/') + '.' + info[1].split('/')[1]
      s3.putObject({
        ACL: 'public-read',
        Body: Buffer.from(parts[1], 'base64'),
        Bucket: config.bucket,
        ContentType: info[1],
        Key: thumbKey
      }, ((err) => { if (err) { console.log(err) }}))
      newsItem.thumb = 'https://' + config.bucket + '.s3-' + config.region + '.amazonaws.com/' + thumbKey
    }

    s3.putObject({
      ACL: 'public-read',
      Body: JSON.stringify(newsItem),
      Bucket: config.bucket,
      ContentType: 'application/json',
      Key: newsItem.key
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
