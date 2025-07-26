const Cart = require('../models/Cart');
const axios = require('axios');

exports.addToCart = async (req, res) => {
  const { productId, name, price, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ userId });
    const total = price * quantity;

    if (cart) {
      const index = cart.items.findIndex(item => item.productId === productId);
      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ productId, name, price, quantity });
      }
      cart.totalAmount += total;
    } else {
      cart = new Cart({
        userId,
        items: [{ productId, name, price, quantity }],
        totalAmount: total
      });
    }

    await cart.save();

    // ✅ Call /sheet/cart-entry route internally
const { name, email, phone ,productname} = req.user;

await axios.post(`${process.env.INTERNAL_API_BASE}/api/cart-entry`, {
  username: name,
  email,
  phone,
  productId,
  productname: productname,
  price,
  quantity,
  total
});



    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};


exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
};
