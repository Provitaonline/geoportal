import GitHub from 'github-api'
import axios from 'axios'

export async function getMetaEntries() {
  let result = {}
  let response = await axios.get('https://raw.githubusercontent.com/jimmyangel/geoportal-data/master/meta.json')
  return response.data
  /*console.log(response)
  try {
    result = JSON.parse(response.data)
  } catch (e) {
    console.error(e.name, e.message)
  }
  return result*/
}
