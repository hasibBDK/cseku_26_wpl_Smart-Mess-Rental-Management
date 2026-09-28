import { Router } from "express";
import HomeListing from "../models/HomeListing.js";
import { allowRoles, authenticate } from "../middleware/authenticate.js";

const router = Router();
router.get("/", async (_req, res) => {
  const listings = await HomeListing.find({ isActive: true }).populate("postedBy", "name").sort({ createdAt: -1 });
  res.json({ listings });
});
router.post("/", authenticate, allowRoles("student", "homeowner"), async (req, res) => {
  const { title, location, rent, availableSeats, propertyType = "Mess seat", genderPreference = "Any", description = "", imageUrl } = req.body;
  if (![title, location, imageUrl].every((value) => typeof value === "string" && value.trim())) return res.status(400).json({ message: "Title, location and image URL are required." });
  const monthlyRent = Number(rent);
  const seats = Number(availableSeats);
  if (!Number.isFinite(monthlyRent) || monthlyRent <= 0 || !Number.isInteger(seats) || seats <= 0) return res.status(400).json({ message: "Enter a valid rent and number of seats." });
  const listing = await HomeListing.create({ postedBy: req.user._id, title: title.trim(), location: location.trim(), rent: monthlyRent, availableSeats: seats, propertyType: propertyType.trim(), genderPreference, description: description.trim(), imageUrl: imageUrl.trim() });
  await listing.populate("postedBy", "name");
  res.status(201).json({ listing });
});
export default router;
