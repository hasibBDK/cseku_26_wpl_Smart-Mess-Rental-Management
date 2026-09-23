import { Router } from "express";
import MarketplaceItem from "../models/MarketplaceItem.js";
import { allowRoles, authenticate } from "../middleware/authenticate.js";

const router = Router();
router.get("/", async (_req, res) => {
  const items = await MarketplaceItem.find({ isAvailable: true }).populate("seller", "name").sort({ createdAt: -1 });
  res.json({ items });
});
router.post("/", authenticate, allowRoles("student"), async (req, res) => {
  const { title, category, condition, price, location, description = "", imageUrl } = req.body;
  if (![title, category, condition, location, imageUrl].every((value) => typeof value === "string" && value.trim())) return res.status(400).json({ message: "All product fields and an image URL are required." });
  if (!['Like New', 'Good', 'Used'].includes(condition)) return res.status(400).json({ message: "Choose a valid product condition." });
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) return res.status(400).json({ message: "Enter a valid product price." });
  try { const image = new URL(imageUrl); if (!['http:', 'https:'].includes(image.protocol)) throw new Error(); }
  catch { return res.status(400).json({ message: "Enter a valid HTTP image URL." }); }

  const item = await MarketplaceItem.create({ seller: req.user._id, title: title.trim(), category: category.trim(), condition, price: numericPrice, location: location.trim(), description: typeof description === "string" ? description.trim() : "", imageUrl: imageUrl.trim() });
  await item.populate("seller", "name");
  res.status(201).json({ message: "Your item is now listed for sale.", item });
});
export default router;
