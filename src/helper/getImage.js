require('dotenv/config')
const sharp = require('sharp')

const { S3 } = require('./AWS')

const BUCKET_NAME = process.env.BUCKET_NAME

const getImageFromS3Promise = (req, res) =>
  new Promise((resolve, reject) => {
    const width = req.params.w && typeof parseInt(req.params.w) === 'number' ? parseInt(req.params.w) : 450
    const transformer = (w) =>
      sharp().resize(w).jpeg({
        quality: 5
      })
    const resStream = S3
      .getObject({
        Bucket: BUCKET_NAME,
        Key: `${req.user._id}/${req.params.img}`
      })
      .createReadStream()
      .on('error', (err) => {
        res.status(400).send(err.message)
        reject(err)
      })
      .pipe(transformer(width))
      .on('error', (err) => {
        console.log(err)
        res.status(500).send(err.message)
        reject(err)
      })
      .pipe(res)
    resStream.on('error', (error) => reject(error))
    req.on('close', () => {
      resStream.destroy()
      resolve()
    })
  })

const getFullImageFromS3 = (req, res) =>
  new Promise((resolve, reject) => {
    const resStream = S3
      .getObject({
        Bucket: BUCKET_NAME,
        Key: `${req.user._id}/${req.params.img}`
      })
      .createReadStream()
      .on('error', (err) => {
        res.status(400).send(err.message)
        reject(err)
      })
      .pipe(res)
    resStream.on('error', (error) => reject(error))
    req.on('close', () => {
      resStream.destroy()
      resolve()
    })
  })

module.exports = {
  getImageFromS3Promise,
  getFullImageFromS3
}