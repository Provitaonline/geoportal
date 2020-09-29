// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = function (api) {
  api.loadSource(({ addCollection }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
  })

  api.createPages(async ({ createPage, graphql }) => {
    const { data } = await graphql(`{
      allNewsData {
        edges {
          node {
            yyyymm
          }
        }
      }
    }`)

    let yyyymm = {}

    data.allNewsData.edges.forEach(({ node }) => {
      if (!yyyymm[node.yyyymm]) yyyymm[node.yyyymm] = true
    })

    for (const k in yyyymm) {
      createPage({
        path: `/news/${k}`,
        component: './src/templates/News.vue',
        context: {
          yyyymm: k
        }
      })
    }
  })
}
