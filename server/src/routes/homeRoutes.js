import { Router } from "express";
import HomeListing from "../models/HomeListing.js";

const router = Router();
router.get("/", async (_req, res) => {
  const listings = await HomeListing.find({ isActive: true }).populate("postedBy", "name").sort({ createdAt: -1 });
  res.json({ listings });
});
export default router;
