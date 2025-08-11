const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    quotationNumber:{type:String,unique:true,require:true},
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now },
  customer: {
    email: String,
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    img:String
  },
  items: [
    {
      productId: String,
      productname: String,
      price: Number,
      quantity: Number,
    }
  ],
 
});

module.exports = mongoose.model('Order', orderSchema);
