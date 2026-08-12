const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const auditLogSchema = new Schema(
  {
    eventType: {
      type: String,
      enum: ["Schools Import", "Schools Export", "Teachers Import", "Teachers Export", "Content Activity Export", "Dashboard Token"],
      required: true,
    },
    status: {
        type: String,
        enum: ["in_progress", "success", "failure"],
        required: true,
    },
    logUrl: {
      type: String
    },
    userId:{
      type: ObjectId,
			ref: "User",
			required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;
