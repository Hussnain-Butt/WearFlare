const mongoose = require('mongoose')

const avatarSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    required: true,
  },
  bodyMeasurements: {
    height: Number,
    weight: Number,
    chest: Number,
    waist: Number,
    hips: Number,
  },
  bodyFeatures: {
    skinTone: String,
    hairColor: String,
    eyeColor: String,
    bodyType: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Avatar', avatarSchema)
