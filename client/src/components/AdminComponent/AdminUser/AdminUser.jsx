import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  DatePicker,
  Dropdown,
  Space,
  message,
  Form,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import TableComponent from "../../TableComponent/TableComponent";
import DrawerComponent from "../../DrawerComponent/DrawerComponent";
import { WrapperHeader, WrapperAction, WrapperInput } from "./style";
import InputComponent from "../../InputComponent/InputComponent";
import * as FacultyService from "../../../services/FacultyService";
import { useQuery } from "@tanstack/react-query";
import { useMutationHooks } from "../../../hooks/useMutationHook";
import * as UserService from "../../../services/UserService";
import ModalComponent from "../../ModalComponent/ModalComponent";
import { useCookies } from "react-cookie";
import * as Message from "../../../components/Message/Message";
import Loading from "../../../components/LoadingComponent/LoadingComponent";
const AdminUser = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  //setup
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Faculty",
      dataIndex: "faculty",
      key: "faculty",
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (_, record) => {
        return dataTable.length > 0 ? (
          <div>
            <DeleteOutlined
              style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
              onClick={() => handleDelete(record)}
            />
            <EditOutlined
              style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
              onClick={() => handleDetailUser(record)}
            />
          </div>
        ) : null;
      },
    },
  ];
  const itemsRole = [
    {
      label: "Student",
      key: "Student",
    },
    {
      label: "Manager",
      key: "Manager",
    },
    {
      label: "Marketing Coordinator",
      key: "MarketingCoordinator",
    },
    {
      label: "Guest",
      key: "Guest",
    },
  ];
  const [stateUser, setStateUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    faculty: "",
  });

  //mỗi khi thay đổi input nhập vào, sẽ lưu luôn vào biến bằng useState
  const handleOnchangeUser = (e) => {
    setStateUser({
      ...stateUser,
      [e.target.name]: e.target.value,
    });
  };
  //modal add user
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  //set role khi click
  const handleRoleClick = ({ key }) => {
    setStateUser({
      ...stateUser,
      role: key,
    });
  };
  const menuPropsRole = {
    items: itemsRole,
    onClick: handleRoleClick,
  };
  /// lấy dữ riệu faculty
  const [itemsFaculty, setItemsFaculty] = useState([]);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const res = await FacultyService.getAllFaculty();
        // Chuyển đổi dữ liệu từ API thành định dạng mong muốn và cập nhật state
        const formattedData = res.data.map((faculty) => ({
          key: faculty._id, // Gán id vào key
          label: faculty.name, // Gán name vào name
        }));
        setItemsFaculty(formattedData);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };

    fetchFacultyData();
  }, []);
  const facultyLabel = (facultyId) => {
    const faculty = itemsFaculty.find((faculty) => faculty.key === facultyId);
    return faculty ? faculty.label : "";
  };
  // set faculty khi click
  const handleFacultyClick = ({ key }) => {
    setStateUser({
      ...stateUser,
      faculty: key ? key : null,
    });
  };
  const menuPropsFaculty = {
    items: itemsFaculty,
    onClick: handleFacultyClick,
  };
  //getalluser
  const [isLoadingData, setIsLoadingData] = useState(false);
  const fetchUserAll = async () => {
    setIsLoadingData(true);
    const res = await UserService.getAllUser();
    setIsLoadingData(false);
    return res;
  };
  const userQuerry = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserAll,
    config: { retry: 3, retryDelay: 1000 },
  });
  const { data: users } = userQuerry;
  const dataTable = users?.data
    ?.filter((user) => user.role !== "Admin")
    .map((user) => ({
      key: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      faculty: facultyLabel(user.faculty),
    }))
    .sort((a, b) =>
      a.faculty > b.faculty ? 1 : b.faculty > a.faculty ? -1 : 0
    );
  ///add user
  const [form] = Form.useForm();
  const handleOk = async () => {
    const res = await UserService.createUser(
      cookies["access_token"].split(" ")[1],
      stateUser
    );
    if (res.status === "OK") {
      Message.success();
      form.resetFields();
      setIsModalOpen(false);
      setStateUser({
        name: "",
        email: "",
        password: "",
        role: "",
        faculty: "",
      });
      userQuerry.refetch();
    } else if (res.status === "ERR") {
      Message.error(res.message);
    }
  };
  ///delete user
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
    setRowSelected("");
  };
  const handleDelete = (record) => {
    setIsModalOpenDelete(true);
    setRowSelected(record?.key);
  };
  const handleDeleteUser = async () => {
    const res = await UserService.deleteUser(
      rowSelected,
      cookies["access_token"].split(" ")[1]
    );
    if (res.status === "OK") {
      Message.success();
      setIsModalOpenDelete(false);
      userQuerry.refetch();
    } else if (res.status === "ERR") {
      Message.error(res.message);
    }
  };
  ////update user
  const [formUpdate] = Form.useForm();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [stateDetailUser, setStateDetailUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    faculty: "",
  });
  useEffect(() => {
    formUpdate.setFieldsValue(stateDetailUser);
  }, [formUpdate, stateDetailUser]);
  const handleDetailUser = (record) => {
    setRowSelected(record?.key);
    fetchGetUserDetail(record?.key);
    setIsOpenDrawer(true);
  };
  const handleRoleClickUpdate = ({ key }) => {
    setStateDetailUser({
      role: key,
    });
  };
  const menuPropsRoleUpdate = {
    items: itemsRole,
    onClick: handleRoleClickUpdate,
  };
  const handleFacultyClickUpdate = ({ key }) => {
    setStateDetailUser({
      ...stateDetailUser,
      faculty: key,
    });
  };
  const menuPropsFacultyUpdate = {
    items: itemsFaculty,
    onClick: handleFacultyClickUpdate,
  };
  const handleOnChangeDetails = (e) => {
    setStateDetailUser({
      ...stateDetailUser,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    if (rowSelected) {
      fetchGetUserDetail(rowSelected);
      // setIsOpenDrawer(true)
    }
  }, [rowSelected]);
  const fetchGetUserDetail = async (selectedID) => {
    const res = await UserService.getDetailsUser(
      selectedID,
      cookies["access_token"].split(" ")[1]
    );
    if (res?.data) {
      setStateDetailUser({
        name: res?.data?.name,
        email: res?.data?.email,
        password: res?.data?.password,
        role: res?.data?.role,
        faculty: res?.data?.faculty,
      });
    }
  };
  const updateUser = async () => {
    const res = await UserService.updateUser(
      rowSelected,
      stateDetailUser
    );
    if (res.status === "OK") {
      Message.success();
      setIsOpenDrawer(false);
      userQuerry.refetch();
    } else if (res.status === "ERR") {
      Message.error(res.message);
    }
  };
  //
  return (
    <div style={{ padding: "30px" }}>
      <WrapperHeader>
        <p>User Management</p>
      </WrapperHeader>
      <WrapperAction>
        <div
          style={{
            paddingLeft: "20px",
          }}
        >
          <Button style={{ width: "100px" }} type="primary" onClick={showModal}>
            Add
          </Button>
        </div>
      </WrapperAction>
      <div>
        <Loading isLoading={isLoadingData}>
          <TableComponent
            rowSelection={null}
            dataSource={dataTable}
            columns={columns}
          />
        </Loading>
      </div>
      <Modal
        title="Create User Account"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
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
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name",
              },
            ]}
          >
            <InputComponent
              value={stateUser["name"]}
              onChange={handleOnchangeUser}
              name="name"
            />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: "Please input your role!",
              },
            ]}
          >
            <Dropdown menu={menuPropsRole}>
              <Button>
                <Space>
                  {stateUser["role"] ? (
                    <span>
                      {stateUser["role"]} <DownOutlined />
                    </span>
                  ) : (
                    <span>
                      Select
                      <DownOutlined />
                    </span>
                  )}
                </Space>
              </Button>
            </Dropdown>
          </Form.Item>
          {stateUser["role"] !== "Manager" ? (
            <Form.Item
              label="Faculty"
              name="faculty"
              rules={[
                {
                  required: true,
                  message: "Please input your faculty!",
                },
              ]}
            >
              <Dropdown menu={menuPropsFaculty}>
                <Button>
                  <Space>
                    {stateUser["faculty"] ? (
                      <span>
                        {facultyLabel(stateUser["faculty"])} <DownOutlined />
                      </span>
                    ) : (
                      <span>
                        Select
                        <DownOutlined />
                      </span>
                    )}
                  </Space>
                </Button>
              </Dropdown>
            </Form.Item>
          ) : (
            <></>
          )}

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <InputComponent
              value={stateUser["email"]}
              onChange={handleOnchangeUser}
              name="email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <InputComponent
              value={stateUser["password"]}
              onChange={handleOnchangeUser}
              name="password"
            />
          </Form.Item>
        </Form>
      </Modal>
      <DrawerComponent
        title="Chi tiết user"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Form
          form={formUpdate}
          onFinish={updateUser}
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
          autoComplete="off"
        >
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
              value={stateDetailUser["name"]}
              onChange={handleOnChangeDetails}
              name="name"
            />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: "Please input your role!",
              },
            ]}
          >
            <Dropdown menu={menuPropsRoleUpdate}>
              <Button>
                <Space>
                  {stateDetailUser["role"] ? (
                    <span>
                      {stateDetailUser["role"]} <DownOutlined />
                    </span>
                  ) : (
                    <span>
                      Select
                      <DownOutlined />
                    </span>
                  )}
                </Space>
              </Button>
            </Dropdown>
          </Form.Item>
          {stateDetailUser["role"] === "Student" ||
          stateDetailUser["role"] === "MarketingCoordinator" ? (
            <Form.Item
              label="Faculty"
              name="faculty"
              rules={[
                {
                  required: true,
                  message: "Please input your faculty!",
                },
              ]}
            >
              <Dropdown menu={menuPropsFacultyUpdate}>
                <Button>
                  <Space>
                    {stateDetailUser["faculty"] ? (
                      <span>
                        {facultyLabel(stateDetailUser["faculty"])}{" "}
                        <DownOutlined />
                      </span>
                    ) : (
                      <span>
                        Select
                        <DownOutlined />
                      </span>
                    )}
                  </Space>
                </Button>
              </Dropdown>
            </Form.Item>
          ) : (
            <></>
          )}

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <InputComponent
              value={stateDetailUser["email"]}
              onChange={handleOnChangeDetails}
              name="email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <InputComponent
              value={stateDetailUser["password"]}
              onChange={handleOnChangeDetails}
              name="password"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </DrawerComponent>
      <ModalComponent
        title="Delete Account"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
      >
        <div>Are you sure to delete this account? </div>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;
