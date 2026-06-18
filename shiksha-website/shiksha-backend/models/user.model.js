require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const ObjectId = mongoose.Types.ObjectId;
const JWT_SECRET = process.env.JWT_SECRET;

const classSchema = new mongoose.Schema(
  {
    board: { type: String, required: true },
    class: { type: Number, required: true },
    medium: { type: String, required: true },
    subject: { type: String, required: true },
    name: { type: String, required: true },
    sem: { type: Number, required: true },
  },
  { _id: false }
);

const identitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    normalizedPhone: { type: String, required: true, select: false },
    email: { type: String, trim: true, lowercase: true },
    address: String,
  },
  { _id: false }
);

const teacherProfileSchema = new mongoose.Schema(
  {
    state: String,
    zone: String,
    district: String,
    block: String,
    school: { type: ObjectId, ref: "School" },
    preferredLanguage: { type: String, enum: ["en", "kn"], default: "en" },
    facilities: { type: [mongoose.Schema.Types.Mixed], default: [] },
    classes: { type: [classSchema], default: [] },
    isProfileCompleted: { type: Boolean, default: false },
  },
  { _id: false }
);

const adminProfileSchema = new mongoose.Schema(
  {
    state: String,
    zones: { type: [String], default: [] },
    districts: { type: [String], default: [] },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    identity: { type: identitySchema, required: true },
    roles: {
      type: [{ type: ObjectId, ref: "Role" }],
      required: true,
      validate: {
        validator: (roles) => Array.isArray(roles) && roles.length > 0,
        message: "At least one role is required",
      },
    },
    profiles: {
      teacher: teacherProfileSchema,
      admin: adminProfileSchema,
    },
    profileImage: { type: String, default: "" },
    profileImageExpiresIn: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000),
    },
    isDeleted: { type: Boolean, default: false },
    otp: { type: String, select: false },
    loginAttempts: { type: [Date], default: [], select: false },
    recovery: { type: Object, select: false },
    rememberMeToken: { type: Boolean, default: false, select: false },
    isLoginAllowed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("validate", function normalizePhone(next) {
  if (this.identity?.phone) {
    const digits = String(this.identity.phone).replace(/\D/g, "");
    this.identity.normalizedPhone = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  }
  next();
});

userSchema.methods.generateAuthToken = function generateAuthToken() {
  return jwt.sign({ _id: this._id }, JWT_SECRET, { expiresIn: "7d" });
};

userSchema.index(
  { "identity.normalizedPhone": 1 },
  { unique: true, name: "uniq_user_normalized_phone" }
);
userSchema.index(
  {
    "profiles.teacher.school": 1,
    "profiles.teacher.state": 1,
    "profiles.teacher.zone": 1,
    "profiles.teacher.district": 1,
    "profiles.teacher.block": 1,
  },
  { name: "idx_user_teacher_location", background: true }
);

module.exports = mongoose.model("User", userSchema);
