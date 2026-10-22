const mongoose = require("mongoose");

const metadataSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed },
  },
  { collection: "metadata" }
);

const Metadata = mongoose.model("Metadata", metadataSchema);

module.exports = Metadata;