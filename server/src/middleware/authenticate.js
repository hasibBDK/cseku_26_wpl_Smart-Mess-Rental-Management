import { firebaseAuth } from "../config/firebaseAdmin.js";
import User from "../models/User.js";

export async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const [scheme, token] = authorization.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Authentication token is required." });
    }

    req.firebaseUser = await firebaseAuth().verifyIdToken(token);
    req.user = await User.findOne({ firebaseUid: req.firebaseUser.uid });

    if (!req.user || !req.user.isActive) {
      return res.status(403).json({ message: "This account is not active in CampusNest." });
    }
    next();
  } catch (error) {
    console.error("Authentication failed:", error.message);
    res.status(401).json({ message: "Your session is invalid or has expired." });
  }
}

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to do this." });
    }
    next();
  };
}
