import { Button, Input, Form } from "antd";
import React, { useEffect, useState } from "react";
import * as UserService from "../../services/UserService";
import { useParams } from "react-router-dom";
import * as Message from "../../components/Message/Message";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const handleOnchangeCode = (e) => {
    setCode(e.target.value);
  };
  const [isHiddenPass, setIsHiddenPass] = useState(false);
  const navigate = useNavigate();
  const handleVerify = async () => {
    try {
      const res = await UserService.verifyActivationCode(id, code);
      if (res.status === "ERR") {
        Message.error("Code is not correct");
      } else {
        Message.success();
        setIsHiddenPass(true);
      }
    } catch (error) {
      console.error("Error verifying activation code:", error);
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await UserService.sendActivationCode(id);
      if (res.status === "OK") {
        Message.success("Resend successful");
      }
    } catch (error) {
      console.error("Error resending activation code:", error);
    }
  };
  //change password
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const handleOnchangePassword = (e) => {
    const { name, value } = e.target;
    if (name === "newpassword") {
      setNewPassword(value);
    } else if (name === "re-newpassword") {
      setReNewPassword(value);
    }
  };
  const onChangePass = async (values) => {
    try {
      const res = await UserService.updateUser(id, {
        password: values.newpassword,
      });
      if (res.status === "OK") {
        Message.success("Password updated successfully!");
        setTimeout(() => {
          navigate("/signin");
          window.location.reload();
        }, 1500);
      } else {
        Message.error("Failed to update password!");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      Message.error(
        "An error occurred while updating password. Please try again later."
      );
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "rgb(233, 236, 239)",
      }}
    >
      {!isHiddenPass ? (
        <div
          style={{
            background: "white",
            height: "50vh",
            width: "100vh",
            padding: "1.2rem",
            borderTop: "3px solid #d4dadf",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "-1px",
              lineHeight: "48px",
            }}
          >
            Confirm Your Email
          </h1>
          <p style={{ margin: "20px 0px" }}>
            Tap the button below to confirm your email address.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              padding: "30px 0px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <Input
                placeholder="Enter activation code"
                style={{ height: "3rem", width: "12rem", fontSize: "20px" }}
                value={code}
                onChange={handleOnchangeCode}
              />
              <Button
                style={{ height: "3rem", width: "6rem" }}
                type="primary"
                onClick={handleVerify}
              >
                Submit
              </Button>
            </div>
          </div>
          <p style={{ margin: "20px 0px" }}>
            If you don't receive the code,{" "}
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={handleResendCode}
            >
              resend
            </span>
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "white",
            height: "50vh",
            width: "100vh",
            padding: "1.2rem",
            borderTop: "3px solid #d4dadf",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "-1px",
              lineHeight: "48px",
            }}
          >
            Change Password
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              padding: "30px 0px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <Form
                name="change-password"
                labelAlign="left"
                labelCol={{ flex: "200px" }}
                wrapperCol={{
                  span: 16,
                }}
                style={{
                  width: 600,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onChangePass}
                autoComplete="off"
              >
                <Form.Item
                  label="New Password"
                  name="newpassword"
                  rules={[
                    {
                      required: true,
                      message: "Please input your new password!",
                    },
                  ]}
                >
                  <Input.Password
                    value={newPassword}
                    onChange={handleOnchangePassword}
                    name="newpassword"
                  />
                </Form.Item>
                <Form.Item
                  label="Confirm New Password"
                  name="re-newpassword"
                  dependencies={["newpassword"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your new password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newpassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The two passwords that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    value={reNewPassword}
                    onChange={handleOnchangePassword}
                    name="re-newpassword"
                  />
                </Form.Item>
                <Form.Item
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100px" }}
                  >
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePasswordPage;
