function authenticator(req , res , next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('warning_msg' , '請先登入您的帳號')
  res.redirect('/users/login');
}

module.exports = authenticator;