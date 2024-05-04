import React, { useEffect, useState } from "react";
import { Button, Form, Input, Tabs } from "antd";
import { WrapperUploadFile } from "./style";
import { WrapperHeader } from "./style";
import InputComponent from "../InputComponent/InputComponent";
import { getBase64, jwtTranslate } from "../../utilis";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import * as FacultyService from "../../services/FacultyService";
import * as Message from "../Message/Message";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/LoadingComponent";

const AccountDetailComponent = ({ accesstoken }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [detailUser, setDetailUser] = useState("");
  const [itemsFaculty, setItemsFaculty] = useState([]);

  ///lấy dữ liệu user
  const user = jwtTranslate(accesstoken.split(" ")[1]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detailUserRes = await UserService.getDetailsUser(user?.id);
        if (detailUserRes?.data) {
          setDetailUser(detailUserRes?.data);
        }
        const facultyRes = await FacultyService.getAllFaculty();
        const formattedData = facultyRes.data.map((faculty) => ({
          key: faculty._id, // Gán id vào key
          name: faculty.name, // Gán name vào name
        }));
        setItemsFaculty(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const facultyLabel = (facultyId) => {
    const faculty = itemsFaculty.find((faculty) => faculty.key === facultyId);
    return faculty ? faculty.name : "";
  };

  ///cho vào form
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(detailUser);
  }, [form, detailUser]);

  ///xử lý thay đổi
  const handleOnchangeDetails = (e) => {
    setDetailUser({
      ...detailUser,
      [e.target.name]: e.target.value,
    });
  };

  //thay đổi avatar
  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setDetailUser({
      ...detailUser,
      avatar: file.preview,
    });
  };


  //save

  const onFinish = async () => {
    const res = await UserService.updateUser(detailUser?._id, detailUser)
    if(res.status === 'OK') {
      Message.success();
    } else if (res.status === 'ERR') {
      Message.error(res.message);
    }
  };

  ///change password
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [comparePassword, setComparePassword] = useState();
  const [formPass] = Form.useForm();
  const handleOnchangePassword = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
      if (value === detailUser.password) {
        setComparePassword(true);
      } else {
        setComparePassword(false);
      }
    } else if (name === "newpassword") {
      setNewPassword(value);
    } else if (name === "re-newpassword") {
      setReNewPassword(value);
    }
  };

  const onChangePass = async (values) => {
    try {
      const res = await UserService.updateUser(user?.id, {
        password: values.newpassword,
      });
      if (res.status === 'OK') {
        Message.success("Password updated successfully!");
        setDetailUser({
          ...detailUser,
          password: values.newpassword,
        });
        formPass.resetFields()
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
  ///logout
  const navigate = useNavigate();
  const handleLogout = async () => {
    await UserService.logoutUser();
    navigate("/");
    window.location.reload();
  };
  return (
    <Loading isLoading={isLoading}>
      <Tabs
        defaultActiveKey="1"
        type="card"
        size="middle"
        items={[
          {
            key: "profile",
            label: "User Profile",
            children: (
              <div style={{ justifyContent: "center", width: "100%" }}>
                <WrapperHeader>
                  <p>User Profile</p>
                </WrapperHeader>
                <div
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  <Form
                    labelAlign="left"
                    name="basic"
                    labelCol={{ flex: "150px" }}
                    wrapperCol={{
                      span: 16,
                    }}
                    style={{
                      width: 600,
                    }}
                    initialValues={{
                      remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                  >
                    <Form.Item label="Email" name="email">
                      <div>{detailUser?.email}</div>
                    </Form.Item>
                    {detailUser?.facultyId && (
                      <Form.Item label="Faculty" name="faculty">
                        <div>{facultyLabel(user.faculty)}</div>
                      </Form.Item>
                    )}
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your name!",
                        },
                      ]}
                    >
                      <InputComponent
                        value={detailUser?.name}
                        onChange={handleOnchangeDetails}
                        name="name"
                      />
                    </Form.Item>
                    <Form.Item label="Avatar" name="avatar">
                      <WrapperUploadFile
                        onChange={handleOnchangeAvatarDetails}
                        maxCount={1}
                        accept="image/*"
                      >
                        <Button>Select File</Button>
                        {detailUser?.avatar && (
                          <img
                            src={detailUser?.avatar}
                            style={{
                              height: "60px",
                              width: "60px",
                              objectFit: "cover",
                              marginLeft: "10px",
                            }}
                            alt="avatar"
                          />
                        )}
                      </WrapperUploadFile>
                    </Form.Item>
                    <Form.Item
                      style={{ display: "flex", justifyContent: "center", width: '100%' }}
                    >
                      <div style={{display: 'flex', gap: '16px'}}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{ width: "100px" }} // Thiết lập chiều rộng cho nút Apply
                        >
                          Save
                        </Button>
                        <Button
                          onClick={handleLogout}
                          style={{ width: "100px" }} // Thiết lập chiều rộng cho nút Apply
                        >
                          Logout
                        </Button>
                      </div>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            ),
          },
          {
            key: "changepass",
            label: "Change Password",
            children: (
              <div style={{ justifyContent: "center", width: "100%" }}>
                <WrapperHeader>
                  <p>Change password</p>
                </WrapperHeader>
                <div
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    display: "flex",
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
                    form = {formPass}
                    onFinish={onChangePass}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="Current Password"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your current password!",
                        },
                      ]}
                    >
                      <div>
                        <Input.Password
                          value={password}
                          onChange={handleOnchangePassword}
                          name="password"
                        />
                        {comparePassword === false && (
                          <span style={{ color: "red" }}>
                            Password not matches
                          </span>
                        )}
                      </div>
                    </Form.Item>
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
                            if (
                              !value ||
                              getFieldValue("newpassword") === value
                            ) {
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
            ),
          },
        ]}
      />
    </Loading>
  );
};

export default AccountDetailComponent;
