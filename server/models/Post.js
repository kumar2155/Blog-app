const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 5, maxlength: 120 },
  imageURL: { type: String },
  content: { type: String, required: true, minlength: 50 },
  username: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
module.exports = mongoose.model('Post', PostSchema);
