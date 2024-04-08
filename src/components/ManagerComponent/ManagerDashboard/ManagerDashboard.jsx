import React, { useEffect, useState } from "react";
import * as FacultyService from "../../../services/FacultyService";
import * as EventService from "../../../services/EventService";
import * as ContributionService from "../../../services/ContributionService";
import * as UserService from "../../../services/UserService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ManagerDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [contributionData, setContributionData] = useState(null);
  const [events, setEvents] = useState([]);

  // Function to fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await EventService.getAllEventValid();
        setEvents(res.data);
        // Set the default selected event to the latest event
        if (res.data.length > 0) {
          setSelectedEvent(res.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  // // Function to fetch contribution data based on selected event
  // useEffect(() => {
  //     const fetchContributionData = async () => {
  //         if (selectedEvent) {
  //             try {
  //                 // Fetch contribution data based on selected event
  //                 const res = await ContributionService.getAllContributions();
  //                 setContributionData(res.data.filter(contribution => contribution.eventId === selectedEvent));
  //             } catch (error) {
  //                 console.error('Error fetching contribution data:', error);
  //             }
  //         }
  //     };

  //     fetchContributionData();
  // }, [selectedEvent]);

  // // Function to create bar chart data for contribution per faculty
  // const createBarChartData = (data) => {
  //     const facultyNames = data.map(item => item.facultyName);
  //     const contributionCounts = data.map(item => item.contributionCount);

  //     return {
  //         labels: facultyNames,
  //         datasets: [{
  //             label: 'Contribution Count',
  //             data: contributionCounts,
  //             backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //             borderColor: 'rgba(255, 99, 132, 1)',
  //             borderWidth: 1,
  //         }],
  //     };
  // };

  // // Function to create pie chart data for contribution percentage per faculty
  // const createPieChartData = (data) => {
  //     const facultyNames = data.map(item => item.facultyName);
  //     const contributionCounts = data.map(item => item.contributionCount);

  //     return {
  //         labels: facultyNames,
  //         datasets: [{
  //             label: 'Contribution Percentage',
  //             data: contributionCounts,
  //             backgroundColor: [
  //                 'rgba(255, 99, 132, 0.2)',
  //                 'rgba(54, 162, 235, 0.2)',
  //                 'rgba(255, 206, 86, 0.2)',
  //                 'rgba(75, 192, 192, 0.2)',
  //                 'rgba(153, 102, 255, 0.2)',
  //             ],
  //             borderColor: [
  //                 'rgba(255, 99, 132, 1)',
  //                 'rgba(54, 162, 235, 1)',
  //                 'rgba(255, 206, 86, 1)',
  //                 'rgba(75, 192, 192, 1)',
  //                 'rgba(153, 102, 255, 1)',
  //             ],
  //             borderWidth: 1,
  //         }],
  //     };
  // };

  // // Function to create bar chart data for number of students per faculty
  // const createStudentBarChartData = (data) => {
  //     const facultyNames = data.map(item => item.facultyName);
  //     const studentCounts = data.map(item => item.studentCount);

  //     return {
  //         labels: facultyNames,
  //         datasets: [{
  //             label: 'Student Count',
  //             data: studentCounts,
  //             backgroundColor: 'rgba(75, 192, 192, 0.2)',
  //             borderColor: 'rgba(75, 192, 192, 1)',
  //             borderWidth: 1,
  //         }],
  //     };
  // };

  return (
    <div>
      <div>Dashboard</div>
      {/* <Select
        defaultValue="lucy"
        style={{
          width: 120,
        }}
        onChange={handleChange}
        options={[
          {
            value: "jack",
            label: "Jack",
          },
          {
            value: "lucy",
            label: "Lucy",
          },
          {
            value: "Yiminghe",
            label: "yiminghe",
          },
          {
            value: "disabled",
            label: "Disabled",
            disabled: true,
          },
        ]}
      /> */}
      {/* Render charts if contribution data is available
            {contributionData && (
                    <Bar data={createBarChartData(contributionData)} />
                    
                    <Pie data={createPieChartData(contributionData)} />
                    
                    <Bar data={createStudentBarChartData(contributionData)} />
                </div>
            )} */}
    </div>
  );
};

export default ManagerDashboard;

// Xem thống kê trên bảng điều khiển như: số lượng đóng góp theo khoa, tỷ lệ phần trăm đóng góp của mỗi khoa, số lượng người đóng góp (sinh viên) theo khoa
