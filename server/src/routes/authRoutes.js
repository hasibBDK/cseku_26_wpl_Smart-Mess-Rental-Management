import { Router } from "express";
import { currentUser, register } from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import { firebaseAuth } from "../config/firebaseAdmin.js";

const router = Router();

async function verifyFirebaseOnly(req, res, next) {
  try {
    const [scheme, token] = (req.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Authentication token is required." });
    }
    req.firebaseUser = await firebaseAuth().verifyIdToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Invalid Firebase authentication token." });
  }
}

router.post("/register", verifyFirebaseOnly, register);
router.get("/me", authenticate, currentUser);

export default router;
