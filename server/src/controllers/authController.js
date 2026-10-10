import User from "../models/User.js";

const publicRoles = new Set(["student", "guardian", "homeowner"]);

function adminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export async function register(req, res) {
  const { name, role, department = "", academicYear = "", teachingExperience = "" } = req.body;
  const email = req.firebaseUser.email?.toLowerCase();

  if (typeof name !== "string" || !name.trim() || typeof role !== "string") {
    return res.status(400).json({ message: "Name and role are required." });
  }
  if (!email) {
    return res.status(400).json({ message: "A valid Firebase email account is required." });
  }
  if (!publicRoles.has(role) && !(role === "admin" && adminEmails().has(email))) {
    return res.status(403).json({ message: "You are not allowed to register with this role." });
  }

  const existing = await User.findOne({
    $or: [{ firebaseUid: req.firebaseUser.uid }, { email }],
  });
  if (existing) {
    return res.status(409).json({ message: "This account is already registered." });
  }

  const user = await User.create({
    firebaseUid: req.firebaseUser.uid,
    name: name.trim(),
    email,
    role,
    department: role === "student" ? String(department).trim() : "",
    academicYear: role === "student" ? String(academicYear).trim() : "",
    teachingExperience: role === "student" ? String(teachingExperience).trim() : "",
  });
  res.status(201).json({ message: "Account created successfully.", user });
}

export function currentUser(req, res) {
  res.json({ user: req.user });
}

export async function updateCurrentUser(req, res) {
  if (req.user.role !== "student") return res.status(403).json({ message: "Only student profiles can be updated here." });
  const { department = "", academicYear = "", teachingExperience = "" } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { department: String(department).trim(), academicYear: String(academicYear).trim(), teachingExperience: String(teachingExperience).trim() }, { new: true, runValidators: true });
  res.json({ message: "Student profile updated successfully.", user });
}
