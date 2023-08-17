const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
