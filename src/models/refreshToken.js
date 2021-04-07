const mongoose = require('mongoose')
const Schema = mongoose.Schema

const refreshTokenSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
)

module.exports = mongoose.model('RefreshToken', refreshTokenSchema)