const JWTMethods = require('./jwt')
const generateUniqueId = require('./generateUniqueKey')
const { AWS, S3 } = require('./AWS')
const { uploadFile, presignedUploadUrl } = require('./fileUpload')

module.exports = {
  generateAccessToken: JWTMethods.generateAccessToken,
  generateRefreshToken: JWTMethods.generateRefreshToken,
  verifyRefreshToken: JWTMethods.verifyRefreshToken,
  generateUniqueId,
  AWS,
  S3,
  uploadFile,
  presignedUploadUrl
}