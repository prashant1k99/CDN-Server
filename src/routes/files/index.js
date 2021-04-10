require('dotenv/config')
const express = require('express')

const helpers = require('../../helper'),
  middlewares = require('../../middlewares')

const router = express.Router(),
  S3 = helpers.S3,
  getImageFromS3Promise = helpers.getImageFromS3Promise,
  APIValidator = middlewares.APIValidator

router.use(APIValidator)

router.get('/img/:img', async (req, res) => getImageFromS3Promise(req, res).catch((err) => console.log(err)))

router.get('/:w/:img', async (req, res) => getImageFromS3Promise(req, res).catch((err) => console.log(err)))

router.delete('/:img', (req, res) => {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${req.user._id}/${req.params.img}`
    }
    const data = S3.deleteObject(params).promise()
    data.then(() => res.status(200))
  } catch (err) {
    console.log(err)
    res.status(500).send('Something Went Wrong')
  }
})

module.exports = router