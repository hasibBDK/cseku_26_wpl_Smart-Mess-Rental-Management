import mongoose from "mongoose";

const homeListingSchema = new mongoose.Schema({
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  rent: { type: Number, required: true, min: 1 },
  availableSeats: { type: Number, required: true, min: 1 },
  propertyType: { type: String, required: true, trim: true },
  genderPreference: { type: String, default: "Any" },
  description: { type: String, default: "" },
  imageUrl: { type: String, required: true },
  isDemo: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("HomeListing", homeListingSchema);
