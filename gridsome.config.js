// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Geoportal Provita',
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/home/**/*.md',
        typeName: 'HomeData',
        remark:{
          autolinkHeadings: false
        }
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
    }
  ]
}
