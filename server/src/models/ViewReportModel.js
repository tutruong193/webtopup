const mongoose = require("mongoose");

const viewReportSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    default: null,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  selected: [{ type: String }],
});

const ViewReport = mongoose.model("ViewReport", viewReportSchema);

module.exports = ViewReport;
