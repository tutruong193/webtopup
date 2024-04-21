import React, { useEffect, useState } from "react";
import TableComponent from "../../TableComponent/TableComponent";
import { Button, Select } from "antd";
import { useCookies } from "react-cookie";
import { jwtTranslate } from "../../../utilis";
import * as ViewReportService from "../../../services/ViewReportService";
import * as EventService from "../../../services/EventService";
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
      key: "1",
      name: "Number of contributions",
      description: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      name: "Percentage of contributions",
      description: "London No. 1 Lake Park",
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
        const res = await ViewReportService.getSelectedKeys(user?.faculty, selectedEvent);
        setKeySelected(res?.data?.selected); // Cập nhật state với các khóa của các mục đã được chọn
      } catch (error) {
        console.error("Error fetching selected keys:", error);
      }
    };
    if(selectedEvent !== null){
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
  };
  const handleHidden = async () => {
    const res = await ViewReportService.updateReport(user?.faculty, selectedEvent, []);
    setKeySelected([])
  };
  return (
    <div>
      <h1>Selected statistic for guest</h1>
      <Select
        style={{
          width: 120,
        }}
        onChange={handleChange}
        options={itemsEvent.map((item) => ({
          label: item.label,
          value: item.key,
        }))}
      />
      {selectedEvent && (
        <div>
          <TableComponent
            columns={columns}
            dataSource={data}
            rowSelection={{
              ...rowSelection,
            }}
          />

          <Button
            type="primary"
            disabled={!keySelected}
            onClick={() => handleView()}
          >
            Hien thi
          </Button>
          <Button type="primary" onClick={() => handleHidden()} danger>
            Ẩn hết
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoordinatorSelectedReports;
