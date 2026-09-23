import { Router } from "express";
import User from "../models/User.js";

const router = Router();

router.get("/community", async (_req, res) => {
  const [students, guardians, homeowners] = await Promise.all([
    User.countDocuments({ role: "student", isActive: true }),
    User.countDocuments({ role: "guardian", isActive: true }),
    User.countDocuments({ role: "homeowner", isActive: true }),
  ]);
  res.json({ students, guardians, homeowners });
});

export default router;
