module.exports = {
  env: {
    baseUrl: process.env.NODE_ENV === 'production' ? 'https://qifilter.com/api' : 'http://localhost:3030',
  },
  plugins: [

  ],
  modules: [
    ['@nuxtjs/google-analytics']
  ],
 'google-analytics': {
    id: 'UA-114037982-1'
  },
  head: {
    title: 'QI (Quite Interesting) Episode Filter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no, minimal-ui' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { hid: 'description', name: 'description', content: 'QI filter generates a list of episodes from the show QI (Quite Interesting) based on your filter criteria. Include or exclude panelists, or combine the two.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { href: 'https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700,800&amp;subset=latin,cyrillic,cyrillic-ext,latin-ext', rel: 'stylesheet', type: 'text/css' },
    ]
  },
  loading: { color: '#3B8070' },
  build: {
    vendor: [
      
    ],
    stats: false,
    babel: {
      plugins: [
        [
          'babel-plugin-transform-decorators-legacy',
        ]
      ]
    },
    extend(config, { isDev, isClient }) {
      if(isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      const urlLoader = config.module.rules.find(loader => {
        return loader.loader === 'url-loader' &&
          (loader.options &&
          loader.options.name &&
          loader.options.name.includes('img'))
      })
      urlLoader.options.limit = 5000
    }
  }
}
