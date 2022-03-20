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
