function adminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
}

module.exports = adminAuth;