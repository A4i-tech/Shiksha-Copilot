require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const ObjectId = mongoose.Types.ObjectId;
const JWT_SECRET = process.env.JWT_SECRET;

const roleAssignmentSchema = new mongoose.Schema({
	role: { type: ObjectId, ref: "Role", required: true },
	dep: { type: mongoose.Schema.Types.Mixed },
});

const classSchema = new mongoose.Schema({
  board: {
    type: String,
    required: true,
  },
  class: {
    type: Number,
    required: true,
  },
  medium: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sem: {
    type: Number,
    required: true,
  },
});

const identitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  address: {
    type: String,
  },
}, { _id: false });

const teacherProfileSchema = new mongoose.Schema({
  facilities: [],
  isProfileCompleted: {
    type: Boolean,
    default: false,
  },
  classes: {
    type: [classSchema],
  },
}, { _id: false });

const adminProfileSchema = new mongoose.Schema({
  state: {
    type: String,
  },
}, { _id: false });

const userSchema = mongoose.Schema(
  {
    identity: {
      type: identitySchema,
      required: true,
    },
    roles: {
      type: [roleAssignmentSchema],
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
    preferredLanguage: {
      type: String,
      enum: ["en", "kn", "tg"],
      default: "en",
    },
    profileImage: {
      type: String,
      default: "",
    },
    profileImageExpiresIn: {
      type: Number,
      default: parseInt(Date.now() / 1000),
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false,
    },
    loginAttempts: { type: [Date], default: [], select: false },
    recovery: { type: Object, select: false },
    rememberMeToken: {
      type: Boolean,
      default: false,
      select: false,
    },
    isLoginAllowed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

userSchema.index(
  { "identity.phone": 1 },
  { unique: true, name: "uniq_user_phone" }
);

userSchema.index({ "roles.dep": 1 }, { name: "idx_user_role_dependency", background: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
