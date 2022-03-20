const settings = {
  patterns: {
    email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    phone: /(^$)|(^[0-9]{9,11}$)/,
    location: /^[^<>]*$/,
  },
  messages: {
    email: 'Email is not correct',
    phone: 'Phone has to contain from 9 to 11 digits only',
    location: 'Location musn\'t contain forbidden characters',
  },
  api: {
    url: '//' + window.location.hostname + (window.location.hostname==='localhost' ? ':8000/api' : '/api'),
    endpoints: {
      products: 'products',
      product: 'product',
    },
  },
};


export default settings;
