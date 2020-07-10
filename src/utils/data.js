import GitHub from 'github-api'
import axios from 'axios'
import {adminConfig, dataConfig} from '~/utils/config'

let parseString = require('xml2js').parseString


// This retrieved meta from the github cache
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
