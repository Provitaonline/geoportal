const config = {
  credentials: {
    accessKeyId: process.env.GPAWS_ACCESS_KEY,
    secretAccessKey : process.env.GPAWS_SECRET
  },
  region: 'us-west-2',
  githubInfo: {
    owner : 'jimmyangel',
    repo: 'geoportal-data'
  }
}

module.exports = {
  config: config
}
