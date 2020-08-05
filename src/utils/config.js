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
  vectorTilesBaseUrl: 'https://geoportalp.s3-us-west-2.amazonaws.com/vtiles/',
  rasterTilesBaseUrl: 'https://geoportalp.s3-us-west-2.amazonaws.com/rtiles/'
}

export const adminConfig = {
  githubInfo: {
    owner : 'jimmyangel',
    repo: 'geoportal-data'
  }
}

export const dataConfig = {
  metaBaseUrl: 'https://raw.githubusercontent.com/jimmyangel/geoportal-data/master/',
  filesBaseUrl: 'https://geoportalp.s3-us-west-2.amazonaws.com/',
  filesDirectory: 'files',
  metaFileName: 'meta-p.json'
}
