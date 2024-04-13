import React, { useEffect, useState } from "react";
import * as FacultyService from "../../../services/FacultyService";
import * as EventService from "../../../services/EventService";
import * as ContributionService from "../../../services/ContributionService";
import * as UserService from "../../../services/UserService";
import { Bar, Pie } from "react-chartjs-2";
import { Chart } from 'chart.js/auto'; // Import Chart từ chart.js/auto

const ManagerDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [contributionData, setContributionData] = useState([]);
  const [events, setEvents] = useState([]);
  // Hàm useEffect để fetch danh sách sự kiện
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await EventService.getAllEventValid(); // Gọi API để lấy danh sách sự kiện hợp lệ
        setEvents(res.data); // Lưu danh sách sự kiện vào state
        // Nếu có sự kiện, chọn sự kiện đầu tiên làm mặc định
        if (res.data.length > 0) {
          setSelectedEvent(res.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching events:", error); // Xử lý lỗi nếu có
      }
    };
    fetchEvents();
  }, []);

  // Hàm useEffect để fetch dữ liệu đóng góp dựa trên sự kiện đã chọn
  useEffect(() => {
    const fetchContributionData = async () => {
      if (selectedEvent) {
        try {
          // Gọi API để lấy dữ liệu đóng góp dựa trên sự kiện đã chọn
          const res = await ContributionService.getAllContributions();
          setContributionData(res.data.filter(contribution => contribution.eventId == selectedEvent)); // Lưu dữ liệu đóng góp vào state
        } catch (error) {
          console.error('Error fetching contribution data:', error); // Xử lý lỗi nếu có
        }
      }
    };
    fetchContributionData();
  }, [selectedEvent]);
  console.log(contributionData)
  // Hàm tạo dữ liệu cho biểu đồ thanh số lượng đóng góp theo khoa
  const createBarChartData = (data) => {
    const facultyNames = data.map(item => item.facultyName);
    const contributionCounts = data.map(item => item.contributionCount);

    return {
      labels: facultyNames,
      datasets: [{
        label: 'Contribution Count',
        data: contributionCounts,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }],
    };
  };
  // Hàm tạo dữ liệu cho biểu đồ tỷ lệ phần trăm đóng góp của mỗi khoa
  const createPieChartData = (data) => {
    const facultyNames = data.map(item => item.facultyName);
    const contributionCounts = data.map(item => item.contributionCount);

    return {
      labels: facultyNames,
      datasets: [{
        label: 'Contribution Percentage',
        data: contributionCounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      }],
    };
  };
  // Hàm tạo dữ liệu cho biểu đồ số lượng người đóng góp (sinh viên) theo khoa
  const createStudentBarChartData = (data) => {
    const facultyNames = data.map(item => item.facultyName);
    const studentCounts = data.map(item => item.studentCount);

    return {
      labels: facultyNames,
      datasets: [{
        label: 'Student Count',
        data: studentCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }],
    };
  };

  // Hàm xử lý sự kiện thay đổi chọn sự kiện từ dropdown
  const handleChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  return (
    <div>
      <div>Dashboard</div>
      <div>
        {/* Dropdown để chọn sự kiện */}
        <select value={selectedEvent} onChange={handleChange}>
          {events.map(event => (
            <option key={event._id} value={event._id}>{event.name}</option>
          ))}
        </select>
      </div>
      {/* Render biểu đồ thanh nếu có dữ liệu đóng góp */}
      {contributionData && (
        <div>
          <div>
            <h2>Contribution Count per Faculty</h2>
            {/* Sử dụng component Bar từ react-chartjs-2 và truyền vào dữ liệu */}
            <Bar data={createBarChartData(contributionData)} />
          </div>
        </div>
      )}
      {contributionData && (
        <div>
          <div>
            <h2>Contribution Percentage per Faculty</h2>
            {/* Sử dụng component Pie từ react-chartjs-2 và truyền vào dữ liệu */}
            <Pie data={createPieChartData(contributionData)} />
          </div>
        </div>
      )}
      {/*Render biểu đồ số lượng người đóng góp (sinh viên) theo khoa nếu có dữ liệu đóng góp*/}
      {contributionData && (
        <div>
          <div>
            <h2>Student Count per Faculty</h2>
            {/* Sử dụng component Bar từ react-chartjs-2 và truyền vào dữ liệu */}
            <Bar data={createStudentBarChartData(contributionData)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;


// Xem thống kê trên bảng điều khiển như: số lượng đóng góp theo khoa, tỷ lệ phần trăm đóng góp của mỗi khoa, số lượng người đóng góp (sinh viên) theo khoa
