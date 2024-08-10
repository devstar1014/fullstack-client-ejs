function checkAdminAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    res.redirect('/login');
  }
  
  module.exports = checkAdminAuthenticated;
  