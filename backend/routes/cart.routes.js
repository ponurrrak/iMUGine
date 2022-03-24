const router = require('express').Router();
const ObjectId = require('mongodb').ObjectId;
const querySanitize = require('mongo-sanitize');

const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { parseErrors } = require('../utils/utils');

router.get('/', async (req, res) => {
  try {
    let cartFound;
    if(ObjectId.isValid(req.session.imugineCartId)) {
      cartFound = await Cart.findById(querySanitize(req.session.imugineCartId));
    }
    if(cartFound) {
      res.json(cartFound);
    } else {
      res.json({});
    }
  } catch(err) {
    res.status(500).json({ message: parseErrors(err) });
  }
});

router.post('/', async (req, res) => {
  try {
    if(req.session.imugineCartId) {
      res.status(400).json({ message: 'Bad request' });
    } else {
      let productFound;
      if(ObjectId.isValid(req.body.product)) {
        productFound = await Product.findById(querySanitize(req.body.product));
      }
      if(!productFound) {
        res.status(404).json({ message: 'Not found' });
      } else {
        const cartItem = {
          product: req.body.product,
          message: req.body.message,
          count: 1,
        };
        let newCart = new Cart({ products: [cartItem] });
        newCart = await newCart.save();
        req.session.imugineCartId = newCart._id;
        res.json(newCart.products[0]);
      }
    }
  } catch(err) {
    res.status(500).json({ message: parseErrors(err) });
  }
});

router.put('/', async (req, res) => {
  try {
    let cartFound;
    if(ObjectId.isValid(req.session.imugineCartId)) {
      cartFound = await Cart.findById(req.session.imugineCartId);
    }
    if(cartFound && !cartFound.closed) {
      let indexForRes;
      const { product, message } = req.body;
      const count = Number(req.body.count);
      const doc = {
        product,
        count,
        message,
      };
      const cartItemIndex = cartFound.products.findIndex(item => item.product.toString() === product);
      if(cartItemIndex === -1) {
        let productFound;
        if(ObjectId.isValid(product)) {
          productFound = await Product.findById(querySanitize(product));
        }
        if(productFound) {
          cartFound.products.push(doc);
          indexForRes = cartFound.products.length - 1;
        }
      } else {
        if(count === 0) {
          cartFound.products.splice(cartItemIndex, 1);
          await cartFound.save();
          res.json({
            product,
            count,
          });
          return;
        }
        cartFound.products.splice(cartItemIndex, 1, doc);
        indexForRes = cartItemIndex;
      }
      if(typeof indexForRes === 'number') {
        cartFound = await cartFound.save();
        res.json(cartFound.products[indexForRes]);
        return;
      }
    }
    if(!req.session.imugineCartId || (cartFound && cartFound.closed)) {
      res.status(400).json({ message: 'Bad request' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch(err) {
    res.status(500).json({ message: parseErrors(err) });
  }
});

router.get('/status', async (req, res) => {
  try {
    let cartFound;
    if(ObjectId.isValid(req.session.imugineCartId)) {
      cartFound = await Cart.findById(querySanitize(req.session.imugineCartId));
    }
    if(cartFound) {
      let status;
      if(cartFound.closed) {
        status = false;
      } else if(cartFound.products.length > 0) {
        status = true;
      }
      if(typeof status === 'boolean') {
        cartFound.closed = status;
        cartFound = await cartFound.save();
        res.json({closed: cartFound.closed});
        return;
      }
    }
    res.status(400).json({ message: 'Bad request' });
  } catch(err) {
    res.status(500).json({ message: parseErrors(err) });
  }
});

module.exports = router;
