const express = require('express')
const cors = require('cors')

const routes = require('./routes')

const corsOption = {
  origin: '*',
  optionsSuccessStatus: 200
}
const app = express()

app.use(express.json())
app.disable('x-powered-by')
app.use(cors(corsOption))

app.use('/auth', routes.authRoute)
app.use('/api', routes.apiRoute)
app.use('/upload', routes.uploadRoute)
app.use('/file', routes.fileRoute)
app.use('/', (req, res) => res.send('Hello'))

module.exports = app