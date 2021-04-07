const express = require('express'),
  bcrypt = require('bcrypt')

const helpers = require('../../helper'),
  middlewares = require('../../middlewares'),
  data = require('../../models')

const router = express.Router(),
  users = data.User,
  refreshTokens = data.RefreshToken,
  generateAccessToken = helpers.generateAccessToken,
  generateRefreshToken = helpers.generateRefreshToken,
  verifyRefreshToken = helpers.verifyRefreshToken,
  authTokenValidator = middlewares.authTokenValidator

router.post('/signup', async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) return res.status(400).send('Payload is not provided.')
    if (!req.body.email || !req.body.password) return res.status(400).send('Insufficient payload provided.')
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const info = {
      ...req.body,
      password: hashedPassword
    }
    const createdUser = await users.create(info).catch(err => {
      if (err.message.includes('dup key'))
        return res.status(500).send('User with the email already exists.')
      return res.status(500).send('Something went wrong.')
    })
    const accessToken = await generateAccessToken(createdUser)
    const refreshToken = await generateRefreshToken(createdUser)
    res.status(201).send({
      accessToken: accessToken,
      refreshToken: refreshToken
    })
  } catch (err) {
    res.status(500).send(err)
  }
})

router.post('/token', (req, res) => {
  const userRefreshToken = req.body && req.body.token
  if (!userRefreshToken) return res.sendStatus(401)
  verifyRefreshToken(userRefreshToken).then(data => {
    res.status(200).json(data)
  }).catch((err) => {
    res.status(403).send(err)
  })
})

router.post('/login', async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0 || !req.body.password || !req.body.email) return res.status(400).send('Payload is not provided.')
    const user = await users.findOne({
      email: req.body.email
    })
    if (!user) return res.status(422).send('User with the email does not exists.')
    if (await bcrypt.compare(req.body.password, user._doc.password)) {
      const [accessToken, refreshToken] = await Promise.all([
        generateAccessToken(user),
        generateRefreshToken(user)
      ])
      return res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken
      })
    }
    res.status(422).send('Invalid password')
  } catch (err) {
    res.status(500).send(err)
  }
})

router.delete('/logout', authTokenValidator, async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0 || !req.body.token) return res.status(400).send('Payload is not provided.')
    const refreshTokenLookup = await refreshTokens.findOneAndDelete({
      user: req.user._id,
      token
    })
    if (!refreshTokenLookup) return res.status(400).send('Incorrect Payload')
    res.status(200).send('Success')
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router