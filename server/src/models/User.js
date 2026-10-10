import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: ["student", "guardian", "homeowner", "admin"],
    },
    department: { type: String, trim: true, maxlength: 100, default: "" },
    academicYear: { type: String, trim: true, maxlength: 30, default: "" },
    teachingExperience: { type: String, trim: true, maxlength: 500, default: "" },
    isActive: { type: Boolean, default: true },
    notifications: [{
      type: { type: String, enum: ["tuition_selected", "tuition_forwarded"], required: true },
      title: { type: String, required: true },
      message: { type: String, required: true },
      tuitionPost: { type: mongoose.Schema.Types.ObjectId, ref: "TuitionPost", default: null },
      paymentAmount: { type: Number, default: null },
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform(_document, value) {
    delete value.__v;
    return value;
  },
});

export default mongoose.model("User", userSchema);
