const config = {
  credentials: {
    accessKeyId: process.env.GEOPORTALP_AWS_ACCESS_KEY,
    secretAccessKey : process.env.GEOPORTALP_AWS_SECRET
  },
  region: 'us-east-2',
  bucket: 'geoportalp-files',
  githubInfo: {
    owner : 'Provitaonline',
    repo: 'geoportal-data'
  }
}

module.exports = {
  config: config
}
