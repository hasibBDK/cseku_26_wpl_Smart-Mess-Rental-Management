import mongoose from "mongoose";
import TuitionPost from "../models/TuitionPost.js";

function invalidId(id) {
  return !mongoose.isValidObjectId(id);
}

export async function listTuitions(req, res) {
  const posts = await TuitionPost.find()
    .populate("guardian", "name")
    .populate("applicants.student", "name email")
    .populate("selectedStudent", "name email")
    .sort({ createdAt: -1 });

  const data = posts.map((document) => {
    const post = document.toObject();
    const ownsPost = String(post.guardian?._id) === String(req.user._id);
    post.hasApplied = post.applicants.some(({ student }) => String(student?._id) === String(req.user._id));
    post.applicantCount = post.applicants.length;
    if (!ownsPost && req.user.role !== "admin") {
      delete post.applicants;
      if (post.status !== "selected" || String(post.selectedStudent?._id) !== String(req.user._id)) delete post.selectedStudent;
    }
    return post;
  });

  res.json({ posts: data });
}

export async function createTuition(req, res) {
  const { childClass, subject, expectedDepartment, offeredSalary, location, description = "" } = req.body;
  if (![childClass, subject, expectedDepartment, location].every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({ message: "Class, subject, expected department and location are required." });
  }
  const salary = Number(offeredSalary);
  if (!Number.isFinite(salary) || salary <= 0) return res.status(400).json({ message: "Enter a valid offered salary." });

  const post = await TuitionPost.create({
    guardian: req.user._id,
    childClass: childClass.trim(),
    subject: subject.trim(),
    expectedDepartment: expectedDepartment.trim(),
    offeredSalary: salary,
    location: location.trim(),
    description: typeof description === "string" ? description.trim() : "",
  });
  await post.populate("guardian", "name");
  res.status(201).json({ message: "Tuition requirement published.", post });
}

export async function applyToTuition(req, res) {
  if (invalidId(req.params.id)) return res.status(400).json({ message: "Invalid tuition post." });
  const post = await TuitionPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Tuition post not found." });
  if (post.guardian.equals(req.user._id)) return res.status(400).json({ message: "You cannot apply to your own tuition post." });
  if (post.status !== "open") return res.status(409).json({ message: "This tuition is no longer accepting applications." });
  if (post.applicants.some(({ student }) => student.equals(req.user._id))) return res.status(409).json({ message: "You have already applied." });

  post.applicants.push({ student: req.user._id });
  await post.save();
  res.json({ message: "Application submitted successfully." });
}

export async function selectStudent(req, res) {
  const { id, studentId } = req.params;
  if (invalidId(id) || invalidId(studentId)) return res.status(400).json({ message: "Invalid tuition or student." });
  const post = await TuitionPost.findOne({ _id: id, guardian: req.user._id });
  if (!post) return res.status(404).json({ message: "Tuition post not found." });
  if (!post.applicants.some(({ student }) => student.equals(studentId))) return res.status(400).json({ message: "This student did not apply for the tuition." });

  post.selectedStudent = studentId;
  post.status = "selected";
  await post.save();
  res.json({ message: "Student selected successfully." });
}
