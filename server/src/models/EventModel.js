const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  openDate: { type: Date, required: true },
  firstCloseDate: { type: Date, required: true },
  finalCloseDate: { type: Date, required: true }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;