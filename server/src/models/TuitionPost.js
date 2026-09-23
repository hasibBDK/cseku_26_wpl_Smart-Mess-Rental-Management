import mongoose from "mongoose";

const tuitionPostSchema = new mongoose.Schema(
  {
    guardian: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    childClass: { type: String, required: true, trim: true, maxlength: 50 },
    subject: { type: String, required: true, trim: true, maxlength: 100 },
    expectedDepartment: { type: String, required: true, trim: true, maxlength: 100 },
    offeredSalary: { type: Number, required: true, min: 1 },
    location: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    status: { type: String, enum: ["open", "selected"], default: "open" },
    applicants: [{ student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, appliedAt: { type: Date, default: Date.now } }],
    selectedStudent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("TuitionPost", tuitionPostSchema);
