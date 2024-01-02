const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const querySchema = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "User" },
    bus: { type: ObjectId, ref: "Bus" },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Query = mongoose.model("Query", querySchema);

module.exports = Query;
