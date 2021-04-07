require('dotenv/config')
const mongoose = require('mongoose')

const app = require('./src')

const PORT = process.env.PORT || 3000
const mongooseURI = process.env.MONGOOSE_URI

mongoose
  .connect(mongooseURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`🚀  Server ready http://localhost:${PORT}`)
    })
  )
  .catch((err) => console.log(err))