import { Menu } from "antd";
import React, { useState } from "react";
import { getItem } from "../../utilis";
import {
  UserOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import AdminUser from "../../components/AdminComponent/AdminUser/AdminUser";
import AdminEvent from "../../components/AdminComponent/AdminEvent/AdminEvent";
import * as UserService from "../../services/UserService";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import AdminFaculty from "../../components/AdminComponent/AdminFaculty/AdminFaculty";
import AccountDetailComponent from "../../components/AccountDetailComponent/AccountDetailComponent";
const AdminPage = () => {
  const items = [
    getItem(
      "Functions",
      "g2",
      null,
      [
        getItem("Account", "account", <UserOutlined />),
        getItem("User Management", "user", <UserOutlined />),
        getItem("Faculty management", "faculty", <UserOutlined />),
        getItem("Event Management", "event", <AppstoreOutlined />),
      ],
      "group"
    ),
  ];
  
  const renderPage = (key) => {
    switch (key) {
      case "account":
        return <AccountDetailComponent accesstoken={cookiesAccessToken.access_token}/>;
      case "faculty":
        return <AdminFaculty />;
      case "user":
        return <AdminUser />;
      case "event":
        return <AdminEvent />;
      default:
        return <></>;
    }
  };
  const [keySelected, setKeySelected] = useState("user");
  const [cookiesAccessToken, setCookieAccessToken] = useCookies("");
  const navigate = useNavigate();
  const handleOnCLick = ({ key }) => {
    setKeySelected(key);
  };
  const handleLogout = async () => {
    await UserService.logoutUser();
    navigate("/");
    window.location.reload();
  };
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
          defaultSelectedKeys={['user']}
        />
        <div style={{ flex: 1, padding: "15px" }}>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
