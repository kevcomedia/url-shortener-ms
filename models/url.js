const mongoose = require('mongoose');
const {Schema} = mongoose;

const urlSchema = new Schema({
  original: {
    type: String,
    required: true,
    match: /^https?:\/\/.+/,
  },
  shortened: {
    type: String,
    required: true,
  },
});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
