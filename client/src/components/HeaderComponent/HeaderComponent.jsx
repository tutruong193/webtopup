import React, { useEffect, useMemo, useState } from "react";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, Input, Popover, Row } from "antd";
import { WrapperText, WrapperIcon } from "./style";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import * as FacultyService from "../../services/FacultyService";
import * as ContributionService from "../../services/ContributionService";
import * as UserService from "../../services/UserService";
const HeaderComponent = () => {
 const [isLoadingData, setIsLoadingData] = useState(false);
  ////lấy tên học sinh, faculty,contribution
  const [itemsStudent, setItemsStudent] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [itemsFaculty, setItemsFaculty] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facultyRes, studentRes, contributionRes] = await Promise.all([
          FacultyService.getAllFaculty(),
          UserService.getAllUser(),
          ContributionService.getAllContributions(),
        ]);
        // Process faculty data
        const formattedFacultyData = facultyRes.data.map((faculty) => ({
          key: faculty._id,
          label: <a href={`/faculty/?fac=${faculty._id}`}>{faculty.name}</a>,
        }));
        setItemsFaculty(formattedFacultyData);
        // Process student data
        const filteredStudents = studentRes.data.filter(
          (user) => user.role === "Student"
        );
        const formattedStudentData = filteredStudents.map((student) => ({
          key: student._id,
          label: student.name,
        }));
        setItemsStudent(formattedStudentData);
        // Process contribution data
        const acceptedContributions = contributionRes.data.filter(
          (contribution) => contribution.status === "Accepted"
        );
        setContributions(acceptedContributions);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
      setIsLoadingData(true);
      }
    };
    fetchData();
  }, []);

  const studentLabel = (studentId) => {
    const student = itemsStudent.find((student) => student.key === studentId);
    return student ? student.label : "";
  };

  
  //setup
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const handleSignIn = () => {
    navigate("/signin");
    removeCookie("access_token");
    window.location.reload();
  };
  const handleFaculty = () => {
    navigate("/faculty");
    window.location.reload();
  };
  const handleContact =() => {
    navigate("/contact");
  }
  ///search
  const [filteredContributions, setFilteredContributions] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [arrow, setArrow] = useState("Show");
  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }
    if (arrow === "Show") {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, [arrow]);
  const highlightTitle = (title, searchText) => {
    // Tách tiêu đề thành mảng các phần tử dựa trên từ khóa tìm kiếm
    const parts = title.split(new RegExp(`(${searchText})`, "gi"));

    // Map mỗi phần tử thành một phần tử <span>
    return parts.map((part, index) =>
      // Kiểm tra xem phần này có phải là từ khóa tìm kiếm không
      part.toLowerCase() === searchText.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };
  const handleSearchRead = ({ key }) => {
    navigate(`/detail/${key}`);
    window.location.reload();
  };
  const content = (
    <div>
      {inputSearch && <p>Search: {inputSearch}</p>}
      {inputSearch && (
        <div>
          {filteredContributions
            .slice(0, 3)
            .sort((a, b) => new Date(b.confirm_date) - new Date(a.confirm_date))
            .map((contribution) => (
              <Card
                title={highlightTitle(contribution.title, inputSearch)}
                bordered={false}
                style={{
                  borderBottom: "1px solid rgba(160, 160, 160, 0.3)",
                  marginBottom: "10px",
                }}
                hoverable
                onClick={() => handleSearchRead({ key: contribution._id })}
              >
                Written by: {studentLabel(contribution?.studentId)}
              </Card>
            ))}
        </div>
      )}
    </div>
  );

  const handleSearch = (e) => {
    setInputSearch(e.target.value);
    const searchText = e.target.value.toLowerCase();
    const filtered = contributions.filter((contribution) =>
      contribution.title.toLowerCase().includes(searchText)
    );
    setFilteredContributions(filtered);
  };
  return (
    <div>
      <Row
        style={{
          borderBottom: "1px solid rgba(160, 160, 160, 0.3)",
        }}
      >
        <Col
          span={4}
          style={{
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "solid 1px rgba(160, 160, 160, 0.3)",
            fontFamily: "'Raleway','Helvetica', 'sans-serif'",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            fontSize: "13px",
            textDecoration: "none",
            color: "black",
          }}
        >
          {" "}
          <a style={{ color: "black" }} href="/">
            FUTURE TIMES
          </a>
        </Col>
        <Col
          span={18}
          style={{
            backgroundColor: "white",
            display: "flex",
            fontSize: "20px",
            gap: "20px",
            paddingLeft: "30px",
            alignItems: "center",
          }}
        >
          <WrapperText>
            <Dropdown
              menu={{
                items: itemsFaculty,
              }}
            >
              <div onClick={(e) => e.preventDefault()}>
                <Space style={{ color: "black" }}>
                  <a onClick={handleFaculty} style={{ color: "black" }}>
                    Faculty
                  </a>
                </Space>
              </div>
            </Dropdown>
          </WrapperText>
          <WrapperText onClick={handleContact}>Contact</WrapperText>
      
        </Col>
        <Col
          span={2}
          style={{
            height: "56px",
            display: "flex",
            borderLeft: "solid 1px rgba(160, 160, 160, 0.3)",
            fontSize: "20px",
            color: "black",
          }}
        >
          <WrapperIcon>
            <Popover
              style={{ width: "600px" }}
              placement="bottomRight"
              arrow={mergedArrow}
              title={
                <Input
                  style={{ width: "600px" }}
                  placeholder="Search"
                  onChange={(e) => handleSearch(e)}
                ></Input>
              }
              content={content}
            >
              <SearchOutlined />
            </Popover>
          </WrapperIcon>
          <WrapperIcon>
            <UserOutlined onClick={handleSignIn} />
          </WrapperIcon>
        </Col>
      </Row>
    </div>
  );
};

export default HeaderComponent;
