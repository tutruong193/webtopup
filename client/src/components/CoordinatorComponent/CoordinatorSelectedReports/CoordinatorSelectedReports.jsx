import React, { useEffect, useState } from "react";
import TableComponent from "../../TableComponent/TableComponent";
import { Button, Select } from "antd";
import { useCookies } from "react-cookie";
import { jwtTranslate } from "../../../utilis";
import * as ViewReportService from "../../../services/ViewReportService";
import * as EventService from "../../../services/EventService";
import * as Message from "../../Message/Message";
const CoordinatorSelectedReports = () => {
  const [cookiesAccessToken, setCookieAccessToken] = useCookies("");
  const user = jwtTranslate(cookiesAccessToken.access_token);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
  ];
  const data = [
    {
      key: "Number of contributions",
      name: "Number of contributions",
      description: "New York No. 1 Lake Park",
    },
    {
      key: "Percentage of contributions",
      name: "Percentage of contributions",
      description: "London No. 1 Lake Park",
    },
    {
      key: "Number of contributions (students)",
      name: "Number of contributions (students)",
      description: "New York No. 1 Lake Park",
    },
  ];
  ///lấy thông tin events
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [itemsEvent, setItemsEvent] = useState([]);
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await EventService.getAllEvent();
        const formattedData = res.data.map((event) => ({
          key: event._id,
          label: event.name,
          openDate: event.openDate,
          firstCloseDate: event.firstCloseDate,
          finalCloseDate: event.finalCloseDate,
        }));
        setItemsEvent(formattedData);
      } catch (error) {
        console.error("Error fetching Event data:", error);
      }
    };
    fetchEventData();
  }, []);
  const handleChange = (value) => {
    setSelectedEvent(value);
  };
  ///hien thi cac cai dã chọn
  useEffect(() => {
    const fetchSelectedKeys = async () => {
      try {
        const res = await ViewReportService.getSelectedKeys(
          user?.faculty,
          selectedEvent
        );
        setKeySelected(res?.data?.selected); // Cập nhật state với các khóa của các mục đã được chọn
      } catch (error) {
        console.error("Error fetching selected keys:", error);
      }
    };
    if (selectedEvent !== null) {
      fetchSelectedKeys();
    }
  }, [selectedEvent]);
  //select statistics
  const [keySelected, setKeySelected] = useState([]);
  const rowSelection = {
    selectedRowKeys: keySelected,
    onChange: (selectedRows) => {
      setKeySelected(selectedRows);
    },
  };
  //handle view
  const handleView = async () => {
    const res = await ViewReportService.updateReport(
      user?.faculty,
      selectedEvent,
      keySelected
    );
    if (res.status === "OK") {
      Message.success();
    } else if (res.status === "ERR") {
      Message.error(res.message);
    }
  };
  const handleHidden = async () => {
    const res = await ViewReportService.updateReport(
      user?.faculty,
      selectedEvent,
      []
    );
    setKeySelected([]);
    if (res.status === "OK") {
      Message.success();
    } else if (res.status === "ERR") {
      Message.error(res.message);
    }
  };
  return (
    <div style={{ padding: "50px" }}>
      <h2 style={{ textTransform: "uppercase" }}>
        Selected statistic for guest
      </h2>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div>Choose event: </div>
        <Select
          style={{
            maxWidth: 200,
            minWidth: 150,
          }}
          onChange={handleChange}
          options={itemsEvent.map((item) => ({
            label: item.label,
            value: item.key,
          }))}
        />
      </div>
      {selectedEvent && (
        <div style={{ width: "100%" }}>
          <TableComponent
            columns={columns}
            dataSource={data}
            rowSelection={{
              ...rowSelection,
            }}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <Button type="primary" onClick={() => handleView()}>
              Show
            </Button>
            <Button type="primary" onClick={() => handleHidden()} danger>
              Hide
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorSelectedReports;
