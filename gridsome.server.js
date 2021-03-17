// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

let marked = require('marked')

var renderer = new marked.Renderer()
renderer.link = function(href, title, text) {
    var link = marked.Renderer.prototype.link.apply(this, arguments)
    if (link.includes('href="http')) return link.replace("<a","<a target='_blank'")
    return link
};

marked.setOptions({
    renderer: renderer
})

module.exports = function (api) {

  // Pre-define NewsData schema to avoid missing data schema errors
  api.loadSource(({ addSchemaTypes }) => {
    addSchemaTypes(`
      type NewsData implements Node {
        headline: TextLang
        text: TextLang
        date: Date
        key: String
        reference: String
        thumb: Image
        yyyymm: Date
      }
      type TextLang {
        en: String
        es: String
      }
    `)
  })

  // Load markdown so the client doesn't have to do it
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
      },
      NewsData: {
        text(obj) {
          obj.text.en = marked(obj.text.en)
          obj.text.es = marked(obj.text.es)
          return obj.text
        }
      },
    })
  })

  // Create YearMonth News pages
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

  // Add hash code field to metadata nodes
  api.onCreateNode(options => {

    function hashCode(str) {
        var hash = 0, i = 0, len = str.length;
        while ( i < len ) {
            hash  = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
        }
        return hash;
    }

    if (options.internal.typeName === 'MetaData') {
      return { ...options, hashCode: hashCode(options.file) }
    }
  })
}
