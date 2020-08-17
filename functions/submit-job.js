let AWS = require('aws-sdk')
let GitHub = require('github-api')
const {config} = require('./utils/s3Config')

AWS.config.update({credentials: config.credentials, region: config.region})

const batch = new AWS.Batch()

function submit(jobNameSuffix, parameters) {
  return new Promise((resolve, reject) => {
    batch.submitJob({
      jobName: 'geoportalp-' + jobNameSuffix,
      jobDefinition: 'geoportalp-' + jobNameSuffix,
      jobQueue: 'geoportalp-' + jobNameSuffix,
      parameters: parameters
    }, ((err, data) => {
      if (err) {
        return reject(err)
      } else {
        return resolve({statusCode: 201, body: ''})
      }
    }))
  })
}

function listJobs(jobNameSuffix, jobStatus) {
  return new Promise((resolve, reject) => {
    batch.listJobs({
      jobQueue: 'geoportalp-' + jobNameSuffix,
      jobStatus: jobStatus
    }, ((err, data) => {
      if (err) {
        return reject(err)
        return
      } else {
        return resolve(data.jobSummaryList.map(item => item.jobId))
      }
    }))
  })
}

function checkIfOkToSubmit(jobNameSuffix, inputFile) {
  let statuses = ['SUBMITTED', 'PENDING', 'RUNNABLE', 'STARTING', 'RUNNING']

  let promises = statuses.map(status => listJobs(jobNameSuffix, status))

  return new Promise((resolve, reject) => {
    Promise.all(promises).then((result) => {
      let jobs = result.flat()
      if (jobs.length) {
        checkJobQueue(jobs, inputFile).then((isOkToSubmit) => {
          return resolve (isOkToSubmit)
        })
      } else {
        return resolve (true)
      }
    })
  })
}

function checkJobQueue(jobs, inputFile) {
  return new Promise((resolve, reject) => {
    batch.describeJobs({jobs: jobs}, ((err, data) => {
      if (err) {
        return reject(err)
      } else {
        if (data.jobs.find(job => job.parameters.inputFile === inputFile)) {
          return resolve (false)
        } else {
          return resolve (true)
        }
      }
    }))
  })
}

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
    checkIfOkToSubmit(jobNameSuffix, parameters.inputFile).then((isOkToSubmit) => {
      if (isOkToSubmit) {
        submit(jobNameSuffix, parameters).then((response) => {
          return callback(null, response)
        }).catch((err) => {
          return callback(err)
        })
      } else {
        return callback(null, {statusCode: 409, body: `A job to process ${parameters.inputFile} is already in progress`})
      }
    }).catch((err) => {
      return callback(err)
    })
  }).catch((e) => {
    console.log(e)
    return callback(null, {statusCode: 401, body: 'User must be a repository collaborator'})
  })
}
