const blockGuestUsers = (req, res, next) => {
  if (req.user && req.user.role === "Guest") {
    return res.status(403).json({
      message: "Access denied: Guests are not allowed to access this route.",
    });
  }

  next();
};

export default blockGuestUsers;
