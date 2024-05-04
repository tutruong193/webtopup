const User = require("../models/UserModel");
const EmailService = require("./EmailService");
const { generalAccessToken } = require("./JWTService");
const createUser = (data) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, role, faculty } = data;
    try {
      const checkEmail = await User.findOne({ email: email });
      if (checkEmail !== null) {
        resolve({
          status: "ERR",
          message: "Email already exists",
        });
      } else {
        const createdUser = await User.create({
          name,
          email,
          password,
          role,
          faculty,
        });
        if (createdUser) {
          resolve({
            status: "OK",
            message: "SUCCESS",
            data: createdUser,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (data) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = data;
    try {
      const checkUser = await User.findOne({ email: email });
      if (checkUser == null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      if (password !== checkUser.password) {
        resolve({
          status: "ERR",
          message: "The password or username is not correct",
        });
      }
      const access_token = await generalAccessToken({
        id: checkUser.id,
        role: checkUser.role,
        faculty: checkUser.faculty,
      });
      if (!checkUser.isActive) {
        resolve({
          status: "ERR",
          message: "Not activated yet",
          data: checkUser,
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        access_token: access_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const detailUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id,
      });
      if (user === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCESS",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await User.find();
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

const updateUser = async (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updateUser = await User.findByIdAndUpdate(id, data);
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updateUser,
      });
    } catch (error) {
      throw error;
    }
  });
};

const deleteUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "SUCCESS",
      });
    } catch (error) {
      throw error;
    }
  });
};
const getUserName = async (id) => {
  try {
    const user = await User.findById(id);
    if (user) {
      return user.name;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

const sendActivationCode = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return {
        status: "ERR",
        message: "User not found",
      };
    }
    const activationCode = Math.floor(100000 + Math.random() * 900000);
    process.env.ACTIVECODE = activationCode;
    const emailResult = await EmailService.sendActivationCodeEmail(
      "tutagch210167@fpt.edu.vn",
      activationCode
    );
    if (emailResult.status === "OK") {
      return {
        status: "OK",
        message: "Code is sent",
      };
    } else {
      return {
        status: "ERR",
        message: "Failed to send code via email",
      };
    }
  } catch (error) {
    console.error("Error sending activation code:", error);
    return {
      status: "ERR",
      message: "Error sending activation code",
    };
  }
};
const verifyActivationCode = async (userId, code) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(userId, code);
      const user = await User.findById(userId);
      if (!user) {
        resolve({
          status: "ERR",
          message: "user not found",
        });
      }
      if (process.env.ACTIVECODE !== code) {
        resolve({
          status: "ERR",
          message: "Code not correct",
        });
      } else {
        user.isActive = true;
        process.env.ACTIVECODE = "";
        await user.save();
        resolve({
          status: "OK",
          message: "Actived",
        });
      }
    } catch (error) {
      throw error;
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  detailUser,
  getAllUser,
  updateUser,
  deleteUser,
  getUserName,
  sendActivationCode,
  verifyActivationCode,
};
