import React, { useState } from "react";
import { getItem } from "../../utilis";
import {
  UserOutlined,
  FormOutlined,
  LogoutOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import AccountDetailComponent from "../../components/AccountDetailComponent/AccountDetailComponent";
import GuestViewReport from "../../components/GuestComponent/GuestViewReport/GuestViewReport";
const GuestPage = () => {
  const [cookiesAccessToken, setCookieAccessToken, removeCookie] =
    useCookies("");
  const items = [
    getItem(
      "Functions",
      "g2",
      null,
      [
        getItem("User Profile", "user", <UserOutlined />),
        getItem("View Reports", "viewReport", <FormOutlined />),
      ],
      "group"
    ),
  ];
  const renderPage = (key) => {
    switch (key) {
      case "user":
        return (
          <AccountDetailComponent
            accesstoken={cookiesAccessToken.access_token}
          />
        );
      case "viewReport":
        return <GuestViewReport />;
      default:
        return <></>;
    }
  };
  const [keySelected, setKeySelected] = useState("");

  const handleOnCLick = ({ key }) => {
    setKeySelected(key);
  };
  const navigate = useNavigate();
  return (
    <>
      <div style={{ display: "flex" }}>
        <Menu
          mode="inline"
          style={{
            width: 256,
            boxShadow: "1px 1px 2px #ccc",
            height: "100vh",
          }}
          items={items}
          onClick={handleOnCLick}
        />
        <div style={{ flex: 1, padding: "15px" }}>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  );
};

export default GuestPage;
