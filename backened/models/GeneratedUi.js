const mongoose = require('mongoose');

const generatedUISchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  codeInput: String,
  uiOutput: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GeneratedUI', generatedUISchema);


