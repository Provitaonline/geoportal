import axios from 'axios'
import base64 from 'base-64'
import utf8 from 'utf8'
import {adminConfig, dataConfig} from '~/utils/config'
import {makeColorTableParameter} from '~/utils/misc'

import * as oK from '~/utils/octokitwrapper'

let parseString = require('xml2js').parseString

// Set the branch of the data repo
export function setRepoBranch(branch) {
  oK.setRepoBranch(branch)
}

// This gets the size of a file
export async function getFileSize(fileName) {
  let response = await axios.head(dataConfig.filesBaseUrl + dataConfig.filesDirectory + '/' + fileName)
  return response.headers['content-length']
}

// This gets the list of stored files
export function getListOfStoredFiles(isPublic) {
  let filesDirectory = isPublic ? dataConfig.filesDirectory : dataConfig.privateFilesDirectory
  let fileTypes = 'shapefile|geotiff|pdf'
  let re = new RegExp(filesDirectory + '\/(' + fileTypes + ')\/')
  function scrubbedFileEntry(el) {
    let m = el.Key[0].match(re)[1]
    return {name: el.Key[0].replace(re, ''), format: m, size: el.Size[0], date: el.LastModified[0]}
  }
  return new Promise((resolve, reject) => {
    axios.get(dataConfig.filesBaseUrl + '?list-type=2&prefix=' + filesDirectory).then(response => {
      parseString(response.data, (err, result) => {
        if (result.ListBucketResult.Contents) {
          resolve(
            result.ListBucketResult.Contents.filter(item => {
              return item.Key[0].match(re)
            }).map(el => {
              return scrubbedFileEntry(el)
            }).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
          )
        } else {
          resolve([])
        }
      })
    })
  })
}

// This retrieves live meta from github repo
export async function getMetaFromRepo(token, file) {
  let result = {file: file}
  let response = await oK.getContent(token, dataConfig.metaDirectory + '/' + file + '.json')

  if (response !== undefined) {
    result = JSON.parse(utf8.decode(base64.decode(response.data.content)))
    // Need to unpack tileInfo back to object
    result.tileInfo = JSON.parse(result.tileInfo)
  }
  return result
}

export async function getMetaListFromRepo(token) {
  let result = []
  let response = await oK.getContent(token, dataConfig.metaDirectory)

  if (response !== undefined) result = response.data.map(item => {
    return {file: item.name.substr(0, item.name.lastIndexOf('.'))}
  })
  return result
}

// This saves meta to the github repo
export async function saveMetaFromRepo(token, meta) {
  // Package tileInfo as a string
  meta.tileInfo = JSON.stringify(meta.tileInfo)

  let response = await oK.writeFile(
    token,
    dataConfig.metaDirectory + '/' + meta.file + '.json',
    base64.encode(utf8.encode(JSON.stringify(meta, null, 2))),
    'Updated meta'
  )

  return response
}

export async function deleteMetaListFromRepo(token, fileList) {

  let responses = []
  for (const file of fileList) {
    let response = await oK.deleteFile(token, dataConfig.metaDirectory + '/' + file + '.json')
    responses.push(response)
  }

  return responses
}

export async function deleteItemsFromRepo(token, itemList) {

  let responses = []
  for (const item of itemList) {
    let response = await oK.deleteFile(token, item)
    responses.push(response)
  }

  return responses
}

