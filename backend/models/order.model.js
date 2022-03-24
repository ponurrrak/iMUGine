const mongoose = require('mongoose');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const { cartItemSchema } = require('./cart.model');
const { productSchema } = require('./product.model');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    match: [/^[^<>]*$/, 'First name musn\'t contain forbidden characters'],
    required: true,
  },
  lastName: {
    type: String,
    match: [/^[^<>]*$/, 'Last name musn\'t contain forbidden characters'],
    required: true,
  },
  address: {
    type: String,
    match: [/^[^<>]*$/, 'Address musn\'t contain forbidden characters'],
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email is not correct'],
  },
  phone: {
    type: String,
    match: [/(^$)|(^[0-9]{9,11}$)/, 'Phone has to contain from 9 to 11 digits only'],
    default: '',
  },
});

clientSchema.post('validate', doc => {
  for(const field in doc.toObject()){
    doc[field] = DOMPurify.sanitize(doc[field]);
  }
});

const orderListSchema = cartItemSchema
  .clone()
  .remove('product')
  .add({
    product: productSchema
      .clone()
      .remove(['description', 'photos']),
  });

const orderSchema = new mongoose.Schema({
  orderList: [orderListSchema],
  client: {
    type: clientSchema,
    default: {},
  },
  orderTotal: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Order', orderSchema);
