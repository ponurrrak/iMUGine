const router = require('express').Router();
const ObjectId = require('mongodb').ObjectId;

const Order = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { parseErrors, countTotalSum } = require('../utils/utils');

router.post('/', async (req, res) => {
  try {
    let cartFound;
    if(ObjectId.isValid(req.session.imugineCartId)) {
      cartFound = await Cart.findById(req.session.imugineCartId)
        .deepPopulate('products.product');
    }
    if(cartFound && cartFound.closed) {
      let newOrder = new Order({client: req.body});
      newOrder.orderList = cartFound.products;
      newOrder.orderTotal = countTotalSum(cartFound.products);
      newOrder = await newOrder.save();
      await Cart.deleteOne({ _id: req.session.imugineCartId });
      delete req.session.imugineCartId;
      res.json({orderId: newOrder._id});
      return;
    }
    res.status(400).json({ message: 'Bad request' });
  } catch(err) {
    res.status(500).json({ message: parseErrors(err) });
  }
});

module.exports = router;
