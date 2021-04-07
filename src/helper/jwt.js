require('dotenv/config')
const JWT = require('jsonwebtoken')

const models = require('../models')

const refreshToken = models.RefreshToken
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET,
  REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET

// Function to generate access token
const generateAccessToken = (user) => new Promise((resolve, reject) => {
  if (!user) reject('Please provide payload')
  const userInfo = user._doc
  delete userInfo.password
  resolve(JWT.sign(userInfo, ACCESS_SECRET, { expiresIn: '60m' }))
})

// Function to generate refresh token
const generateRefreshToken = (user) => new Promise(async (resolve, reject) => {
  if (!user) reject('Please provide payload')
  await refreshToken.deleteMany({
    user: user
  })
  const userInfo = user._doc
  delete userInfo.password
  const generatedRefreshToken = JWT.sign(userInfo, REFRESH_SECRET)
  await refreshToken.create({
    user: user,
    token: generatedRefreshToken
  })
  resolve(generatedRefreshToken)
})

// Function to verify refresh Token
const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    if (!token) reject('Please provide payload')
    JWT.verify(token, REFRESH_SECRET, async (err, user) => {
      if (err) reject(err)
      const userRefreshToken = await refreshToken.findOne({
        token
      }).populate('user')
      if (!userRefreshToken) reject('Invalid Refresh Token')
      const accessToken = await generateAccessToken(userRefreshToken._doc.user)
      resolve({
        accessToken: accessToken
      })
    })
  })
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
}