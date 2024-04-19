import React from "react";

const ManagerDashboard = () => {
  return (
    <div>
      <div>Dashboard</div>
      <div>
        <iframe style={{background: "#FFFFFF", border: "none", borderRadius: "2px", boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)"}} width="640" height="480" src="https://charts.mongodb.com/charts-project-0-wurxb/embed/charts?id=661be34a-4ab3-4249-8caf-977a7641415a&maxDataAge=3600&theme=light&autoRefresh=true"></iframe>
      
        <iframe style={{background: "#FFFFFF", border: "none", borderRadius: "2px", boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)"}} width="640" height="480" src="https://charts.mongodb.com/charts-project-0-wurxb/embed/charts?id=661f67d7-fe99-4db7-8005-6ba42e0416c6&maxDataAge=3600&theme=light&autoRefresh=true"></iframe>
      
        <iframe style={{background: "#FFFFFF", border: "none", borderRadius: "2px", boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)"}} width="640" height="480" src="https://charts.mongodb.com/charts-project-0-wurxb/embed/charts?id=661f686a-98a3-4de6-814e-21e07f570d4c&maxDataAge=3600&theme=light&autoRefresh=true"></iframe>
      </div>
    </div>
  );
};

export default ManagerDashboard;





// Xem thống kê trên bảng điều khiển như: số lượng đóng góp theo khoa, tỷ lệ phần trăm đóng góp của mỗi khoa, số lượng người đóng góp (sinh viên) theo khoa
