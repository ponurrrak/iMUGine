const router = require('express').Router();
const ObjectId = require('mongodb').ObjectId;
const querySanitize = require('mongo-sanitize');

const { Product } = require('../models/product.model');
const { parseErrors } = require('../utils/utils');

router.get('/', async (req, res) => {
  try {
    const result = await Product
      .find()
      .select('_id name price photos')
      .slice('photos', 1);
    if(!result.length) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(result);
    }
  }
  catch(err) {
    res.status(500).json({ message: parseErrors(err) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let result;
    if(ObjectId.isValid(req.params.id)) {
      result = await Product.findById(querySanitize(req.params.id));
    }
    if(!result) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(result);
    }
  }
  catch(err) {
    res.status(500).json({ message: parseErrors(err) });
  }
});

module.exports = router;
