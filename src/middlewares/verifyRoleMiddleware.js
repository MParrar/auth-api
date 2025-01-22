const verifyRole = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ status: 'error', message: 'Access Denied' });
      }
      next();
    };
  };

  module.exports = { verifyRole }