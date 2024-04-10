import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { WrapperCardStyle } from "./style";
import acb from "../../assets/images/avatar.jpg";
import logo from "../../assets/images/ngang1.png";
import * as UserService from "../../services/UserService";
import { format } from "date-fns";

const SmallCardComponent = ({ contribution }) => {
  ///format ngày tháng
  const formatDate = (dateString) => {
    // Chuyển đổi chuỗi ngày thành đối tượng Date
    const date = new Date(dateString);
    // Định dạng ngày
    const formattedDate = format(date, "MMMM dd, yyyy");
    return formattedDate;
  };
  ////lấy tên học sinh
  const [itemsStudent, setItemsStudent] = useState([]);
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await UserService.getAllUser();
        const filteredStudents = res.data.filter(
          (user) => user.role === "Student"
        );
        const formattedData = filteredStudents.map((student) => ({
          key: student._id,
          label: student.name,
          avatar: student.avatar,
        }));
        setItemsStudent(formattedData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, []);
  const studentAvatar = (studentId) => {
    const student = itemsStudent.find((student) => student.key === studentId);
    return student ? student.avatar : "";
  };
  return (
    <div>
      <WrapperCardStyle
        hoverable
        style={{ borderRadius: 0 }}
        cover={
          <img
            alt="example"
            style={{ borderRadius: "0px" }}
            src={contribution.imageFiles[0] || logo}
          />
        }
      >
        <div
          style={{
            display: "flex",
            padding: "20px 0px",
            justifyItems: "space-between",
          }}
        >
          <div
            style={{
              padding: "0px 20px",
              flex: 1,
              width: "70%",
              fontWeight: "500",
            }}
          >
            <div>{contribution ? contribution.title : "Lorem"}</div>
            <div style={{ color: "grey" }}>
              {formatDate(contribution.lastupdated_date) || "October 10, 2010"}
            </div>
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", width: "30%" }}
          >
            <img
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "100%",
                marginLeft: "auto",
                marginRight: "auto",
                ight: "auto",
                ight: "auto",
                ight: "auto",
              }}
              src={studentAvatar(contribution?.studentId) || acb}
            />
          </div>
        </div>
      </WrapperCardStyle>
    </div>
  );
};

export default SmallCardComponent;
