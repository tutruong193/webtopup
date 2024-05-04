import { Button, Input } from "antd";
import React, { useEffect, useState } from "react";
import * as UserService from "../../services/UserService";
import { useParams } from "react-router-dom";
import * as Message from "../../components/Message/Message";
import { useNavigate } from "react-router-dom";
const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleSendCode = async (id) => {
    try {
      const res = await UserService.sendActivationCode(id);
      if (res.status === "OK") {
        Message.success("Send successful");
      }
    } catch (error) {
      console.error("Error resending activation code:", error);
    }
  };
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await UserService.getAllUser();
      setUsers(res.data);
    };
    fetchUser();
  }, []);
  const handleCheckEmail = () => {
    const checkEmail = users.find((user) => user.email === email)
    if(!checkEmail) {
        Message.error('Can not find the account')
    } else {
        console.log(checkEmail._id)
        navigate(`/resetpassword/${checkEmail._id}`);
        handleSendCode(checkEmail._id)
    }
  };
  const navigate = useNavigate();
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "rgb(233, 236, 239)",
        }}
      >
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
            Email Address
          </h1>
          <p style={{ margin: "20px 0px" }}>Please enter your email address</p>
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
                placeholder="Enter email"
                style={{ height: "3rem", width: "20rem", fontSize: "20px" }}
                onChange={handleOnchangeEmail}
              />
              <Button
                style={{ height: "3rem", width: "6rem" }}
                onClick={handleCheckEmail}
                type="primary"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
