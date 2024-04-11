import React, { useEffect, useState } from "react";
import { getItem, jwtTranslate } from "../../utilis";
import {
  UserOutlined,
  FormOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { WrapperBell } from "./style";
import { Menu, Popover, Badge, Card, List } from "antd";
import * as UserService from "../../services/UserService";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import CoordinatorEvent from "../../components/CoordinatorComponent/CoordinatorEvent/CoordinatorEvent";
import CoordinatorContribution from "../../components/CoordinatorComponent/CoordinatorContribution/CoordinatorContribution";
import * as NotificationService from "../../services/NotificationService";
import { format } from "date-fns";
import AccountDetailComponent from "../../components/AccountDetailComponent/AccountDetailComponent";
const CoordinatorPage = () => {
  const [cookiesAccessToken, setCookieAccessToken] = useCookies("");
  const user = jwtTranslate(cookiesAccessToken.access_token);
  const items = [
    getItem(
      "Functions",
      "g2",
      null,
      [
        getItem("Account", "account", <UserOutlined />),
        getItem("List Of Contributions", "listBlog", <FormOutlined />),
      ],
      "group"
    ),
  ];
  const renderPage = (key) => {
    switch (key) {
      case "account":
        return <AccountDetailComponent accesstoken={cookiesAccessToken.access_token}/>;
      case "notification":
        return (
          <Popover placement="rightTop" title="abc">
            <BellOutlined />
          </Popover>
        );
      case "listBlog":
        return <CoordinatorEvent />;
      case "contribution":
        return <CoordinatorContribution />;
      default:
        return <></>;
    }
  };
  const [keySelected, setKeySelected] = useState("");

  const handleOnCLick = ({ key }) => {
    setKeySelected(key);
  };
  const navigate = useNavigate();
  ///lay thong bao
  const [notification, setNotification] = useState([]);
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await NotificationService.getAllNotification();
        if (res?.data) {
          const filteredNotifications = res.data
            .filter((notification) => notification.facultyId == user?.faculty)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          setNotification(filteredNotifications);
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };
    fetchNotification();
  }, [notification]);
  //notification
  const content = [
    <div
      id="scrollableDiv"
      style={{
        maxHeight: 300,
        overflow: "auto",
        padding: "0 16px",
        width: 700,
        background: "rgb(240, 242, 245)",
      }}
    >
      <List
        dataSource={notification}
        renderItem={(item) => (
          <List.Item key={item._id} style={{ width: "100%" }}>
            <Card
              hoverable
              title={format(new Date(item?.date), "HH:mm - dd/MM/yyyy")}
              style={{
                margin: "10px 0px",
                width: "100%",
                border: item.isRead ? "none" : "2px solid red",
              }}
              onMouseEnter={() => hoverToRead(item._id)}
            >
              {item?.title}
            </Card>
          </List.Item>
        )}
      />
    </div>,
  ];
  const hoverToRead = async (id) => {
    const res = await NotificationService.readOneNotifications(id);
    console.log(res);
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
        />
        <div style={{ flex: 1, padding: "15px" }}>
          {renderPage(keySelected)}
        </div>
        <Popover
          placement="topRight"
          title="Notifications"
          content={content}
          style={{ width: "600px" }}
        >
          <WrapperBell>
            <Badge
              count={
                notification?.filter(
                  (notification) => notification.isRead === false
                )?.length
              }
            >
              <BellOutlined style={{ color: "white" }} />
            </Badge>
          </WrapperBell>
        </Popover>
      </div>
    </>
  );
};

export default CoordinatorPage;
