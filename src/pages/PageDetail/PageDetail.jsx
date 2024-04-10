import React, { useEffect, useState } from "react";
import {
  WrapperCardStyle,
  WrapperBigTextHeaderCartStyle,
  WrapperHeaderCart,
  WrapperLinkAuthor,
  WrapperDatePulisher,
  WrapperCard,
  WrapperSmallTextHeaderCartStyle
} from "./style";
import avatar from "../../assets/images/avatar.jpg";
import { HeartOutlined, CommentOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import * as ContributionService from "../../services/ContributionService";
import * as UserService from "../../services/UserService";
import * as FacultyService from "../../services/FacultyService";
import { format } from "date-fns";
import Loading from "../../components/LoadingComponent/LoadingComponent";
const PageDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  ///lấy detail bài báo cáo
  const { id } = useParams();
  const [detail, setDetail] = useState();
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await ContributionService.getDetailContribution(id);
        setDetail(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchDetail();
  }, []);
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
  /// lấy dữ riệu faculty
  const [itemsFaculty, setItemsFaculty] = useState([]);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const res = await FacultyService.getAllFaculty();
        // Chuyển đổi dữ liệu từ API thành định dạng mong muốn và cập nhật state
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
  }, []);
  const facultyLabel = (facultyId) => {
    const faculty = itemsFaculty.find((faculty) => faculty.key === facultyId);
    return faculty ? faculty.label : "";
  };
  ///format ngày tháng
  const formatDate = (dateString) => {
    // Chuyển đổi chuỗi ngày thành đối tượng Date
    const date = new Date(dateString);
    // Định dạng ngày
    const formattedDate = format(date, "MMMM dd, yyyy");
    return formattedDate;
  };
  console.log(detail?.imageFiles);
  return (
    <div style={{ padding: "48px", backgroundColor: "#e6e3e3" }}>
      <Loading isLoading={isLoading}>
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          Home / Faculty / {facultyLabel(detail?.facultyId)} / {detail?.title}{" "}
        </div>
        <WrapperCardStyle>
          <div
            style={{
              width: "100%",
              height: "180px",
              display: "flex",
              borderBottom: "solid 2px rgba(160, 160, 160, 0.3)",
            }}
          >
            <WrapperHeaderCart>
              <WrapperBigTextHeaderCartStyle>
                {detail?.title}
              </WrapperBigTextHeaderCartStyle>
            </WrapperHeaderCart>
            <div
              style={{
                width: "25%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                backgroundColor: "white",
              }}
            >
              <WrapperDatePulisher>
                {detail?.lastupdated_date &&
                  formatDate(detail?.lastupdated_date)}
              </WrapperDatePulisher>
              <div>
                <WrapperLinkAuthor href="#">
                  {studentLabel(detail?.studentId)}
                </WrapperLinkAuthor>
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "100%",
                  }}
                  src={studentAvatar(detail?.studentId) || avatar}
                  alt="avatar"
                ></img>
              </div>
            </div>
          </div>
          <WrapperCard>
            {detail?.imageFiles && detail?.imageFiles.length > 0 && (
              <div>
                <WrapperSmallTextHeaderCartStyle>Related Image</WrapperSmallTextHeaderCartStyle>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {detail.imageFiles.map((imageFile, index) => (
                    <img
                      key={index}
                      style={{
                        width: "90%",
                        height: "60%",
                      }}
                      alt={`Image ${index + 1}`}
                      src={imageFile}
                    />
                  ))}
                </div>
              </div>
            )}
            <div
              style={{ padding: "20px 100px", justifyContent: "space-between" }}
            >
              <div dangerouslySetInnerHTML={{ __html: detail?.content }}></div>
            </div>
          </WrapperCard>
        </WrapperCardStyle>
      </Loading>
    </div>
  );
};

export default PageDetail;
