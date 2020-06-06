// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Gridsome',
  plugins: [
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
        enablePathRewrite: true, // rewrite path with locale prefix, default: true
        rewriteDefaultLanguage: true, // rewrite default locale, default: true
        messages: {
          'es-ve': require('./src/messages/messages.json').es,
          'en-us': require('./src/messages/messages.json').en
        }
      }
    } 
  ]
}
