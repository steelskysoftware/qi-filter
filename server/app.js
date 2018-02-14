import {Nuxt, Builder} from 'nuxt'
import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'
import responseTime from 'response-time'
import cors from 'cors'
import config from './config'
import routes  from './routes'
const app = express()

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
  .use('/', routes)

app.listen(config.port || 3030)
console.log(`Server is listening on http://localhost:${config.port || 3030}`)

export default app
