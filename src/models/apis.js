const mongoose = require('mongoose')
const Schema = mongoose.Schema

const apiSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    apiKey: {
      type: String,
      required: true
    },
    whiteListedDomain: [
      String
    ]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Api', apiSchema)