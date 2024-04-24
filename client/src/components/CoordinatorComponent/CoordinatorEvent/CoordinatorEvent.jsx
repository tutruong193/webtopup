import React, { useEffect, useState } from "react";
import { Input, Space, List, Skeleton } from "antd";
import { CaretLeftOutlined } from "@ant-design/icons";
import { WrapperHeader } from "../CoordinatorEvent/style";
import TableComponent from "../../TableComponent/TableComponent";
import * as EventService from "../../../services/EventService";
import CoordinatorContribution from "../CoordinatorContribution/CoordinatorContribution";
import { jwtTranslate } from "../../../utilis";
import { useCookies } from "react-cookie";
import * as UserService from "../../../services/UserService";
import * as ContributionService from "../../../services/ContributionService";
import Loading from "../../../components/LoadingComponent/LoadingComponent";
const CoordinatorEvent = () => {
  const [cookiesAccessToken, setCookieAccessToken] = useCookies("");
  const marketingaccount = jwtTranslate(cookiesAccessToken.access_token);
  ////lấy tên học sinh và dữ liệu contribution
  const [itemsStudent, setItemsStudent] = useState([]);
  const [itemContributions, setItemContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resStudent = await UserService.getAllUser();
        const filteredStudents = resStudent.data.filter(
          (user) =>
            user.role === "Student" && user.faculty === marketingaccount.faculty
        );
        const resContribution = await ContributionService.getAllContributions();
        setItemsStudent(filteredStudents);
        setItemContributions(resContribution?.data);
        const res = await EventService.getAllEvent();
        // Chuyển đổi dữ liệu từ API thành định dạng mong muốn và cập nhật state
        const formattedData = res.data.map((event) => ({
          key: event._id, // Gán id vào key
          label: event.name, // Gán name vào name
          openDate: event.openDate,
          firstCloseDate: event.firstCloseDate,
          finalCloseDate: event.finalCloseDate,
        }));
        const currentDateTime = new Date();
        const validEvents = formattedData.filter(
          (event) => new Date(event.finalCloseDate) > currentDateTime
        );
        setItemsEvent(validEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData().then((res) => {
      setIsLoading(false);
    });
  }, []);
  ////lấy sự kiện còn valid
  const [itemsEvent, setItemsEvent] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [showContribution, setShowContribution] = useState(false);
  const handleViewContribution = (eventId) => {
    setShowContribution(true);
    setEventId(eventId);
  };
  return (
    <div>
      {!showContribution && (
        <WrapperHeader>
          <p>List of Event</p>
        </WrapperHeader>
      )}
      <div style={{ padding: "50px" }}>
        {!showContribution && (
          <>
            <Loading isLoading={isLoading}>
              <div>Events Available</div>
              <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={itemsEvent}
                renderItem={(item) => {
                  // Hàm định dạng lại giờ và phút thành chuỗi có hai chữ số
                  const formatTime = (time) => {
                    const formattedTime = time.toString().padStart(2, "0");
                    return formattedTime;
                  };

                  // Hàm định dạng lại ngày và giờ thành chuỗi theo định dạng mong muốn
                  const formatDateTime = (dateTime) => {
                    const date = new Date(dateTime);
                    const formattedDate = `${formatTime(
                      date.getHours()
                    )}:${formatTime(date.getMinutes())} - ${date.getDate()}/${
                      date.getMonth() + 1
                    }/${date.getFullYear()}`;
                    return formattedDate;
                  };

                  return (
                    <List.Item
                      actions={[
                        <a
                          key="list-loadmore-edit"
                          onClick={() => handleViewContribution(item.key)}
                        >
                          View all contribution
                        </a>,
                      ]}
                    >
                      <Skeleton
                        avatar
                        title={false}
                        loading={item.loading}
                        active
                      >
                        <List.Item.Meta
                          title={<a href="https://ant.design">{item?.label}</a>}
                          description={`Open Date: ${formatDateTime(
                            item?.openDate
                          )} \nFirst Close Date: ${formatDateTime(
                            item?.firstCloseDate
                          )} \nFinal Close Date: ${formatDateTime(
                            item?.finalCloseDate
                          )}`}
                        />
                        <div>
                          {
                            itemContributions.filter(
                              (contribution) =>
                                contribution.facultyId ===
                                  marketingaccount.faculty &&
                                contribution.eventId === item?.key
                            ).length
                          }
                          /{itemsStudent.length}
                        </div>
                      </Skeleton>
                    </List.Item>
                  );
                }}
              />
            </Loading>
          </>
        )}
        {showContribution && (
          <div>
            <a style={{cursor: 'pointer'}} onClick={() => setShowContribution(!showContribution)}><CaretLeftOutlined /> Back</a>
            <CoordinatorContribution
              eventId={eventId}
              facultyId={marketingaccount?.faculty}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorEvent;
