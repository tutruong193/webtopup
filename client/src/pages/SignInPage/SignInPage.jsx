import React, { useEffect, useState } from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import InputForm from "../../components/InputForm/InputForm";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import imageLogo from "../../assets/images/logo-login.png";
import { Image } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import { useCookies } from "react-cookie";
import { jwtTranslate } from "../../utilis";
import * as Message from "../../components/Message/Message";
const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookiesAccessToken, setCookieAccessToken] = useCookies("");
  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const navigate = useNavigate();

  const handleNavigateHomePage = () => {
    navigate("/");
  };

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  const handleLogin = async() => {
    mutation.mutate({
      email,
      password,
    });
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
  const { data, isSuccess } = mutation;
  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      setCookieAccessToken("access_token", `Bearer ${data?.access_token}`, {
        path: "/",
        encode: String,
      });
      const user = jwtTranslate(data?.access_token);
      switch (user?.role) {
        case "Admin":
          navigate("/system/admin");
          break;
        case "Student":
          navigate("/system/student");
          break;
        case "MarketingCoordinator":
          navigate("/system/coordinator");
          break;
        case "Manager":
          navigate("/system/manager");
          break;
        case "Guest":
          navigate("/system/guest");
          break;
        default:
          navigate("/signin");
      }
    } else if (
      data?.status === "ERR" &&
      data?.message === "Not activated yet"
    ) {
      Message.warning("Account is not verified");
      setTimeout(() => {
        handleSendCode(data?.data?._id);
        navigate(`/active/${data?.data?._id}`);
      }, 1500);
    }
  }, [isSuccess, data]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.53)",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "445px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1>LOGIN</h1>
          {data?.status === "ERR" ? (
            <span style={{ color: "red" }}>{data?.message}</span>
          ) : null}
          <InputForm
            style={{ marginBottom: "10px" }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnchangeEmail}
          />
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="password"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
            />
          </div>
          <ButtonComponent
            disabled={!email.length || !password.length}
            size={40}
            onClick={handleLogin}
            styleButton={{
              background: "rgb(255, 57, 69)",
              height: "48px",
              width: "100%",
              border: "none",
              borderRadius: "4px",
              margin: "26px 0 10px",
            }}
            textButton={"Login"}
            styleTextButton={{
              color: "#fff",
              fontSize: "15px",
              fontWeight: "700",
            }}
          ></ButtonComponent>
          <p>
            <WrapperTextLight><a href='/resetpassword'>Forgot password?</a></WrapperTextLight>
          </p>
          <p>
            Back to{" "}
            <WrapperTextLight onClick={handleNavigateHomePage}>
              Home page
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image
            src={imageLogo}
            preview={false}
            alt="iamge-logo"
            height="203px"
            width="203px"
          />
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignInPage;
