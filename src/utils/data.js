import axios from 'axios'
import yaml from 'js-yaml'

export async function getMetaEntries() {
  let result = {}
  let response = await axios.get('https://raw.githubusercontent.com/jimmyangel/geoportal-data/master/meta.yaml')
  try {
    result = yaml.safeLoad(response.data)
  } catch (e) {
    console.error(e.name, e.message)
  }
  return result
}
