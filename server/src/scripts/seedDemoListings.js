import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import HomeListing from "../models/HomeListing.js";
import MarketplaceItem from "../models/MarketplaceItem.js";
import User from "../models/User.js";

const homes = [
  { title: "Quiet student mess near KU", location: "Gollamari, Khulna", rent: 3500, availableSeats: 2, propertyType: "Mess seat", genderPreference: "Male", description: "Wi-Fi, filtered water and a calm study environment. Electricity bill is separate.", imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80" },
  { title: "Furnished room with balcony", location: "Sonadanga, Khulna", rent: 6500, availableSeats: 1, propertyType: "Single room", genderPreference: "Any", description: "Bright furnished room with attached balcony, study table and shared kitchen.", imageUrl: "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1200&q=80" },
  { title: "Shared flat for female students", location: "Nirala, Khulna", rent: 4200, availableSeats: 2, propertyType: "Shared flat", genderPreference: "Female", description: "Secure building near the main road. Gas, water and caretaker service included.", imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80" },
  { title: "Budget mess seat near campus", location: "Sher-E-Bangla Road, Khulna", rent: 2800, availableSeats: 3, propertyType: "Mess seat", genderPreference: "Male", description: "Affordable shared room with dining option and easy transport to campus.", imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80" },
];

const items = [
  { title: "Study desk with chair", category: "Furniture", condition: "Good", price: 3200, location: "Sonadanga, Khulna", description: "Strong wooden study desk and comfortable chair. Ideal for a student room.", imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80" },
  { title: "Campus bicycle", category: "Transport", condition: "Used", price: 6500, location: "Khulna University", description: "Reliable bicycle for daily campus travel. Recently serviced and ready to ride.", imageUrl: "https://images.unsplash.com/photo-1529422643029-d4585747aaf2?auto=format&fit=crop&w=1200&q=80" },
  { title: "Student laptop", category: "Electronics", condition: "Good", price: 28000, location: "Shibbari, Khulna", description: "Suitable for assignments, programming and online classes. Charger included.", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80" },
  { title: "Academic book bundle", category: "Books", condition: "Like New", price: 1400, location: "Gollamari, Khulna", description: "A useful collection of university-level mathematics and programming books.", imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80" },
  { title: "Kitchen appliance set", category: "Appliances", condition: "Good", price: 2200, location: "Boyra, Khulna", description: "Useful starter kitchen set for a mess or shared flat. Clean and fully functional.", imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80" },
];

async function seed() {
  await connectDatabase();
  const users = await User.find({ isActive: true }).sort({ createdAt: 1 });
  if (!users.length) throw new Error("Create at least one active user before seeding demo listings.");
  const homeowner = users.find((user) => user.role === "homeowner") || users[0];
  const sellers = users.filter((user) => user.role === "student");
  const marketplaceSellers = sellers.length ? sellers : users;

  const [homeCount, itemCount] = await Promise.all([HomeListing.countDocuments({ isDemo: true }), MarketplaceItem.countDocuments({ isDemo: true })]);
  if (!homeCount) await HomeListing.insertMany(homes.map((home) => ({ ...home, postedBy: homeowner._id, isDemo: true })));
  if (!itemCount) await MarketplaceItem.insertMany(items.map((item, index) => ({ ...item, seller: marketplaceSellers[index % marketplaceSellers.length]._id, isDemo: true })));
  console.log(`${homeCount ? 0 : homes.length} home listings and ${itemCount ? 0 : items.length} marketplace items created.`);
}

seed().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
