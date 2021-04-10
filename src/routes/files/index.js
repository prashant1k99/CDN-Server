require('dotenv/config')
const express = require('express')
const axios = require('axios')
const sharp = require('sharp')

const helpers = require('../../helper'),
  middlewares = require('../../middlewares')

const router = express.Router(),
  S3 = helpers.S3,
  getImageFromS3Promise = helpers.getImageFromS3Promise,
  getFullImageFromS3 = helpers.getFullImageFromS3,
  APIValidator = middlewares.APIValidator

router.use(APIValidator)

router.get('/url/:w', async (req, res) => {
  try {
    const width = req.params.w && typeof parseInt(req.params.w) === 'number' ? parseInt(req.params.w) : 450
    const transformer = (w) =>
      sharp().resize(w).jpeg({
        quality: 5
      })
    axios({
      url: req.query.img,
      responseType: 'stream',
    }).then(
      response =>
        new Promise((resolve, reject) => {
          response.data
            .pipe(transformer(width))
            .on('finish', () => resolve())
            .on('error', e => reject(e))
            .pipe(res)
        }))
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

router.get('/img/:img', async (req, res) => getFullImageFromS3(req, res).catch((err) => console.log(err)))

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