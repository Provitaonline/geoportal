import GitHub from 'github-api'
import axios from 'axios'
import {adminConfig, dataConfig} from '~/utils/config'

let parseString = require('xml2js').parseString


// This retrieves meta from the github cache
export async function getMetaEntries() {
  let result = {}
  let response = await axios.get(dataConfig.metaBaseUrl + dataConfig.metaFileName)
  return response.data
}

export async function getFileSize(fileName) {
  let response = await axios.head(dataConfig.filesBaseUrl + dataConfig.filesDirectory + '/' + fileName)
  return response.headers['content-length']
}

export function getListOfFiles() {
  return new Promise((resolve, reject) => {
    axios.get(dataConfig.filesBaseUrl + '?list-type=2&prefix=' + dataConfig.filesDirectory).then(response => {
      parseString(response.data, (err, result) => {
        resolve(
          result.ListBucketResult.Contents.map(item => {
            return {name: item.Key[0].replace('files/', ''), size: item.Size[0], date: item.LastModified[0]}
          }).filter(el => el.name != '')
        )
      })
    })
  })
}

// This retrieves live meta from github repo
export async function getMetaFromRepo(token) {
  let github = new GitHub({token: token})

  let response = await github.getRepo(adminConfig.githubInfo.owner, adminConfig.githubInfo.repo).getContents('master', dataConfig.metaFileName, true)
  return response.data.collection
}

// This save meta to the github repo
export async function saveMetaFromRepo(token, meta) {
  let github = new GitHub({token: token})

  let response = await github.getRepo(adminConfig.githubInfo.owner, adminConfig.githubInfo.repo).
    writeFile('master', dataConfig.metaFileName, JSON.stringify({collection: meta}, null, 2), 'Updated meta', {encode: true})
  return response
}

export async function getPresignedUrl(token, name, type, owner, repo) {
  let response = await axios.get('/.netlify/functions/get-presigned-url?token=' + token + '&name=' + name + '&type=' + type + '&owner=' + owner + '&repo=' + repo)
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
