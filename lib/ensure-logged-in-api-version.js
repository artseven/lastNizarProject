function ensureLoggedInApiVersion (req, res, next) {
  if (req.isAuthenticated()) {
    next();
    return;
  }

  res.status(401).json({ message: "Is logged in"});
}

module.exports = ensureLoggedInApiVersion;
