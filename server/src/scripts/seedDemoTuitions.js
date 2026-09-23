import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import TuitionPost from "../models/TuitionPost.js";
import User from "../models/User.js";

const demoPosts = [
  { childClass: "Class 8", subject: "Mathematics & Science", expectedDepartment: "Mathematics, Physics or CSE", offeredSalary: 5000, location: "Sonadanga, Khulna", description: "Three days a week, preferably in the evening. The tutor should explain concepts clearly and help with school assignments." },
  { childClass: "Class 10", subject: "English", expectedDepartment: "English", offeredSalary: 4500, location: "Nirala, Khulna", description: "Need support with grammar, writing and SSC exam preparation. Four days per week." },
  { childClass: "HSC 1st Year", subject: "Physics & Higher Mathematics", expectedDepartment: "Physics, EEE, CSE or Mathematics", offeredSalary: 7000, location: "Khalishpur, Khulna", description: "Looking for an experienced tutor for concept building and weekly model tests." },
  { childClass: "Class 6", subject: "All Subjects", expectedDepartment: "Any department", offeredSalary: 4000, location: "Boyra, Khulna", description: "Friendly and patient tutor needed for regular study supervision, five days a week." },
  { childClass: "Class 9", subject: "Chemistry & Biology", expectedDepartment: "Chemistry, Pharmacy or Life Science", offeredSalary: 5500, location: "Shibbari, Khulna", description: "Three days per week. Previous tutoring experience is preferred." },
  { childClass: "Admission Candidate", subject: "ICT & Mathematics", expectedDepartment: "CSE, ECE or Mathematics", offeredSalary: 6500, location: "Moylapota, Khulna", description: "University admission preparation with problem solving and regular practice tests." },
];

async function seed() {
  await connectDatabase();
  const existing = await TuitionPost.countDocuments({ isDemo: true });
  if (existing) {
    console.log(`${existing} demo tuition posts already exist. Nothing added.`);
    return;
  }

  const posters = await User.find({ role: { $in: ["guardian", "student"] }, isActive: true }).sort({ role: 1, createdAt: 1 });
  if (!posters.length) throw new Error("Create at least one active guardian or student account before seeding demo posts.");

  await TuitionPost.insertMany(demoPosts.map((post, index) => ({ ...post, guardian: posters[index % posters.length]._id, isDemo: true })));
  console.log(`${demoPosts.length} demo tuition posts created.`);
}

seed()
  .catch((error) => { console.error(error.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
