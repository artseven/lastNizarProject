function ensureLoggedInApiVersion (req, res, next) {
  if (req.isAthenticated()) {
    next();
    return;
  }

  res.status(401).json({ message: "Is logged in"});
}

module.exports = ensureLoggedInApiVersion;
