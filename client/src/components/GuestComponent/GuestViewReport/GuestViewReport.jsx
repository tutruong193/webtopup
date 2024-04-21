import React, { useEffect, useState } from "react";
import { jwtTranslate } from "../../../utilis";
import { useCookies } from "react-cookie";
import * as ViewReportService from "../../../services/ViewReportService";
import * as EventService from "../../../services/EventService";
import * as ContributionService from "../../../services/ContributionService";
import * as FacultyService from "../../../services/FacultyService";
import * as UserService from "../../../services/UserService";
import { Select } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import faker from "faker";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const GuestViewReport = () => {
  const [cookiesAccessToken, setCookieAccessToken] = useCookies("");
  const user = jwtTranslate(cookiesAccessToken.access_token);
  const [reportSelected, setreportSelected] = useState([]);
  /// lấy dữ riệu faculty
  const [itemsFaculty, setItemsFaculty] = useState([]);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const res = await FacultyService.getAllFaculty();
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
    console.log("ac", itemsFaculty);
  }, []);
  const facultyLabel = (facultyId) => {
    const faculty = itemsFaculty.find((faculty) => faculty.key === facultyId);
    return faculty ? faculty.label : "";
  };

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
        setreportSelected(res?.data?.selected); // Cập nhật state với các khóa của các mục đã được chọn
      } catch (error) {
        console.error("Error fetching selected keys:", error);
      }
    };
    if (selectedEvent !== null) {
      fetchSelectedKeys();
    }
  }, [selectedEvent]);
  ///biểu đồ
  //t1
  const NumberOfContributions = () => {
    const [numberOfContributionsByEvent, setNumberOfContributionsByEvent] =
      useState([]);
    const [facultyNames, setFacultyNames] = useState([]);
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: `Number of contributions of ${facultyNames}`,
        },
      },
      scales: {
        y: {
          suggestedMax: numberOfContributionsByEvent.length + 1,
        },
      },
    };
    useEffect(() => {
      const fetchListContributions = async () => {
        const res = await ContributionService.getAllContributions();
        setNumberOfContributionsByEvent(
          res?.data?.filter(
            (contribution) =>
              contribution?.eventId === selectedEvent &&
              contribution?.facultyId === user?.faculty
          )
        );
        // Lấy danh sách faculty ids từ các đóng góp trong sự kiện được chọn
        const facultyIds = res?.data
          ?.filter((contribution) => contribution?.eventId === selectedEvent)
          .map((contribution) => contribution.facultyId);
        // Lấy tên của các faculty từ ids và lưu vào state
        const facultyNames = await Promise.all(
          facultyIds.map(async (facultyId) => {
            const facultyName = await facultyLabel(facultyId);
            return facultyName;
          })
        );
        setFacultyNames(facultyNames);
      };
      fetchListContributions();
    }, [selectedEvent]);
    // Tạo dữ liệu cho biểu đồ từ state numberOfContributionsByFaculty
    const labels = facultyNames;
    const data = {
      labels: labels,
      datasets: [
        {
          label: "Total Contributions",
          data: labels.map(() =>
            numberOfContributionsByEvent
              ? numberOfContributionsByEvent.length
              : 0
          ),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Accepted Contribution",
          data: labels.map(() =>
            numberOfContributionsByEvent
              ? numberOfContributionsByEvent.filter(
                  (contribution) => contribution.status == "Accepted"
                ).length
              : 0
          ),
          backgroundColor: "rgba(113, 252, 58, 0.5)",
        },
        {
          label: "Pending Contribution",
          data: labels.map(() =>
            numberOfContributionsByEvent
              ? numberOfContributionsByEvent.filter(
                  (contribution) => contribution.status == "Pending"
                ).length
              : 0
          ),
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Rejected Contribution",
          data: labels.map(() =>
            numberOfContributionsByEvent
              ? numberOfContributionsByEvent.filter(
                  (contribution) => contribution.status == "Rejected"
                ).length
              : 0
          ),
          backgroundColor: "rgba(235, 44, 30, 0.5)",
        },
      ],
    };

    return (
      <div>
        <h2>Number of contributions per faculty</h2>
        <Bar options={options} data={data} />
      </div>
    );
  };
  ///t2
  const PercentageOfContribution = () => {
    const [numberOfContributions, setNumberOfContributions] = useState([]);
    const [numberOfUser, setNumberOfUser] = useState([]);
    const [facultyNames, setFacultyNames] = useState([]);
    useEffect(() => {
      const fetchListContributions = async () => {
        const res = await ContributionService.getAllContributions();
        setNumberOfContributions(
          res?.data?.filter(
            (contribution) =>
              contribution?.eventId === selectedEvent &&
              contribution?.facultyId === user?.faculty
          )
        );
        // Lấy danh sách faculty ids từ các đóng góp trong sự kiện được chọn
        const facultyIds = res?.data
          ?.filter((contribution) => contribution?.eventId === selectedEvent)
          .map((contribution) => contribution.facultyId);
        // Lấy tên của các faculty từ ids và lưu vào state
        const facultyNames = await Promise.all(
          facultyIds.map(async (facultyId) => {
            const facultyName = await facultyLabel(facultyId);
            return facultyName;
          })
        );
        setFacultyNames(facultyNames);
      };
      const fetchUser = async () => {
        const res = await UserService.getAllUser();
        setNumberOfUser(
          res?.data?.filter(
            (student) =>
              student.role === "Student" && student.faculty == user?.faculty
          )
        );
      };
      fetchListContributions();
      fetchUser();
    }, [selectedEvent]);
    console.log(numberOfUser);
    const data = {
      labels: ["Submitted contributions", "Unsubmmitted contributions"],
      datasets: [
        {
          label: 'Percentage (%)',
          data: [
            numberOfContributions.length,
            numberOfUser.length - numberOfContributions.length,
          ],
          backgroundColor: [
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 99, 132, 0.2)",
          ],
          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    };
    return (
      <div>
        <h2>Percentage of contribution by each faculty</h2>
        <Pie data={data} />
      </div>
    );
  };

  return (
    <div>
      <h1>View Reports</h1>
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
      {reportSelected.map((selected, index) => (
        <div key={index}>
          {selected === "1" && (
            <div style={{ width: "50%" }}>
              <NumberOfContributions />
            </div>
          )}
          {selected === "2" && (
            <div style={{ width: "50%" }}>
              <PercentageOfContribution />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GuestViewReport;
