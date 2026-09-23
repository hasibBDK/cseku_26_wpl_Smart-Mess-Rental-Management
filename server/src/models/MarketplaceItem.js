import mongoose from "mongoose";

const marketplaceItemSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  condition: { type: String, required: true, enum: ["Like New", "Good", "Used"] },
  price: { type: Number, required: true, min: 1 },
  location: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  imageUrl: { type: String, required: true },
  isDemo: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("MarketplaceItem", marketplaceItemSchema);
