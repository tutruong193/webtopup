import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { WrapperUploadFile } from "./style";
import { WrapperHeader } from "./style";
import InputComponent from "../../InputComponent/InputComponent";
import { getBase64, jwtTranslate } from "../../../utilis";
import { useCookies } from "react-cookie";
import * as UserService from "../../../services/UserService";
import * as FacultyService from "../../../services/FacultyService";
import * as Message from "../../Message/Message";
import { useMutationHooks } from "../../../hooks/useMutationHook";
import Loading from "../../LoadingComponent/LoadingComponent";
const AdminAccount = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [detailUser, setDetailUser] = useState("");
  const [itemsFaculty, setItemsFaculty] = useState([]);
  ///lấy dữ liệu user
  const [cookiesAccessToken, setCookieAccessToken] = useCookies("");
  const user = jwtTranslate(cookiesAccessToken);
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
  // console.log("User", detailUser);
  // const userQuerry = useQuery({
  //   queryKey: ["users"],
  //   queryFn: fetchDetailUser,
  //   config: { retry: 3, retryDelay: 1000 },
  // });
  // const { data: users } = userQuerry;
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
  //thay đổi sdt
  const isVietnamesePhoneNumber = (phoneNumber) => {
    // Biểu thức chính quy để kiểm tra số điện thoại Việt Nam
    const vietnamesePhoneNumberRegex = /^(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return vietnamesePhoneNumberRegex.test(phoneNumber);
  };
  const [checkPhone, setCheckPhone] = useState(true);
  const handlePhoneNumberChange = (e) => {
    const phoneNumber = e.target.value;
    if (!isVietnamesePhoneNumber(phoneNumber)) {
      setCheckPhone(false); // Đặt checkPhone thành false nếu số điện thoại không hợp lệ
    } else {
      setCheckPhone(true); // Đặt lại checkPhone thành true nếu số điện thoại hợp lệ
    }
    handleOnchangeDetails(e);
  };
  //save
  const mutationUpdate = useMutationHooks((data) => {
    const { detailUser } = data;
    const token = cookiesAccessToken["access_token"].split(" ")[1];
    const res = UserService.updateUser(detailUser?._id, token, detailUser);
    return res;
  });

  const onFinish = () => {
    const token = cookiesAccessToken["access_token"].split(" ")[1];
    mutationUpdate.mutate({
      detailUser: detailUser?._id,
      token,
      detailUser: detailUser,
    });
  };

  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      Message.success();
    } else if (isErrorUpdated) {
      Message.error();
    }
  }, [isSuccessUpdated]);
  ///change password
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [comparePassword, setComparePassword] = useState();
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
      const token = cookiesAccessToken["access_token"].split(" ")[1];
      const res = await UserService.updateUser(user?.id, token, {
        password: values.newpassword,
      });
      if (res?.data) {
        Message.success("Password updated successfully!");
        setDetailUser({
          ...detailUser,
          password: values.newpassword,
        });
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
    <div style={{ padding: "30px" }}>
      <Loading isLoading={isLoading}>
        <div style={{ display: "flex" }}>
          <div style={{ justifyContent: "center", width: "50%" }}>
            <WrapperHeader>
              <p>User Profile</p>
            </WrapperHeader>
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
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
              <Form.Item
                label="Phone Number"
                name="phonenumber"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                ]}
              >
                <div>
                  <InputComponent
                    value={detailUser?.phone}
                    onChange={handlePhoneNumberChange}
                    name="phone"
                  />
                  {!checkPhone && (
                    <span style={{ color: "red" }}>
                      Your phone number is invalid!!!
                    </span>
                  )}
                </div>
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
              <Form.Item style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100px" }} // Thiết lập chiều rộng cho nút Apply
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div style={{ justifyContent: "center", width: "50%" }}>
            <WrapperHeader>
              <p>Change password</p>
            </WrapperHeader>
            <Form
              name="change-password"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
              }}
              initialValues={{
                remember: true,
              }}
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
                    <span style={{ color: "red" }}>Password not matches</span>
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
              <Form.Item style={{ display: "flex", justifyContent: "center" }}>
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
      </Loading>
    </div>
  );
};

export default AdminAccount;
