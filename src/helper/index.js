const JWTMethods = require('./jwt')
const generateUniqueId = require('./generateUniqueKey')

module.exports = {
  generateAccessToken: JWTMethods.generateAccessToken,
  generateRefreshToken: JWTMethods.generateRefreshToken,
  verifyRefreshToken: JWTMethods.verifyRefreshToken,
  generateUniqueId
}