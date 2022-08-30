function authenticator(req , res , next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('warning_msg' , '請先登入再使用')
  res.redirect('/users/login');
}

module.exports = authenticator;