const ViewReport = require("../models/ViewReportModel");
const updateView = async (facultyid, eventid, selected) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkView = await ViewReport.findOne({
        facultyId: facultyid,
        eventId: eventid,
      });
      if (checkView == null) {
        await ViewReport.create({
          facultyId: facultyid,
          eventId: eventid,
          selected,
        });
        resolve({
          status: "OK",
          message: "New View Report is created successfully",
        });
      } else {
        const findView = await ViewReport.findOne({
          facultyId: facultyid,
          eventId: eventid,
        });
        findView.selected = selected;
        findView.save();
        resolve({
          status: "OK",
          message: "New View Report is updated successfully",
        });
      }
    } catch (error) {
      throw error;
    }
  });
};
const getseletedView = async (facultyId,eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkView = await ViewReport.findOne({ facultyId: facultyId, eventId: eventId});
      if (checkView == null) {
        resolve({
          status: "ERR",
          message: "View not found",
          data: null
        });
      } else {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: checkView,
        });
      }
    } catch (error) {
      throw error;
    }
  });
};
module.exports = {
  updateView,
  getseletedView,
};
