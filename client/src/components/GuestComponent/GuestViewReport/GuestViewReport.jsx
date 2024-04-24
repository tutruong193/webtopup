import React, { useEffect, useState } from "react";
import { jwtTranslate } from "../../../utilis";
import { useCookies } from "react-cookie";
import * as ViewReportService from "../../../services/ViewReportService";
import * as EventService from "../../../services/EventService";
import * as ContributionService from "../../../services/ContributionService";
import * as FacultyService from "../../../services/FacultyService";
import * as UserService from "../../../services/UserService";
import { Empty, Select, Tabs } from "antd";
import Loading from "../../LoadingComponent/LoadingComponent";
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
  ///lấy thông tin events
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [itemsEvent, setItemsEvent] = useState([]);
  useEffect(() => {
    const fetchEventAndFacultyData = async () => {
      try {
        const res = await EventService.getAllEvent();
        const formattedData = res.data.map((event) => ({
          key: event._id,
          label: event.name,
          openDate: event.openDate,
          firstCloseDate: event.firstCloseDate,
          finalCloseDate: event.finalCloseDate,
        }));
        const resFaculty = await FacultyService.getAllFaculty();
        const formattedDataFaculty = resFaculty.data.map((faculty) => ({
          key: faculty._id, // Gán id vào key
          label: faculty.name, // Gán name vào name
        }));
        setItemsEvent(formattedData);
        setItemsFaculty(formattedDataFaculty);
      } catch (error) {
        console.error("Error fetching Event data:", error);
      }
    };
    fetchEventAndFacultyData();
  }, []);
  const facultyLabel = (facultyId) => {
    const faculty = itemsFaculty.find((faculty) => faculty.key === facultyId);
    return faculty ? faculty.label : "";
  };
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
  ///charts
  const [numberOfContributionsByFaculty, setNumberOfContributionsByFaculty] =
    useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (selectedEvent) {
      setIsLoadingData(true);
      console.log(reportSelected);
      const fetchData = async () => {
        try {
          // Lấy dữ liệu đóng góp
          const contributionRes =
            await ContributionService.getAllContributions();
          const studentRes = await UserService.getAllUser();

          // Lấy thông tin user
          const user = jwtTranslate(cookiesAccessToken.access_token);

          // Lấy số lượng học sinh theo từng khoa
          const totalStudentsByFaculty = itemsFaculty.map((faculty) => {
            const studentsForFaculty = studentRes?.data.filter(
              (student) =>
                student.faculty === faculty.key && student.role === "Student"
            );
            return {
              facultyId: faculty.key,
              totalStudents: studentsForFaculty.length,
            };
          });
          // Lọc ra thông tin đóng góp của khoa của user
          const userFacultyContribution = contributionRes?.data.filter(
            (contribution) =>
              contribution.facultyId === user?.faculty &&
              contribution.eventId === selectedEvent
          );
          // Thiết lập thông tin đóng góp của faculty của user
          const userFacultyContributionInfo = {
            facultyName:
              itemsFaculty.find((faculty) => faculty.key === user?.faculty)
                ?.label || "",
            totalStudentsByFaculty: totalStudentsByFaculty.find(
              (student) => student.facultyId === user?.faculty
            ).totalStudents,
            totalContributions: userFacultyContribution.length,
            acceptedContributions: userFacultyContribution.filter(
              (contribution) => contribution.status === "Accepted"
            ).length,
            pendingContributions: userFacultyContribution.filter(
              (contribution) => contribution.status === "Pending"
            ).length,
            rejectedContributions: userFacultyContribution.filter(
              (contribution) => contribution.status === "Rejected"
            ).length,
          };

          // Set state với thông tin đóng góp của faculty của user
          setNumberOfContributionsByFaculty(userFacultyContributionInfo);
          setIsLoadingData(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoadingData(false);
        }
      };
      fetchData();
    }
  }, [selectedEvent]);
  const options1 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Number of contributions per faculty`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Contributions",
        },
        suggestedMax: numberOfContributionsByFaculty.totalStudentsByFaculty + 1,
        ticks: {
          precision: 0,
        },
      },
      x: {
        title: {
          display: true,
          text: "Faculty",
        },
      },
    },
  };
  const data1 = {
    labels: [numberOfContributionsByFaculty.facultyName],
    datasets: [
      {
        label: "Total Students",
        data: [numberOfContributionsByFaculty.totalStudentsByFaculty],
        backgroundColor: "rgba(252, 223, 73, 0.5)",
        barPercentage: 0.5,
      },
      {
        label: "Total Contributions",
        data: [numberOfContributionsByFaculty.totalContributions],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        barPercentage: 0.5,
      },
      {
        label: "Accepted Contributions",
        data: [numberOfContributionsByFaculty.acceptedContributions],
        backgroundColor: "rgba(113, 252, 58, 0.5)",
        barPercentage: 0.5,
      },
      {
        label: "Pending Contributions",
        data: [numberOfContributionsByFaculty.pendingContributions],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        barPercentage: 0.5,
      },
      {
        label: "Rejected Contributions",
        data: [numberOfContributionsByFaculty.rejectedContributions],
        backgroundColor: "rgba(235, 44, 30, 0.5)",
        barPercentage: 0.5,
      },
    ],
  };
  console.log("numberOfContributionsByFaculty", numberOfContributionsByFaculty);
  const dataPercentage = {
    labels: ["Submitted contributions", "Unsubmmitted contributions"],
    datasets: [
      {
        label: "Percentage (%)",
        data: [
          numberOfContributionsByFaculty.totalContributions,
          numberOfContributionsByFaculty.totalStudentsByFaculty -
            numberOfContributionsByFaculty.totalContributions,
        ],
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const options3 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Number of contributions per faculty`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
        },
        suggestedMax: numberOfContributionsByFaculty.totalContributions + 1,
        ticks: {
          precision: 0,
        },
      },
      x: {
        title: {
          display: true,
          text: "Faculty",
        },
      },
    },
  };
  const data3 = {
    labels: [numberOfContributionsByFaculty.facultyName],
    datasets: [
      {
        label: "Total Contributions",
        data: [numberOfContributionsByFaculty.totalContributions],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        barPercentage: 0.2,
      },
    ],
  };
  const tabItems = reportSelected
    ? reportSelected.map((selected, index) => {
        let tabContent;
        switch (selected) {
          case "Number of contributions":
            tabContent = (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "70%" }}>
                  <Bar options={options1} data={data1} />
                </div>
              </div>
            );
            break;
          case "Percentage of contributions":
            tabContent = (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center", // Căn giữa theo chiều dọc
                  textAlign: "center",
                }}
              >
                <div style={{paddingBottom: '10px', fontWeight: '500', fontSize: '12px'}}>Percentage of submitted contributions</div>
                <div style={{ width: "50%" }}>
                  <Pie data={dataPercentage} />
                </div>
              </div>
            );
            break;
          case "Number of contributions (students)":
            tabContent = (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "70%" }}>
                  <Bar options={options3} data={data3} />
                </div>
              </div>
            );
            break;
          default:
            tabContent = null;
        }
        return {
          key: index.toString(), // Sử dụng index của mục như key
          label: selected, // Sử dụng tên của mục như nhãn
          children: tabContent,
        };
      })
    : null;
  console.log(tabItems);
  return (
    <div
      style={{
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          height: "fit-content",
        }}
      >
        <h2 style={{ textTransform: "uppercase", margin: "0" }}>
          View reports
        </h2>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "15px 0px",
          margin: "10px 0px",
          borderTop: "solid 1px rgba(160, 160, 160, 0.3)",
          borderBottom: "solid 1px rgba(160, 160, 160, 0.3)",
        }}
      >
        <div>Choose event: </div>
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
      </div>
      <Loading isLoading={isLoadingData}>
        {tabItems ? (
          <Tabs defaultActiveKey="0" type="card" items={tabItems} />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="There is no chart showwing to you"
          />
        )}
      </Loading>
    </div>
  );
};

export default GuestViewReport;
