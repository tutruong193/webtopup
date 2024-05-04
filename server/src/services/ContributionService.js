const Contribution = require("../models/ContributionModel");
const NotificationService = require('../services/NotificationService');
const EmailService = require("../services/EmailService");
const UserService = require("../services/UserService");
const createContribution = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        studentId,
        title,
        nameofworddb,
        submission_date,
        lastupdated_date,
        eventId,
        facultyId,
        status,
        imageFiles,
        content,
        nameofword,
      } = data;
      const newContribution = new Contribution({
        studentId,
        title,
        imageFiles,
        submission_date,
        lastupdated_date,
        eventId,
        facultyId,
        status,
        comment: [],
        score: "",
        content,
        nameofword,
        nameofworddb,
      });
      
      // Lưu Contribution
      const savedContribution = await newContribution.save();
      await NotificationService.createNotification(studentId, facultyId, eventId,`submited a new contribution`)
      const userName = await UserService.getUserName(studentId);
      await EmailService.sendNotificationEmail("tutagch210167@fpt.edu.vn", "Submitted a new contribution", `${userName} has submited a new contribution`)
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: savedContribution,
      });
    } catch (error) {
      reject(error);
      console.error(error);
    }
  });
};

const getDetailContribution = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contributionData = await Contribution.findOne({ _id: id }); // Chú ý sử dụng await để đợi lấy dữ liệu
      if (!contributionData) {
        resolve({
          status: "ERR",
          message: "ko có",
          data: null,
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: contributionData,
      });
    } catch (error) {
      reject(error);
      console.error(error);
    }
  });
};
const getContributionSubmited = async (studentID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contributionSubmited = await Contribution.find({
        studentId: studentID,
      });
      if (!contributionSubmited) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: null,
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: contributionSubmited,
      });
    } catch (error) {
      reject(error);
      console.error(error);
    }
  });
};
const deleteContribution = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Contribution.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "SUCCESS",
      });
    } catch (error) {
      throw error;
    }   
  });
};
const updateContribution = async (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Contribution.findByIdAndUpdate(id, data);
      resolve({
        status: "OK",
        message: "UPDATE SUCCESS",
      });
    } catch (error) {
      throw error;
    }
  });
};
const getAllContributions = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Contribution.find().exec();
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: data,
      });
    } catch (error) {
      throw error;
    }
  });
};
const updateCommentContribution = async (id, comment) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contribution = await Contribution.findById(id);
      // Kiểm tra nếu không tìm thấy bài đăng
      if (!contribution) {
        throw new Error("Contribution not found");
      }
      // Thêm comment mới vào danh sách comment của bài đăng
      contribution.comment.push(comment);
      await NotificationService.createNotification(contribution.studentId, contribution.facultyId, contribution.eventId,`has posted a new comment`)
      const userName = await UserService.getUserName(contribution.studentId);
      await EmailService.sendNotificationEmail("tutagch210167@fpt.edu.vn", "Posted a new comment", `${userName} has posted a new comment: ${comment.split("^")[0]}`)
      await contribution.save();
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
  createContribution,
  getContributionSubmited,
  deleteContribution,
  updateContribution,
  getAllContributions,
  getDetailContribution,
  updateCommentContribution,
};
