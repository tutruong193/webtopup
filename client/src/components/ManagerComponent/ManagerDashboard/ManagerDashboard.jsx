import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import * as EventService from "../../../services/EventService";
import * as ContributionService from "../../../services/ContributionService";
import * as FacultyService from "../../../services/FacultyService";
import * as UserService from "../../../services/UserService";
import Loading from "../../LoadingComponent/LoadingComponent";
import { Select, Tabs } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const ManagerDashboard = () => {
  const [cookiesAccessToken, setCookieAccessToken] = useCookies("");
  const [itemsFaculty, setItemsFaculty] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [itemsEvent, setItemsEvent] = useState([]);
  const [numberOfContributionsByFaculty, setNumberOfContributionsByFaculty] =
    useState([]);
  const [percentage, setPercentage] = useState([]);
  const [numberOfContributionsByStudents, setNumberOfContributionsByStudents] =
    useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Lấy dữ liệu của các sự kiện
        const eventRes = await EventService.getAllEvent();
        const formattedEventData = eventRes.data.map((event) => ({
          key: event._id,
          label: event.name,
          openDate: event.openDate,
          firstCloseDate: event.firstCloseDate,
          finalCloseDate: event.finalCloseDate,
        }));
        const facultyRes = await FacultyService.getAllFaculty();
        const formattedFacultyData = facultyRes.data.map((faculty) => ({
          key: faculty._id,
          label: faculty.name,
        }));
        setItemsFaculty(formattedFacultyData);
        setItemsEvent(formattedEventData);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };
    fetchEvent();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      setIsLoadingData(true);
      const fetchData = async () => {
        try {
          // Lấy dữ liệu đóng góp
          const contributionRes =
            await ContributionService.getAllContributions();
          const studentRes = await UserService.getAllUser();
          // Lấy số lượng học sinh theo từng khoa
          const totalStudentsByFaculty = itemsFaculty.map((faculty) => {
            const studentsForFaculty = studentRes?.data.filter(
              (student) =>
                student.faculty === faculty.key && student.role === "Student"
            );
            return {
              facultyName: faculty.label,
              totalStudents: studentsForFaculty.length,
            };
          });

          // Tính số lượng đóng góp và phần trăm đóng góp của mỗi khoa
          const contributionsByFacultyAndStudent = itemsFaculty.map(
            (faculty) => {
              const contributionsForFaculty = contributionRes?.data.filter(
                (contribution) =>
                  contribution.facultyId === faculty.key &&
                  contribution.eventId === selectedEvent
              );
              const totalStudents =
                totalStudentsByFaculty.find(
                  (item) => item.facultyName === faculty.label
                )?.totalStudents || 0;
              const percentage =
                (contributionsForFaculty.length / totalStudents) * 100;
              return {
                facultyName: faculty.label,
                totalContributions: contributionsForFaculty.length,
                percentage: percentage.toFixed(2), // Làm tròn đến 2 chữ số sau dấu phẩy
              };
            }
          );
          const res = await ContributionService.getAllContributions();
          // Lọc danh sách đóng góp theo từng khoa
          const contributionsByFaculty = itemsFaculty.map((faculty) => {
            const contributionsForFaculty = res?.data.filter(
              (contribution) =>
                contribution.facultyId === faculty.key &&
                contribution.eventId === selectedEvent
            );
            return {
              facultyName: faculty.label,
              totalContributions: contributionsForFaculty.length,
              acceptedContributions: contributionsForFaculty.filter(
                (contribution) => contribution.status === "Accepted"
              ).length,
              pendingContributions: contributionsForFaculty.filter(
                (contribution) => contribution.status === "Pending"
              ).length,
              rejectedContributions: contributionsForFaculty.filter(
                (contribution) => contribution.status === "Rejected"
              ).length,
            };
          });
          setNumberOfContributionsByFaculty(contributionsByFaculty);
          setNumberOfContributionsByStudents(contributionsByFacultyAndStudent);
          setPercentage(contributionsByFacultyAndStudent);
          setIsLoadingData(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoadingData(false);
        }
      };
      fetchData();
    }
  }, [selectedEvent]);
  const handleChange = (value) => {
    setSelectedEvent(value);
  };

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
        suggestedMax:
          Math.max(
            ...numberOfContributionsByFaculty.map(
              (contribution) => contribution.totalContributions
            )
          ) + 1,
      },
      x: {
        title: {
          display: true,
          text: "Faculty",
        },
      },
    },
  };
  const labels1 = numberOfContributionsByFaculty.map(
    (faculty) => faculty.facultyName
  );
  const data1 = {
    labels: labels1,
    datasets: [
      {
        label: "Total Contributions",
        data: numberOfContributionsByFaculty.map(
          (faculty) => faculty.totalContributions
        ),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Accepted Contributions",
        data: numberOfContributionsByFaculty.map(
          (faculty) => faculty.acceptedContributions
        ),
        backgroundColor: "rgba(113, 252, 58, 0.5)",
      },
      {
        label: "Pending Contributions",
        data: numberOfContributionsByFaculty.map(
          (faculty) => faculty.pendingContributions
        ),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Rejected Contributions",
        data: numberOfContributionsByFaculty.map(
          (faculty) => faculty.rejectedContributions
        ),
        backgroundColor: "rgba(235, 44, 30, 0.5)",
      },
    ],
  };
  const options2 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Percentage of contributions by each Faculty",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Percentage",
        },
        suggestedMax: 100,
      },
      x: {
        title: {
          display: true,
          text: "Faculty",
        },
      },
    },
  };
  const labels2 = percentage.map((faculty) => faculty.facultyName);
  const data2 = {
    labels: labels2,
    datasets: [
      {
        fill: true,
        label: "Percentage of Contributions",
        data: percentage.map((faculty) => faculty.percentage),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
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
        suggestedMax:
          Math.max(
            ...numberOfContributionsByStudents.map(
              (contribution) => contribution.totalContributions
            )
          ) + 1,
      },
      x: {
        title: {
          display: true,
          text: "Faculty",
        },
      },
    },
  };
  console.log(numberOfContributionsByStudents);
  const labels3 = labels1;
  const data3 = {
    labels: labels3,
    datasets: [
      {
        label: "Total Students Submitted",
        data: numberOfContributionsByStudents.map(
          (faculty) => faculty.totalContributions
        ),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const items = [
    {
      key: "1",
      label: "Number of contributions per faculty",
      children: (
        <div style={{ width: "50%" }}>
          <div>
            <h2>Number of contributions per faculty</h2>
            <Bar options={options1} data={data1} />
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Percentage of contributions by each Faculty",
      children: (
        <div style={{ width: "50%" }}>
          <div>
            <h2>Percentage of contributions by each Faculty</h2>
            <Line options={options2} data={data2} />
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: "Number of contributions (students) per faculty",
      children: (
        <div style={{ width: "50%" }}>
          <div>
            <h2>Number of contributions per faculty</h2>
            <Bar options={options3} data={data3} />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div>Dashboard</div>
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
        <Loading isLoading={isLoadingData}>
          <Tabs defaultActiveKey="1" type="card" items={items} />
        </Loading>
      )}
    </div>
  );
};

export default ManagerDashboard;
