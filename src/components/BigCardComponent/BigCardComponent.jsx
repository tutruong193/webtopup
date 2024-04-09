import React, { useEffect, useState } from "react";
import {
  WrapperCardStyle,
  WrapperBigTextHeaderCartStyle,
  WrapperHeaderCart,
  WrapperSmallTextHeaderCartStyle,
  WrapperLinkAuthor,
  WrapperDatePulisher,
  WrapperCard,
  WrapperActionCard,
} from "./style";
import avatar from "../../assets/images/avatar.jpg";
import pic01 from "../../assets/images/pic01.jpg";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { HeartOutlined, CommentOutlined } from "@ant-design/icons";
import * as UserService from "../../services/UserService";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
const BigCardComponent = ({ contribution }) => {
  const navigate = useNavigate();
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
  const studentLabel = (studentId) => {
    const student = itemsStudent.find((student) => student.key === studentId);
    return student ? student.label : "";
  };
  const studentAvatar = (studentId) => {
    const student = itemsStudent.find((student) => student.key === studentId);
    return student ? student.avatar : "";
  };
  ///format ngày tháng
  const formatDate = (dateString) => {
    // Chuyển đổi chuỗi ngày thành đối tượng Date
    const date = new Date(dateString);
    // Định dạng ngày
    const formattedDate = format(date, "MMMM dd, yyyy");
    return formattedDate;
  };
  //ấn đọc
  const handleRead = (id) => {
    navigate(`/detail/${id}`);
  };
  ///lấy 1 ít văn bản ra
  const extractCharacters = (htmlString, maxLength) => {
    // Tạo một phần tử div ẩn để chứa HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
  
    // Lấy nội dung văn bản từ phần tử div
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
    // Kiểm tra nếu độ dài văn bản lớn hơn maxLength
    if (textContent.length > maxLength) {
      // Cắt chuỗi và thêm dấu "..."
      return textContent.slice(0, maxLength) + '...';
    }
  
    // Trả về toàn bộ nội dung nếu không cần cắt
    return textContent;
  };

  return (
    <WrapperCardStyle>
      <div
        style={{
          width: "100%",
          height: "20%",
          display: "flex",
          padding: "50px 0px",
          borderBottom: "solid 2px rgba(160, 160, 160, 0.3)",
        }}
      >
        <WrapperHeaderCart>
          <WrapperBigTextHeaderCartStyle>
            {contribution.title}
          </WrapperBigTextHeaderCartStyle>
        </WrapperHeaderCart>
        <div
          style={{
            width: "25%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "flex-end",
            paddingRight: "30px",
            backgroundColor: "white",
          }}
        >
          <WrapperDatePulisher>
            {formatDate(contribution.lastupdated_date)}
          </WrapperDatePulisher>
          <div>
            <WrapperLinkAuthor href="#">
              {studentLabel(contribution.studentId)}
            </WrapperLinkAuthor>
            <img
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "100%",
              }}
              src={studentAvatar(contribution.studentId) || avatar}
            ></img>
          </div>
        </div>
      </div>
      <WrapperCard>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "50px",
          }}
        >
          <img
            style={{
              maxWidth: "80%",
            }}
            alt="example"
            src={contribution.imageFiles[0] || pic01}
          />
        </div>
        <div
          style={{
            padding: "0px 40px",
            paddingBottom: "50px",
            justifyContent: "space-between",
          }}
        >
          {/* <div>{extractTextFromHtml(contribution.content, 30)}</div> */}
          <div
            dangerouslySetInnerHTML={{
              __html: extractCharacters(contribution.content, 350),
            }}
          ></div>
        </div>
        <WrapperActionCard>
          <div style={{ width: "50%" }}>
            <ButtonComponent
              onClick={() => handleRead(contribution._id)}
              textButton="Continue Reading"
              styleButton={{
                color: "black",
                fontSize: "15px",
                height: "56px",
                width: "220px",
                fontFamily: "'Raleway', 'Helvetica', sans-serif",
                fontWeight: "800",
                letterSpacing: "0.2em",
              }}
            ></ButtonComponent>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              width: "50%",
              alignItems: "center",
              opacity: "0.5",
            }}
          >
            <div style={{ paddingRight: "10px" }}>
              <HeartOutlined />{" "}
              <span style={{ marginLeft: "5px", opacity: 0.5 }}>20</span>
            </div>
            <div style={{ paddingRight: "10px" }}>
              <CommentOutlined />{" "}
              <span style={{ marginLeft: "5px", opacity: 0.5 }}>100</span>
            </div>
          </div>
        </WrapperActionCard>
      </WrapperCard>
    </WrapperCardStyle>
  );
};

export default BigCardComponent;
