const express = require('express')

const helpers = require('../../helper'),
  middlewares = require('../../middlewares'),
  data = require('../../models')

const router = express.Router(),
  uniqueKeyGenerator = helpers.generateUniqueId,
  API = data.Api,
  authTokenValidator = middlewares.authTokenValidator

router.get('/', authTokenValidator, (req, res) => {
  try {
    const userAPIKeys = await apiKeys.find({
      user: req.user._id
    })
    const keys = userAPIKeys.map((key) => {
      delete key.user
      delete key._id
      return key
    })
    console.log(keys)
  } catch (err) {
    console.log(err)
    res.status(500).send('Something Went Wrong')
  }
})

router.post('/', authTokenValidator, async (req, res) => {
  try {
    const uniquKey = uniqueKeyGenerator()
    const apiKey = uniquKey.next().value
    await API.create({
      user: req.user._id,
      apiKey
    })
    res.status(200).send({
      api: apiKey
    })
  } catch (err) {
    console.log(err)
    res.status(500).send('Something went wrong')
  }
})

router.delete('/:id', authTokenValidator, async (req, res) => {
  try {
    const apiKey = await API.deleteOne({
      _id: req.params.id,
      user: req.user._id
    })
    if (!apiKey) return res.status(401).send('No Such API Key exists for the user.')
    res.status(200)
  } catch (err) {
    console.log(err)
    res.status(500).send('Something went wrong')
  }
})

router.update('/:id', authTokenValidator, async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) return res.status(400).send('Payload is not provided.')
    if (typeof req.body.domains !== 'object') return res.status(400).send('Incorrect Payload.')
    await API.updateOne({
      _id: req.params.id,
      user: req.user._id
    }).set('whiteListedDomain', req.body.domains)
    res.status(200)
  } catch (err) {
    console.log(err)
    res.status(500).send('Something went wrong')
  }
})

module.exports = router