import GitHub from 'github-api'
import axios from 'axios'

export async function getMetaEntries() {
  let result = {}
  let response = await axios.get('https://raw.githubusercontent.com/jimmyangel/geoportal-data/master/meta.json')
  return response.data
}

export async function getFileSize(fileName) {
  let response = await axios.head('https://geoportalp.s3-us-west-2.amazonaws.com/files/' + fileName)
  return response.headers['content-length']
}
