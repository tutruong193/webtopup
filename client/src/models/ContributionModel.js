const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  submission_date: { type: Date, default: Date.now },
  lastupdated_date: { type: Date, default: Date.now },
  confirm_date: { type: Date, default: null },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  score: { type: Number },
  comment: [{ type: String }],
  nameofword: { type: String, required: true },
  nameofworddb: { type: String, required: true },
  content: { type: String, required: true },
  imageFiles: [{ type: String }],
});

const Contribution = mongoose.model("Contribution", contributionSchema);

module.exports = Contribution;
