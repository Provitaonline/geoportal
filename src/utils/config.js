export const awsConfig = {
  bucket: 'geoportalp-files',
  region: 'us-east-2'
}

export const mapConfig = {
  styles: [
    {
        title: 'topo',
        uri:'/mapstyles/topo.json'
    },
    {
        title: 'osm',
        uri:'/mapstyles/osm.json'
    },
    {
        title: 'simple',
        uri:'/mapstyles/simple.json'
    },
    {
        title: 'ng',
        uri:'/mapstyles/ng.json'
    },
    {
        title: 'satellite',
        uri:'/mapstyles/satellite.json'
    }
  ],
  mapCenter: [-66.58, 6.42],
  mapZoom: 5,
  maxBounds: [[-82, -3], [-54, 20]],
  maxZoom: 14,
  mapBearing: 0,
  mapPitch: 0,
  vectorTilesBaseUrl: 'https://' + awsConfig.bucket + '.s3-' + awsConfig.region + '.amazonaws.com/vtiles/',
  rasterTilesBaseUrl: 'https://' + awsConfig.bucket + '.s3-' + awsConfig.region + '.amazonaws.com/rtiles/'
}

export const adminConfig = {
  githubInfo: {
    owner : 'jimmyangel',
    repo: 'geoportal-data'
  },
  maxNewsImageKB: 100
}

export const dataConfig = {
  metaBaseUrl: 'https://raw.githubusercontent.com/jimmyangel/geoportal-data/master/',
  filesBaseUrl: 'https://' + awsConfig.bucket + '.s3-' + awsConfig.region + '.amazonaws.com/',
  filesDirectory: 'files',
  newsDirectory: 'news',
  metaFileName: 'meta.json',
  surveyTemplateName: 'survey-template.json',
  faqFileName: 'faq.json',
  aboutDirName: 'about',
  aboutLocItems: [
    {fieldName: 'abouten', filePath: '/en-us/content.md', frontMatter: '---\ntitle: About\nlocale: en-us\n---\n'},
    {fieldName: 'aboutes', filePath: '/es-ve/content.md', frontMatter: '---\ntitle: Acerca de\nlocale: es-ve\n---\n'}
  ],
  deployHookUrl: 'https://api.netlify.com/build_hooks/5f613a7b19eca57156ffbe80'
}
