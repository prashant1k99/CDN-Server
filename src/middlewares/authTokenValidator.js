require('dotenv/config')
const JWT = require('jsonwebtoken')

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET

const validateAuthToken = (req, res, next) => {
  try {
    const authHeader = req.headers && req.headers['authorization']
    if (!authHeader) {
      return res.status(401).send('No Auth header')
    }
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).send('No Auth header')
    }
    JWT.verify(token, ACCESS_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  } catch (err) {
    res.status(500).send(err)
  }
}

module.exports = validateAuthToken