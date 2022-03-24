exports.parseErrors = err => {
  let message = '';
  if(err.errors) {
    for(const errKey in err.errors){
      message += err.errors[errKey].message + '. ';
    }
  } else {
    message = err.message;
  }
  return message;
};

exports.countTotalSum = productsArray => {
  let total = 0;
  for(const item of productsArray) {
    total += item.count * item.product.price;
  }
  return total;
};
