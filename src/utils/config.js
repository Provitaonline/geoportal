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
    owner : 'Provitaonline',
    repo: 'geoportal-data'
  },
  maxNewsImageKB: 500
}

export const dataConfig = {
  filesBaseUrl: 'https://' + awsConfig.bucket + '.s3-' + awsConfig.region + '.amazonaws.com/',
  filesDirectory: 'files',
  privateFilesDirectory: 'pfiles',
  cBundlesDirectory: 'cbundles/tarfiles/',
  cBundlesExtension: '.tar',
  newsDirectory: 'news',
  metaFileName: 'meta.json',
  metaDirectory: 'meta',
  surveyTemplateName: 'survey-template.json',
  faqFileName: 'faq.json',
  collectionsFileName: 'collections.json',
  collectionItems: 'collection-items.json',
  contactFileName: 'contact.json',
  aboutFileName: 'about.json',
  newsDirName: 'news',
  deployHookUrl: 'https://api.netlify.com/build_hooks/5f613a7b19eca57156ffbe80',
  deployDatePath: '/deployDate.txt',
  geoIpLookupUrl: 'https://json.geoiplookup.io'
}
