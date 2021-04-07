const mongoose = require('mongoose')
const Schema = mongoose.Schema

const refreshTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    token: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false
    }
  }
)

module.exports = mongoose.model('RefreshToken', refreshTokenSchema)