const settings = {
  patterns: {
    email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    phone: /(^$)|(^[0-9]{9,11}$)/,
    firstName: /^[^<>]*$/,
    lastName: /^[^<>]*$/,
    address: /^[^<>]*$/,
    message: /^[^<>]*$/,
  },
  messages: {
    email: 'Email is not correct',
    phone: 'Phone has to contain from 9 to 11 digits only',
    firstName: 'First name musn\'t contain forbidden characters',
    lastName: 'Last name musn\'t contain forbidden characters',
    address: 'Address musn\'t contain forbidden characters',
    message: 'Message musn\'t contain forbidden characters',
  },
  api: {
    url: '//' + window.location.hostname + (window.location.hostname==='localhost' ? ':8000/api' : '/api'),
    endpoints: {
      products: 'products',
      cart: 'cart',
      cartStatus: 'cart/status',
      order: 'order',
    },
  },
};


export default settings;
