const Notification = require("../models/NotificationModel");
const User = require("../models/UserModel");
const Event = require("../models/EventModel");
const getAllNotifications = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const notification = await Notification.find();
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: notification,
      });
    } catch (error) {
      throw error;
    }
  });
};
const readAllNotifications = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await Notification.updateMany(
        { isRead: false },
        { $set: { isRead: true } }
      );
      resolve({
        status: "OK",
        message: "SUCCESS",
      });
    } catch (error) {
      reject(error);
    }
  });
};
const readOneNotifications = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notification = await Notification.findById(id);
      if (!notification) {
        resolve({
          status: "ERR",
          message: "Not found notification",
        });
      } else {
        notification.isRead = true;
        await notification.save(); 
        resolve({
          status: "OK",
          message: "SUCCESS",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
const createNotification = async (studentId, facultyId, eventId, title) => {
  return new Promise(async (resolve, reject) => {
    try {
      const event = await Event.findById(eventId);
      const student = await User.findById(studentId);
      const eventname = event.name;
      const studentname = student.name;
      const notification = new Notification({
        studentId,
        facultyId,
        eventId,
        title: `${studentname} ${title} at event ${eventname}`,
      });
      await notification.save();
      resolve({
        status: "OK",
        message: "SUCCESS",
      });
    } catch (error) {
      throw error;
    }
  });
};
module.exports = {
  getAllNotifications,
  createNotification,
  readAllNotifications,
  readOneNotifications,
};
