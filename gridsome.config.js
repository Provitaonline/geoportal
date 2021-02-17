// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const siteUrl = 'https://geoportal.provita.org.ve'
const siteName = 'Geoportal Provita'

module.exports = {
  siteUrl: siteUrl,
  siteName: siteName,
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'data/survey-template.json',
        typeName: 'UserSurveyTemplate'
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'data/about/**/*.md',
        typeName: 'AboutData',
        remark:{
          autolinkHeadings: false
        }
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'data/faq.json',
        typeName: 'FaqData'
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'data/contact.json',
        typeName: 'ContactData',
        remark:{
          autolinkHeadings: false
        }
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'data/meta/*.json',
        typeName: 'MetaData'
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'data/news/*.json',
        typeName: 'NewsData'
      }
    },
    {
      use: "gridsome-plugin-i18n",
      options: {
        locales: [ // locales list
          'es-ve',
          'en-us'
        ],
        pathAliases: { // path segment alias for each locales
          'es-ve': 'es',
          'en-us': 'en'
        },
        fallbackLocale: 'es-ve', // fallback language
        defaultLocale: 'es-ve', // default language
        dateTimeFormats: {
          'en-us': {
            short: {
              year: 'numeric', month: 'numeric', day: 'numeric'
            },
            long: {
              year: 'numeric', month: 'short', day: 'numeric',
              hour: 'numeric', minute: 'numeric'
            }
          },
          'es-ve': {
            short: {
              year: 'numeric', month: 'numeric', day: 'numeric'
            },
            long: {
              year: 'numeric', month: 'short', day: 'numeric',
              hour: 'numeric', minute: 'numeric', hour12: true
            }
          }
        },
        enablePathRewrite: true, // rewrite path with locale prefix, default: true
        rewriteDefaultLanguage: false, // rewrite default locale, default: true
        messages: {}
      }
    },
    {
      use: 'gridsome-plugin-rss',
      options: {
        contentTypeName: 'NewsData',
        feedOptions: {
          title: 'Noticias ' + siteName,
          site_url: siteUrl
        },
        latest: true,
        language: 'es',
        feedItemOptions: node => ({
          title: node.headline.es,
          description: node.text.es,
          date: node.date,
          url: siteUrl + '/news'
        }),
        output: {
          dir: './static',
          name: 'rss-es.xml'
        }
      }
    },
    {
      use: 'gridsome-plugin-rss',
      options: {
        contentTypeName: 'NewsData',
        feedOptions: {
          title: siteName + ' News',
          site_url: siteUrl
        },
        latest: true,
        language: 'en',
        feedItemOptions: node => ({
          title: node.headline.en,
          description: node.text.en,
          date: node.date,
          url: siteUrl + '/en/news'
        }),
        output: {
          dir: './static',
          name: 'rss-en.xml'
        }
      }
    },
    {
      use: '@gridsome/plugin-sitemap',
      options: {
        exclude: ['/admin', '/en/admin', '/es', '/es/*', '/en/404']
      }
    }/*,
    'gridsome-plugin-robots-txt'*/
  ]
}
