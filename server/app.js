import {Nuxt, Builder} from 'nuxt'
import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'
import responseTime from 'response-time'
import cors from 'cors'
import config from './config'
import nuxtConfig from '../nuxt.config.js'
import routes  from './routes'
const app = express()
const nuxt = new Nuxt(nuxtConfig)
const builder = new Builder(nuxt)

app.enable('trust proxy')
app.disable('x-powered-by')
app
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json({limit: "5MB"}))
  .use(bodyParser.raw({
    limit: '1MB',
    type: ['image/svg+xml'],
  }))
  .use(responseTime())
  .use(cors())
  .use(express.static(path.join( __dirname, './assets')))
  .use('/', routes)

const isProd = process.env.NODE_ENV === 'production'
nuxtConfig.dev = !isProd
const promise = (isProd ? Promise.resolve() : builder.build({}))

promise.then(() => {
  app.use(nuxt.render)
  app.listen(config.port || 3030)
  console.log(`Server is listening on http://localhost:${config.port || 3030}`)
})
.catch((error) => {
  console.error(error)
  process.exit(1)
})

export default app
