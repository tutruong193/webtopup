import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Button,
  Space,
} from "antd";
import * as FacultyService from "../../../services/FacultyService";
import { useQuery } from "@tanstack/react-query";
import * as Message from "../../Message/Message";
import * as UserService from "../../../services/UserService";
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const AdminFaculty = () => {
    ///fetch to get the list of faculty 
  const fetchData = async () => {
    try {
      const facultyRes = await FacultyService.getAllFaculty();
      const formattedData = facultyRes.data.map((faculty) => ({
        key: faculty._id, // Gán id vào key
        name: faculty.name, // Gán name vào name
      }));
      return formattedData;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const facultyQuerry = useQuery({
    queryKey: ["faculties"],
    queryFn: fetchData,
    config: { retry: 3, retryDelay: 1000 },
  });
  const { data: faculties } = facultyQuerry;
  ///edit faculty
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      console.log(row.name);
      console.log(key);
      setEditingKey("");
      const res = await FacultyService.updateFaculty(key, row.name);
      if (res.status === "OK") {
        facultyQuerry.refetch();
        Message.success(res.message);
      } else if (res.status === "ERR") {
        Message.error(res.message);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "name",
      dataIndex: "name",
      width: "50%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        const isUserExist = checkUserExist(record.key);

        // Tạo một biến để lưu thông báo khi nút bị disable
        let disabledMessage = "";
    
        // Kiểm tra nếu user tồn tại trong faculty
        if (isUserExist) {
          disabledMessage = "This faculty has associated users. You cannot delete it.";
        }
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
              disabled={isUserExist}
            >
              <Typography.Link disabled={isUserExist} title={disabledMessage}>Delete</Typography.Link>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  ///add
  const [newFaculty, setNewFaculty] = useState("");
  const handleAdd = async () => {
    console.log(newFaculty);
    const res = await FacultyService.addFaculty(newFaculty);
    if (res.status === "OK") {
      Message.success(res.message);
      setNewFaculty("");
      facultyQuerry.refetch();
    } else if (res.status === "ERR") {
      Message.error(res.message);
    }
  };
  const handleCancel = () => {
    setNewFaculty("");
  };

  const handleOnChange = (e) => {
    setNewFaculty(e.target.value);
  };
  ///delete
  //lấy danh sách user
  const [itemsUser, setItemsUser] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await UserService.getAllUser();
        setItemsUser(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching User data:", error);
      }
    };
    fetchUserData();
  }, []);

  const checkUserExist = (facultyId) => {
    const result = itemsUser.some((user) => user.faculty === facultyId);
    return result;
  };
  const handleDelete = async (key) => {
    const res = await FacultyService.deleteFaculty(key)
    if(res.status === 'OK'){
        Message.success(res.message)
        facultyQuerry.refetch();
    } else if(res.status ==='ERR'){
        Message.error(res.message)
    }
  };
  return (
    <div>
      <Form form={form} component={false}>
        <Popconfirm
          icon=""
          placement="bottomLeft"
          title="Add a faculty"
          onConfirm={handleAdd}
          onCancel={handleCancel}
          trigger="click"
          description={
            <div>
              <Input onChange={handleOnChange} value={newFaculty}></Input>
            </div>
          }
        >
          <Button
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            Add a faculty
          </Button>
        </Popconfirm>

        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={faculties}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  );
};

export default AdminFaculty;
