import { Octokit } from '@octokit/rest'

import base64 from 'base-64'
import utf8 from 'utf8'
import {adminConfig} from '~/utils/config'

async function getSha(token, path) {

  let octokit = new Octokit({auth: token})
  let response

  try {
    response = await octokit.repos.getContent({
      owner: adminConfig.githubInfo.owner,
      repo: adminConfig.githubInfo.repo,
      path: path,
      headers: {'If-None-Match': ''}
    })
  } catch (err) {
    if (err.status != 404) {
      throw err
    }
  }
  if (response && response.data) return response.data.sha

  return null
}

export async function writeFile(token, path, content, message) {

  let octokit = new Octokit({auth: token})

  let sha = await getSha(token, path)

  try {
    let response = await octokit.repos.createOrUpdateFileContents({
      owner: adminConfig.githubInfo.owner,
      repo: adminConfig.githubInfo.repo,
      path: path,
      sha: sha,
      content: content,
      message: message
    })
  } catch (err) {
    throw err
  }
}

export async function deleteFile(token, path) {
  let octokit = new Octokit({auth: token})

  let sha = await getSha(token, path)

  let response = await octokit.repos.deleteFile({
    owner: adminConfig.githubInfo.owner,
    repo: adminConfig.githubInfo.repo,
    path: path,
    sha: sha,
    message: 'Deleted file'
  })

  return response
}

export async function getContent(token, path) {

  let octokit = new Octokit({auth: token})

  let response

  try {
    response = await octokit.repos.getContent({
      owner: adminConfig.githubInfo.owner,
      repo: adminConfig.githubInfo.repo,
      path: path,
      headers: {'If-None-Match': ''}
    })
  } catch (err) {
    if (err.status != 404) {
      throw err
    }
  }

  return response
}

export async function getRepo(token) {

  let octokit = new Octokit({auth: token})

  let response = await octokit.repos.get({
    owner: adminConfig.githubInfo.owner,
    repo: adminConfig.githubInfo.repo,
    headers: {'If-None-Match': ''}
  })

  return response
}