export async function getPresignedPost(token, name, type, fileFormat, isPublic) {
  let response = await axios.get('/.netlify/functions/get-presigned-post?name=' + name + '&type=' + type + '&format=' + fileFormat + '&isPublic=' + isPublic, {headers: {authorization: token}})
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

export async function deleteFiles(token, files, isPublic) {
  let response = await axios.get('/.netlify/functions/delete-files?files=' + encodeURIComponent(files) + '&isPublic=' + isPublic, {headers: {authorization: token}})
  return response
}

export async function submitJob(token, job) {
  let funcUrl = '/.netlify/functions/submit-job?file=' + job.file + '&type=' + job.tileInfo.type
  if (job.tileInfo.type === 'raster') {
    funcUrl += '&ctable=' + makeColorTableParameter(job.tileInfo.colorTable)
    funcUrl += '&exact=' + ((job.tileInfo.gradient) ? 'gradient' : 'exact')
  }
  funcUrl += '&directory=' + job.directory
  let response = await axios.get(funcUrl, {headers: {authorization: token}})
  return response
}

export async function getSurveyTemplateFromRepo(token) {
  let result = {}

  let response = await oK.getContent(token, dataConfig.surveyTemplateName)

  if (response !== undefined) {
    result = JSON.parse(utf8.decode(base64.decode(response.data.content)))
  }
  return result
}

export async function saveSurveyTemplate(token, surveyTemplate) {

  let response = await oK.writeFile(
    token,
    dataConfig.surveyTemplateName,
    base64.encode(utf8.encode(JSON.stringify(surveyTemplate, null, 2))),
    'Updated survey template'
  )

  return response
}

export async function sendSurvey(survey, version) {
  let response = await axios.get(dataConfig.geoIpLookupUrl)
  survey.countryCode = response.data.country_code ? response.data.country_code : '??'
  response = await axios.put('/.netlify/functions/send-survey?version=' + version, survey)
  return response
}

export async function getFAQFromRepo(token) {
  let result = {}

  let response = await oK.getContent(token, dataConfig.faqFileName)

  if (response !== undefined) {
    result = JSON.parse(utf8.decode(base64.decode(response.data.content)))
  }
  return result
}

export async function saveFAQ(token, FAQ) {

  let response = await oK.writeFile(token, dataConfig.faqFileName, base64.encode(utf8.encode(JSON.stringify(FAQ, null, 2))), 'Updated FAQ')

  return response
}

async function getNewsItem(key) {
  let response = await axios.get(dataConfig.filesBaseUrl + key)
  return response.data
}

export function getListOfNewsItems() {
  return new Promise((resolve, reject) => {
    axios.get(dataConfig.filesBaseUrl + '?list-type=2&prefix=' + dataConfig.newsDirectory + '/&delimiter=/').then(response => {
      parseString(response.data, (err, result) => {
        if (result.ListBucketResult.Contents) {
          let p = result.ListBucketResult.Contents.map((item) => {
            return getNewsItem(item.Key[0])
          })
          Promise.all(p).then((values) => {
            resolve(values)
          })
        } else {
          resolve([])
        }
      })
    })
  })
}

export async function getListOfNewsItemsFromRepo(token) {

  let result = []

  let response = await oK.getContent(token, dataConfig.newsDirName)

  if (response === undefined) return result

  response.data.forEach(async item => {
    if (item.type === 'file') {
      let nI = await oK.getContent(token, item.path)
      result.push(JSON.parse(utf8.decode(base64.decode(nI.data.content))))
    }
  })

  return result
}

export async function getNewsItemThumb(token, key) {

  let result = await oK.getContent(token, key)

  return 'data:image/' + key.substr(key.lastIndexOf('.') + 1) + ';base64,' + result.data.content
}

export async function saveNewsItemFromRepo(token, newsItem) {

  // Save thumbnail if included
  if (newsItem.thumb && newsItem.thumb.startsWith('data:')) {
    let parts = newsItem.thumb.split(',')
    let info = parts[0].split(/[:;]/)
    let thumbKey = newsItem.key.replace(/news\//,'news/thumbs/') + '.' + info[1].split('/')[1]

    await oK.writeFile(token, thumbKey, parts[1], 'Saved news item thumbnail')

    newsItem.thumb = './' + thumbKey.replace(/news\//, '')
  }

  await oK.writeFile(token, newsItem.key, base64.encode(utf8.encode(JSON.stringify(newsItem))), 'Saved news item')

  return
}

export async function getAboutFromRepo(token) {

  let result = {}

  let response = await oK.getContent(token, dataConfig.aboutFileName)

  if (response !== undefined) {
    result = JSON.parse(utf8.decode(base64.decode(response.data.content)))
  }
  return result
}

export async function saveAbout(token, about) {

  let response = await oK.writeFile(token, dataConfig.aboutFileName, base64.encode(utf8.encode(JSON.stringify(about, null, 2))), 'Updated about')
  return response
}

export async function getContactFromRepo(token) {

  let result = {}

  let response = await oK.getContent(token, dataConfig.contactFileName)

  if (response !== undefined) {
    result = JSON.parse(utf8.decode(base64.decode(response.data.content)))
  }
  return result
}

export async function saveContact(token, contact) {
  let response = await oK.writeFile(token, dataConfig.contactFileName, base64.encode(utf8.encode(JSON.stringify(contact, null, 2))), 'Updated contact')
  return response
}

export async function publishSite(branch) {
  let response = await axios.post(dataConfig.deployHookUrl + '?trigger_branch=' + branch, 'publish')
  return response
}

export async function isPublishDue(token) {
  let response = await axios.get(dataConfig.deployDatePath)
  let deployDate = Date.parse(response.data)
  if (deployDate > 0) {
    response = await oK.getRepo(token)
    let pushedDate = Date.parse(response.data.pushed_at)
    if (deployDate < pushedDate) {
      return true
    }
  }
  return false
}

export async function getSurveyVersions(token) {
  let response = await axios.get('/.netlify/functions/get-survey-versions', {headers: {authorization: token}})
  return response.data
}

export async function getSurveyData(token, version) {
  let response = await axios.get('/.netlify/functions/get-survey-data?version=' + version, {headers: {authorization: token}})
  return response.data
}
