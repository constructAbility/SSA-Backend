const Cart = require('../models/Cart');
const axios = require('axios');



exports.addToCart = async (req, res) => {
  const { productId, productname, quantity: rawQty, phone ,img } = req.body;
  const userId = req.user._id;

  if (!productId || !productname || rawQty === undefined|| !phone || !img) {
    return res.status(400).json({ message: 'productId, productname, and quantity are required' });
  }

  const quantity = Number(rawQty);
  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a valid positive number' });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const index = cart.items.findIndex(
  item => item.productId.toString() === productId.toString()
);

      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ productId, productname, phone ,quantity ,img });
      }
    } else {
      cart = new Cart({
        userId,
        items: [{ productId, productname, quantity , phone ,img}]
      });
    }

    await cart.save();


    const { name, email, phone } = req.user;
    try {
      if (process.env.INTERNAL_API_BASE) {
        await axios.post(`${process.env.INTERNAL_API_BASE}/api/cart-entry`, {
          username: name,
          email,
          phone,
          productId,
          productname,
          quantity
        });
      }
    } catch (apiErr) {
      console.error('Internal API call failed:', apiErr.message);
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error('Cart Add Error:', err);
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};


exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id.toString() });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};
exports.delCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { productId } = req.params; 

    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

   
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (err) {
    console.error('Delete Cart Item Error:', err);
    res.status(500).json({ message: 'Error deleting cart item', error: err.message });
  }
};

