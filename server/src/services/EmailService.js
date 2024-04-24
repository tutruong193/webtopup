const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "truonganhtu190303@gmail.com", // Email của bạn
    pass: "mefc vlzs kqpc dvum", // Mật khẩu của bạn
  },
});
// Hàm gửi email kèm mã kích hoạt
async function sendActivationCodeEmail(email, activationCode) {
  try {
    const mailOptions = {
      from: "truonganhtu190303@gmail.com", // Địa chỉ email người gửi
      to: email, // Địa chỉ email người nhận
      subject: "Activation Code", // Tiêu đề email
      text: `Your activation code is: ${activationCode}`, // Nội dung email
    };

    // Gửi email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return {
      status: "OK",
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      status: "ERR",
      message: "Error sending email",
    };
  }
}
async function sendNotificationEmail(email, subject, text) {
  try {
    const mailOptions = {
      from: "truonganhtu190303@gmail.com", // Địa chỉ email người gửi
      to: email, // Địa chỉ email người nhận
      subject: subject, // Tiêu đề email
      text: text, // Nội dung email
    };

    // Gửi email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return {
      status: "OK",
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      status: "ERR",
      message: "Error sending email",
    };
  }
}

module.exports = {
  sendActivationCodeEmail, sendNotificationEmail
};
