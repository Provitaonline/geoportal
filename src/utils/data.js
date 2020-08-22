import GitHub from 'github-api'
import axios from 'axios'
import {Base64} from 'js-base64'
import {adminConfig, dataConfig} from '~/utils/config'
import {makeColorTableParameter} from '~/utils/misc'

let parseString = require('xml2js').parseString


// This retrieves meta from the github cache
export async function getMetaEntries() {
  let response = await axios.get(dataConfig.metaBaseUrl + dataConfig.metaFileName)
  return response
}

// This gets the size of a file
export async function getFileSize(fileName) {
  let response = await axios.head(dataConfig.filesBaseUrl + dataConfig.filesDirectory + '/' + fileName)
  return response.headers['content-length']
}

// This gets the list of stored files
export function getListOfFiles() {
  return new Promise((resolve, reject) => {
    axios.get(dataConfig.filesBaseUrl + '?list-type=2&prefix=' + dataConfig.filesDirectory).then(response => {
      parseString(response.data, (err, result) => {
        if (result.ListBucketResult.Contents) {
          resolve(
            result.ListBucketResult.Contents.map(item => {
              return {name: item.Key[0].replace('files/', ''), size: item.Size[0], date: item.LastModified[0]}
            }).filter(el => el.name != '')
          )
        } else {
          resolve([])
        }
      })
    })
  })
}

// This retrieves live meta from github repo
export async function getMetaFromRepo(token) {
  let github = new GitHub({token: token})

  let response = await github.getRepo(adminConfig.githubInfo.owner, adminConfig.githubInfo.repo).getContents('master', dataConfig.metaFileName)
  return {sha: response.data.sha, data: JSON.parse(Base64.decode(response.data.content))}
}

// This gets the sha of the meta file
export async function getMetaSha(token) {
  let github = new GitHub({token: token})

  let response = await github.getRepo(adminConfig.githubInfo.owner, adminConfig.githubInfo.repo).getTree('master')
  return (response.data.tree.find(item => item.path === dataConfig.metaFileName)).sha
}

// This saves meta to the github repo
export async function saveMetaFromRepo(token, meta) {
  let github = new GitHub({token: token})

  let response = await github.getRepo(adminConfig.githubInfo.owner, adminConfig.githubInfo.repo).
    writeFile('master', dataConfig.metaFileName, JSON.stringify({collection: meta}, null, 2), 'Updated meta', {encode: true})
  return response
}

export async function getPresignedUrl(token, name, type) {
  let response = await axios.get('/.netlify/functions/get-presigned-url?token=' + token + '&name=' + name + '&type=' + type)
  return response
}

export async function uploadFileToS3(url, formData, uploadProgress) {
  let response = await axios({
    method: 'post',
    url: url,
    data: formData,
    onUploadProgress: uploadProgress
  })
  return response
}

export async function deleteFiles(token, files) {
  let response = await axios.get('/.netlify/functions/delete-files?token=' + token + '&files=' + encodeURIComponent(files))
  return response
}

export async function submitJob(token, job) {
  let funcUrl = '/.netlify/functions/submit-job?token=' + token + '&file=' + job.file + '&type=' + job.tileInfo.type
  if (job.tileInfo.type === 'raster') {
    funcUrl += '&ctable=' + makeColorTableParameter(job.tileInfo.colorTable)
    funcUrl += '&exact=' + ((job.tileInfo.gradient) ? 'gradient' : 'exact')
  }
  let response = await axios.get(funcUrl)
  return response
}

export async function sendSurvey(survey, version) {
  let row = ''
  let keys = Object.keys(survey)
  version = version ? version : '1'
  keys.forEach((key, idx) => {
    row += '"' + survey[key].replace(/\"/g, '""') + '"' + ((idx === keys.length - 1) ? '' : ',')
  })
  let response = await axios.put('/.netlify/functions/send-survey?version=' + version, row, {headers: {'Content-Type': 'text/plain'}})
  return response
}
