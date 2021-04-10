const express = require('express')
const multer = require('multer')

const helpers = require('../../helper'),
  middlewares = require('../../middlewares')

const router = express.Router(),
  uploadFile = helpers.uploadFile,
  presignedUploadUrl = helpers.presignedUploadUrl,
  APIValidator = middlewares.APIValidator

router.use(APIValidator)

const storage = multer.memoryStorage({
  destination: function (_, __, callback) {
    callback(null, '')
  }
})
const upload = multer({ storage }).single('image')

router.get('/', (req, res) => {
  presignedUploadUrl(req).then(data => res.status(200).send(data)).catch(err => {
    console.log(err)
    res.status(500).send('Something went wrong')
  })
})

router.post('/', upload, (req, res) => {
  try {
    await uploadFile(req)
    res.status(200)
  } catch (err) {
    console.log(err)
    res.status(500).send('Something Went Wrong')
  }
})

module.exports = router