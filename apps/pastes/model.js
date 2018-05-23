let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define the format of a paste
let PasteSchema = new Schema(
  {
    message: { type: String, required: true },
    tags: [String],
    marked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
  }
);

PasteSchema.pre('save', next => {
  now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('paste', PasteSchema);
