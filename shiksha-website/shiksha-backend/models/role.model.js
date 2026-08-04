const mongoose = require("mongoose");
const { ROLE_SCOPE_TYPES } = require("../config/role.scope");

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  permissions: { type: [String], default: [] },
  scopeType: { type: String, enum: ROLE_SCOPE_TYPES, required: true },
  isSystem: { type: Boolean, default: false },
  isSuperUser: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

roleSchema.index({ name: 1 }, { unique: true, partialFilterExpression: { isDeleted: false }, name: "uniq_active_role_name" });

module.exports = mongoose.model("Role", roleSchema);
