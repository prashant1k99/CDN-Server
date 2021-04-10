const AWS = require('aws-sdk')

const S3 = new AWS.S3({
  signatureVersion: 'v4',
  region: 'ap-south-1'
})

module.exports = {
  AWS,
  S3
}