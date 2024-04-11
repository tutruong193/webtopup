const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now() },
  facultyId: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isRead: { type: Boolean, default: false }
});
const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
