import jwt from "jsonwebtoken";

export const AuthenticatedUser = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({
      message: "You are not authorized",
      success: false,
    });
  }
  jwt.verify(token, process.env.JWT, (error, user) => {
    if (error) {
      return res.status(401).json({
        message: "Token is not valid",
        success: false,
      });
    }
    req.user = user;
    next();
  });
};
