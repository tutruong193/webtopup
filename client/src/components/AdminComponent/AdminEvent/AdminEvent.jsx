import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  DatePicker,
  Form,
  Space,
  Table,
  Tag,
  Dropdown,
  message,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import InputComponent from "../../InputComponent/InputComponent";
import { WrapperHeader } from "./style";
import { WrapperAction } from "../AdminUser/style";
import TableComponent from "../../TableComponent/TableComponent";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { useMutationHooks } from "../../../hooks/useMutationHook";
import * as EventService from "../../../services/EventService";
import { useQuery } from "@tanstack/react-query";
import * as Message from "../../../components/Message/Message";
import ModalComponent from "../../ModalComponent/ModalComponent";
import { useCookies } from "react-cookie";
import Loading from "../../../components/LoadingComponent/LoadingComponent";
const AdminEvent = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const renderAction = (record) => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "25px", cursor: "pointer" }}
          onClick={() => handleDelete(record)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "25px", cursor: "pointer" }}
          onClick={() => handleDetailEvent(record)}
        />
      </div>
    );
  };
  const isExpired = (date) => {
    const currentDateTime = new Date();
    const newDate = new Date(date);
    return newDate > currentDateTime ? false : true;
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ color: record?.isExpired ? "red" : "rgb(38, 224, 51)" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Open Date",
      dataIndex: "openDate",
      key: "openDate",
      render: (text, record) => <div>{text}</div>,
    },
    {
      title: "First Close Date",
      dataIndex: "firstCloseDate",
      key: "firstCloseDate",
      render: (text, record) => (
        <div
          style={{
            color: isExpired(record.firstCloseDate) ? "red" : "inherit",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Final Close Date",
      dataIndex: "finalCloseDate",
      key: "finalCloseDate",
      render: (text, record) => (
        <div
          style={{
            color: isExpired(record.finalCloseDate) ? "red" : "inherit",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        if (record.status === "beforeFirstCloseDate") {
          return <Tag color="green">Can submit, edit, and comment</Tag>;
        } else if (record.status === "beforeFinalCloseDate") {
          return <Tag color="blue">Can comment only</Tag>;
        } else {
          return <Tag color="red">Closed</Tag>;
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: renderAction,
    },
  ];
  ///getall event
  const fetchEventAll = async () => {
    try {
      setIsLoadingData(true);
      const res = await EventService.getAllEvent();
      return res;
    } catch (error) {
      console.log(error);
      setIsLoadingData(false);
    } finally {
      setIsLoadingData(false);
    }
  };

  const eventQuerry = useQuery({
    queryKey: ["events"],
    queryFn: fetchEventAll,
    config: { retry: 3, retryDelay: 1000 },
  });
  const { data: events } = eventQuerry;

  const dataTable = events?.data
    ?.map((event) => {
      let status = "";
      const currentDate = new Date();
      const vietnamTimezone = "Asia/Ho_Chi_Minh";
      const openDate = utcToZonedTime(event.openDate, vietnamTimezone);
      const firstCloseDate = utcToZonedTime(
        event.firstCloseDate,
        vietnamTimezone
      );
      const finalCloseDate = utcToZonedTime(
        event.finalCloseDate,
        vietnamTimezone
      );
      if (currentDate < firstCloseDate) {
        status = "beforeFirstCloseDate";
      } else if (currentDate < finalCloseDate) {
        status = "beforeFinalCloseDate";
      } else {
        status = "closed";
      }
      const formattedOpenDate = format(openDate, "HH:mm:ss yyyy/MM/dd", {
        timeZone: vietnamTimezone,
      });
      const formattedFirstCloseDate = format(
        firstCloseDate,
        "HH:mm:ss yyyy/MM/dd",
        { timeZone: vietnamTimezone }
      );
      const formattedFinalCloseDate = format(
        finalCloseDate,
        "HH:mm:ss yyyy/MM/dd",
        { timeZone: vietnamTimezone }
      );
      return {
        key: event._id,
        name: event.name,
        openDate: formattedOpenDate,
        firstCloseDate: formattedFirstCloseDate,
        finalCloseDate: formattedFinalCloseDate,
        status: status,
        isExpired: isExpired(event.finalCloseDate),
      };
    })
    .sort((a, b) => {
      // Sắp xếp những sự kiện còn hạn lên trước
      if (a.isExpired && !b.isExpired) {
        return 1;
      } else if (!a.isExpired && b.isExpired) {
        return -1;
      } else {
        return 0;
      }
    });
  ///setup add event
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stateEvent, setStateEvent] = useState({
    name: "",
    openDate: "",
    firstCloseDate: "",
    finalCloseDate: "",
  });
  const handleOnchangeEventName = (e) => {
    setStateEvent({
      ...stateEvent,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnChange = (name, value) => {
    let formattedValue = value;
    if (value instanceof Date) {
      const vietnamTimezone = "Asia/Ho_Chi_Minh";
      const zonedTime = utcToZonedTime(value, vietnamTimezone); // Chuyển múi giờ sang múi giờ của Việt Nam
      formattedValue = format(zonedTime, "yyyy/MM/dd HH:mm:ss", {
        timeZone: vietnamTimezone,
      }); // Định dạng lại ngày tháng và múi giờ
    }

    setStateEvent({
      ...stateEvent,
      [name]: formattedValue,
    });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const mutationAdded = useMutationHooks((data) =>
    EventService.createEvent(data)
  );
  const [form] = Form.useForm();
  const handleOk = () => {
    mutationAdded.mutate(
      { ...stateEvent },
      {
        onSettled: () => {
          eventQuerry.refetch();
        },
      }
    );
    if (dataAdded?.status == "OK") {
      setStateEvent({
        name: "",
        openDate: "",
        firstCloseDate: "",
        finalCloseDate: "",
      });
      setIsModalOpen(false);
    }
    form.resetFields();
  };
  const {
    data: dataAdded,
    isLoading: isLoadingAdded,
    isSuccess: isSuccessAdded,
    isError: isErrorAdded,
  } = mutationAdded;
  useEffect(() => {
    if (isSuccessAdded && dataAdded?.status === "OK") {
      Message.success();
      setIsModalOpen(false);
    } else if (isErrorAdded && dataAdded?.status === "ERR") {
      Message.error();
    }
  }, [isSuccessAdded]);
  //delete event
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const handleDelete = (record) => {
    setIsModalOpenDelete(true);
    setRowSelected(record?.key);
  };
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const handleDeleteEvent = async (id) => {
    const res = await EventService.deleteEvent(
      id,
      cookies["access_token"].split(" ")[1]
    );
    if (res.status === "OK") {
      Message.success();
      setIsModalOpenDelete(false);
      setRowSelected("");
      eventQuerry.refetch();
    } else if (res.status === "ERR") {
      Message.error(res.message);
    }
  };
  //////update event
  const [formUpdate] = Form.useForm();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [stateDetailEvent, setStateDetailEvent] = useState({
    name: "",
    openDate: "",
    firstCloseDate: "",
    finalCloseDate: "",
  });
  useEffect(() => {
    formUpdate.setFieldsValue(stateDetailEvent);
  }, [formUpdate, stateDetailEvent]);
  const handleDetailEvent = (record) => {
    const selectedId = record?.key;
    fetchGetEventDetail(selectedId);
    setRowSelected(selectedId);
    setIsOpenDrawer(true);
  };
  const handleOnchangeEventDetailName = (e) => {
    setStateDetailEvent({
      ...stateDetailEvent,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnChangeDetail = (name, value) => {
    let formattedValue = value;
    if (value instanceof Date) {
      const vietnamTimezone = "Asia/Ho_Chi_Minh";
      const zonedTime = utcToZonedTime(value, vietnamTimezone); // Chuyển múi giờ sang múi giờ của Việt Nam
      formattedValue = format(zonedTime, "yyyy/MM/dd HH:mm:ss", {
        timeZone: vietnamTimezone,
      }); // Định dạng lại ngày tháng và múi giờ
    }

    setStateDetailEvent({
      ...stateDetailEvent,
      [name]: formattedValue,
    });
  };
  const fetchGetEventDetail = async (selectedID) => {
    const res = await EventService.getDetailsEvent(
      selectedID,
      cookies["access_token"].split(" ")[1]
    );
    if (res?.data) {
      setStateDetailEvent({
        name: res?.data?.name,
        openDate: res?.data?.openDate,
        firstCloseDate: res?.data?.firstCloseDate,
        finalCloseDate: res?.data?.finalCloseDate,
      });
    }
  };

  const updateEvent = async (id) => {
    const res = await EventService.updateEvent(
      id,
      cookies["access_token"].split(" ")[1],
      stateDetailEvent
    );
    if (res.status === "OK") {
      Message.success();
      setIsOpenDrawer(false);
      setRowSelected("");
      eventQuerry.refetch();
    } else if (res.status === "ERR") {
      Message.error(res.message);
    }
  };
  // //
  return (
    <div style={{ padding: "30px" }}>
      <WrapperHeader>
        <p>Event Management</p>
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
          dataSource={dataTable}
          columns={columns}
          rowSelection={null}
        />
        </Loading>
      </div>
      <div>
        <div>
          <Modal
            title="Add Event"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            {dataAdded?.status == "ERR" && (
              <p style={{ color: "red" }}>{dataAdded?.message}</p>
            )}
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
              autoComplete="off"
              form={form}
            >
              <Form.Item
                label="Name of event"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input name",
                  },
                ]}
              >
                <InputComponent
                  value={stateEvent["name"]}
                  onChange={handleOnchangeEventName}
                  name="name"
                />
              </Form.Item>
              <Form.Item
                label="Open date"
                name="openDate"
                rules={[
                  {
                    required: true,
                    message: "Please input date",
                  },
                ]}
              >
                <DateTimePicker
                  clearIcon={null}
                  format="yyyy-MM-dd HH:mm" // HH is used for 24-hour format
                  disableClock
                  locale="en-US"
                  value={stateEvent["openDate"]}
                  onChange={(value) => handleOnChange("openDate", value)}
                />
              </Form.Item>
              <Form.Item
                label="First close date"
                name="firstCloseDate"
                rules={[
                  {
                    required: true,
                    message: "Please input date",
                  },
                ]}
              >
                <DateTimePicker
                  clearIcon={null}
                  format="yyyy-MM-dd HH:mm" // HH is used for 24-hour format
                  disableClock
                  locale="en-US"
                  value={stateEvent["firstCloseDate"]}
                  onChange={(value) => handleOnChange("firstCloseDate", value)}
                />
              </Form.Item>
              <Form.Item
                label="Final close date"
                name="finalCloseDate"
                rules={[
                  {
                    required: true,
                    message: "Please input date",
                  },
                ]}
              >
                <DateTimePicker
                  clearIcon={null}
                  format="yyyy-MM-dd HH:mm" // HH is used for 24-hour format
                  disableClock
                  locale="en-US"
                  value={stateEvent["finalCloseDate"]}
                  onChange={(value) => handleOnChange("finalCloseDate", value)}
                />
              </Form.Item>
            </Form>
          </Modal>
          <ModalComponent
            title="Delete Event"
            open={isModalOpenDelete}
            onCancel={handleCancelDelete}
            onOk={() => handleDeleteEvent(rowSelected)}
          >
            <div>Are you sure to delete this event? </div>
          </ModalComponent>
          <ModalComponent
            title="Event Details"
            open={isOpenDrawer}
            onCancel={() => setIsOpenDrawer(false)}
            footer=""
          >
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
              autoComplete="off"
              form={formUpdate}
            >
              <Form.Item
                label="Name of event"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input name",
                  },
                ]}
              >
                <InputComponent
                  value={stateDetailEvent["name"]}
                  onChange={handleOnchangeEventDetailName}
                  name="name"
                />
              </Form.Item>
              <Form.Item
                label="Open date"
                name="openDate"
                rules={[
                  {
                    required: true,
                    message: "Please input date",
                  },
                ]}
              >
                <DateTimePicker
                  clearIcon={null}
                  format="yyyy-MM-dd HH:mm" // HH is used for 24-hour format
                  disableClock
                  locale="en-US"
                  value={stateDetailEvent["openDate"]}
                  onChange={(value) => handleOnChangeDetail("openDate", value)}
                />
              </Form.Item>
              <Form.Item
                label="First close date"
                name="firstCloseDate"
                rules={[
                  {
                    required: true,
                    message: "Please input date",
                  },
                ]}
              >
                <DateTimePicker
                  clearIcon={null}
                  format="yyyy-MM-dd HH:mm" // HH is used for 24-hour format
                  disableClock
                  locale="en-US"
                  value={stateDetailEvent["firstCloseDate"]}
                  onChange={(value) =>
                    handleOnChangeDetail("firstCloseDate", value)
                  }
                />
              </Form.Item>
              <Form.Item
                label="Final close date"
                name="finalCloseDate"
                rules={[
                  {
                    required: true,
                    message: "Please input date",
                  },
                ]}
              >
                <DateTimePicker
                  clearIcon={null}
                  format="yyyy-MM-dd HH:mm" // HH is used for 24-hour format
                  disableClock
                  locale="en-US"
                  value={stateDetailEvent["finalCloseDate"]}
                  onChange={(value) =>
                    handleOnChangeDetail("finalCloseDate", value)
                  }
                />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                <Button type="primary" onClick={() => updateEvent(rowSelected)}>
                  Update
                </Button>
              </Form.Item>
            </Form>
          </ModalComponent>
        </div>
      </div>
    </div>
  );
};

export default AdminEvent;
