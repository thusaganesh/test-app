const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  Item_no: { type: String, Number: true },
  title: { type: String, required: true },
  description: String,
  price: { type: Number, default: 0 },
  category: String,
  quantity: { type: Number, default: 0 },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);
