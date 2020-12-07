// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

let marked = require('marked')

var renderer = new marked.Renderer()
renderer.link = function(href, title, text) {
    var link = marked.Renderer.prototype.link.apply(this, arguments)
    return link.replace("<a","<a target='_blank'")
};

marked.setOptions({
    renderer: renderer
})

module.exports = function (api) {
  api.loadSource(({ addSchemaResolvers }) => {
    addSchemaResolvers({
      MetaData: {
        description(obj) {
          obj.description.en = marked(obj.description.en)
          obj.description.es = marked(obj.description.es)
          return obj.description
        }
      },
      FaqData: {
        questions(obj) {
          return obj.questions.map(q => {
            q.answer.es = marked(q.answer.es)
            q.answer.en = marked(q.answer.en)
            return q
          })
        }
      }
    })
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
