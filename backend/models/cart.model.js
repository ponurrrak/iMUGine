const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

class Quantity extends mongoose.SchemaType {
  constructor(key, options) {
    super(key, options, 'Quantity');
  }
  cast(val) {
    if(!(typeof val === 'number' && val > 0 && val % 1 === 0)){
      throw new Error('Amount of products ' + val + ' is not a positive integer');
    }
    return val;
  }
}

mongoose.Schema.Types.Quantity = Quantity;

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  count: {
    type: Quantity,
    required: true,
  },
  message: {
    type: String,
    match: [/^[^<>]*$/, 'Message musn\'t contain forbidden characters'],
    default: '',
  },
});

cartItemSchema.post('validate', doc => {
  doc.message = DOMPurify.sanitize(doc.message);
});

const cartSchema = new mongoose.Schema({
  closed: {
    type: Boolean,
    default: false,
  },
  products: [cartItemSchema],
});

cartSchema.plugin(deepPopulate, {
  populate: {
    'products.product': {
      select: '_id name price',
    },
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = { cartItemSchema, Cart };
