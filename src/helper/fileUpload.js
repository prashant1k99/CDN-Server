const { S3 } = require('./AWS')

const BUCKET_NAME = process.env.BUCKET_NAME

const uploadFile = (req) =>
  new Promise((resolve, reject) => {
    const destparams = {
      Bucket: BUCKET_NAME,
      Key: `${req.user._id}/${req.params.img}`,
      Body: req.file.buffer,
      ContentType: 'image'
    }
    S3.putObject(destparams)
      .promise()
      .then(() => resolve(true))
      .catch((err) => {
        console.log(err)
        reject(err)
      })
  })

const presignedUploadUrl = (req) => new Promise((resolve, reject) => {
  const s3Params = {
    Bucket: BUCKET_NAME,
    Key: `${req.user._id}/${req.params.fileName}`,
    ContentType: req.headers['content-type'],
    ACL: 'private'
  }
  const response = S3.getSignedUrlPromise('putObject', s3Params)
  response
    .then((url) => {
      resolve({
        uploadURL: url
      })
    })
    .catch((err) => reject(err))
})

module.exports = {
  uploadFile,
  presignedUploadUrl
}