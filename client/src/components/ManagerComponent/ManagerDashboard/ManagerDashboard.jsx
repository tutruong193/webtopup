import React from "react";

const ManagerDashboard = () => {
  return (
    <div>
      <div>Dashboard</div>
      <div>
        <iframe
          style={{
            background: "#F1F5F4",
            border: "none",
            borderRadius: "2px",
            boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
            width: "100vw",
            height: "100vh"
          }}
          src="https://charts.mongodb.com/charts-project-0-wurxb/embed/dashboards?id=661a3c8d-32a0-4726-847e-ee8bdffbdd45&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=scale&scalingHeight=scale"
        ></iframe>
      </div>
    </div>
  );
};

export default ManagerDashboard;




// Xem thống kê trên bảng điều khiển như: số lượng đóng góp theo khoa, tỷ lệ phần trăm đóng góp của mỗi khoa, số lượng người đóng góp (sinh viên) theo khoa
