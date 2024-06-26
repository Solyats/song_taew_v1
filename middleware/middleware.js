const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.cookies?.token

  if (!token) {
    return res
      .status(401)
      .json({ status: 401, error: "Unauthorized: Missing token" });
  }

  jwt.verify(
    token,
    process.env.SECRET_TOKEN_KEY || "asdsaddsaddsa2222",
    (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ status: 403, error: "Forbidden: Invalid token" });
      }
      req.user = decoded;
      next();
    }
  );
};

const authenticateAdminToken = (req, res, next) => {
   const token = req.cookies?.token

  if (!token) {
    return res
      .status(401)
      .json({ status: 401, error: "Unauthorized: Missing token" });
  }

  jwt.verify(
    token,
    process.env.SECRET_TOKEN_KEY || "asdsaddsaddsa2222",
    (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ status: 403, error: "Forbidden: Invalid token" });
      }

      if (decoded.role !== "ADMIN") {
        return res
          .status(403)
          .json({ status: 403, error: "Forbidden: Not an admin user" });
      }

      req.user = decoded;
      next();
    }
  );
};

module.exports = {
  authenticateToken,
  authenticateAdminToken,
};
