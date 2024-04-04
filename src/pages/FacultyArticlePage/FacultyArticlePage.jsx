import { Col, Menu, Pagination, Row } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import SmallCardComponent from "../../components/SmallCardComponent/SmallCardComponent";
import { Content } from "antd/es/layout/layout";
import * as ContributionService from "../../services/ContributionService";
import { getItem } from "../../utilis";
import * as FacultyService from "../../services/FacultyService";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const FacultyArticlePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("facul");
  /////
  const navigate = useNavigate();
  ///lấy bài và faculty
  const [itemsFaculty, setItemsFaculty] = useState([]);
  const [contributions, setContributions] = useState();
  useEffect(() => {
    const fetchContribution = async () => {
      try {
        const res = await ContributionService.getAllContributions();
        setContributions(
          res?.data?.filter(
            (contribution) => contribution?.status == "Accepted"
          )
        );
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };
    const fetchFacultyData = async () => {
      try {
        const res = await FacultyService.getAllFaculty();
        // Chuyển đổi dữ liệu từ API thành định dạng mong muốn và cập nhật state
        const formattedData = res.data.map((faculty) => ({
          label: faculty.name, // Gán name vào name
          key: faculty._id, // Gán id vào key
        }));
        setItemsFaculty(formattedData);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };
    fetchFacultyData();
    fetchContribution();
  }, []);
  const facultyLabel = (facultyId) => {
    const faculty = itemsFaculty.find((faculty) => faculty.key === facultyId);
    return faculty ? faculty.label : "";
  };
  ///menu
  const [keySelected, setKeySelected] = useState("");
  const facultyItems = itemsFaculty.map((faculty) => ({
    key: faculty.key,
    label: faculty.label,
  }));
  const items = [getItem("Faculty", "faculty", null, facultyItems, "group")];
  ////
  const onClick = (e) => {
    setKeySelected(e?.key);
  };
  useEffect(() => {
    if (keySelected) {
      const selectedFaculty = itemsFaculty.find(
        (faculty) => faculty.key === keySelected
      );
      if (selectedFaculty) {
        // Redirect to faculty page if a faculty is selected
        window.location.href = `/faculty/?facul=${selectedFaculty.key}`;
      }
    }
  }, [keySelected, itemsFaculty]);
  const [current, setCurrent] = useState(1);
  const onChange = (page) => {
    console.log(page);
    setCurrent(page);
  };
  const pageSize = 9;
  const totalCards = contributions && contributions.length;
  const startIndex = (current - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCards);
  let visibleContributions;

  if (contributions) {
    if (id) {
      visibleContributions = contributions
        .slice(startIndex, endIndex)
        .filter((contribution) => contribution.facultyId === id);
    } else {
      visibleContributions = contributions.slice(startIndex, endIndex);
    }
  } else {
    visibleContributions = [];
  }
  const handleSmallCardClick = (id) => {
    // Navigate to detail/:id page when a SmallCardComponent is clicked
    navigate(`/detail/${id}`);
  };
  return (
    <div
      style={{
        padding: "48px",
        backgroundColor: "#e6e3e3",
        minHeight: "90vh",
      }}
    >
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}
      >
        <Col className="gutter-row" span={6}>
          <Sider width="100%">
            <Menu onClick={onClick} mode="inline" items={items} />
          </Sider>
        </Col>
        <Col className="gutter-row" span={18}>
          <Content
            style={{
              minHeight: 280,
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "5px" }}>
              Home / Faculty {id && `/ ${facultyLabel(id)}`}
            </div>
            <Content
              style={{ minHeight: 280, display: "flex", flexWrap: "wrap" }}
            >
              {contributions &&
                visibleContributions.map((contribution) => (
                  <div
                    key={contribution._id}
                    style={{ width: "33.33%", padding: "5px" }}
                    onClick={() => handleSmallCardClick(contribution._id)}>
                    <SmallCardComponent contribution={contribution} />
                  </div>
                ))}
            </Content>
          </Content>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Pagination
              current={current}
              onChange={onChange}
              total={totalCards}
              pageSize={pageSize}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FacultyArticlePage;
