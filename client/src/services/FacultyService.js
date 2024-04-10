const Faculty = require("../models/FacultyModel");
const createFaculty = (newFaculty) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkFaculty = await Faculty.findOne({ name: newFaculty });
      if (checkFaculty !== null) {
        // Khoa đã tồn tại, trả về lỗi
        resolve({
          status: "ERR",
          message: "The faculty already exists",
        });
      } else {
        // Khoa chưa tồn tại, tạo mới
        const res = new Faculty({ name: newFaculty });
        res.save();
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: res,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getNameFaculty = async (facultyId) => {
  try {
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return null;
    }
    return faculty.name;
  } catch (error) {
    throw error;
  }
};
const getAllFaculty = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const faculty = await Faculty.find();
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: faculty,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteFaculty = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Faculty.findByIdAndDelete(id);
      if (!result) {
        throw new Error("User not found"); // Nếu không tìm thấy người dùng
      }
      resolve({
        status: "OK",
        message: "DELETE SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updateFaculty = (id, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedFaculty = await Faculty.findByIdAndUpdate(
        id, // ID của faculty cần cập nhật
        { name }, // Dữ liệu mới cần cập nhật
        { new: true } // Tùy chọn new: true để trả về bản ghi đã được cập nhật
      );
      resolve({
        status: "OK",
        message: "UPDATE SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createFaculty,
  getNameFaculty,
  deleteFaculty,
  getAllFaculty,
  updateFaculty,
};
