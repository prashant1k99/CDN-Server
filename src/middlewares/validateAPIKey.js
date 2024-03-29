const data = require('../models')

const API = data.Api

const validateAPIkey = async (req, res, next) => {
  try {
    const originURL = req.headers.origin
    const userKey = req.query.api
    if (!userKey) return res.status(401).send('No API key provided')
    const fetchedKey = await API.findOne({
      apiKey: userKey
    }).populate('user')
    if (!fetchedKey) return res.status('401').send('Invalid API key.')
    const domainsWhitelistedForKey = fetchedKey._doc.whiteListedDomain
    if (domainsWhitelistedForKey.length === 0) {
      req.user = fetchedKey._doc.user
      return next()
    }
    if (domainsWhitelistedForKey.includes(originURL)) {
      req.user = fetchedKey._doc.user
      return next()
    }
    res.status('401').send('Request domain is not allowed for the API key.')
  } catch (err) {
    res.status(500).send(err)
  }
}

module.exports = validateAPIkey