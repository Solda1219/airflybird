const requireAdmin = (req, res, next) => {
  if (req.user.role==='admin'||req.user.role==='super'||req.user.role==='agent'){
    next();
  } else{
    return res.status(401).json({
      message: "not an admin account"
    });
  }
};

module.exports = requireAdmin;
