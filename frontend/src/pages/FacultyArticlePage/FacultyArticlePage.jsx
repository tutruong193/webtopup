import { Col, Menu, Pagination, Row, Select, Empty } from "antd";
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
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/LoadingComponent/LoadingComponent";

const FacultyArticlePage = () => {
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("facul");
  const navigate = useNavigate();
  const [itemsFaculty, setItemsFaculty] = useState([]);
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const fetchContribution = async () => {
      try {
        const res = await ContributionService.getAllContributions();
        setContributions(
          res?.data?.filter(
            (contribution) => contribution?.status === "Accepted"
          )
        );
      } catch (error) {
        console.error("Error fetching contributions:", error);
      }
    };

    const fetchFacultyData = async () => {
      try {
        const res = await FacultyService.getAllFaculty();
        const formattedData = res.data.map((faculty) => ({
          label: faculty.name,
          key: faculty._id,
        }));
        setItemsFaculty(formattedData);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      } finally {
        setIsLoadingMenu(false);
      }
    };

    fetchFacultyData();
    fetchContribution();
  }, []);

  const facultyLabel = (facultyId) => {
    const faculty = itemsFaculty.find((faculty) => faculty.key === facultyId);
    return faculty ? faculty.label : "";
  };

  const [keySelected, setKeySelected] = useState("");

  const items = [getItem("Faculty", "faculty", null, itemsFaculty, "group")];

  const onClick = (e) => {
    setKeySelected(e?.key);
  };

  useEffect(() => {
    if (keySelected) {
      const selectedFaculty = itemsFaculty.find(
        (faculty) => faculty.key === keySelected
      );
      if (selectedFaculty) {
        window.location.href = `/faculty/?facul=${selectedFaculty.key}`;
      }
    }
  }, [keySelected, itemsFaculty]);

  const [current, setCurrent] = useState(1);

  const onChange = (page) => {
    console.log("Current page:", page);
    setCurrent(page);
  };

  const pageSize = 9;
  const totalCards = contributions ? contributions.length : 0;
  const startIndex = (current - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCards);

  const [selectedSort, setSelectedSort] = useState("name-asc");

  const handleChangeSelect = (value) => {
    setSelectedSort(value);
  };

  const [visibleContributions, setVisibleContributions] = useState([]);

  const sortContributions = (contributions, selectedSort) => {
    switch (selectedSort) {
      case "name-asc":
        return [...contributions].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
      case "name-desc":
        return [...contributions].sort((a, b) =>
          b.title.localeCompare(a.title)
        );
      case "date-asc":
        return [...contributions].sort(
          (a, b) => new Date(a.confirm_date) - new Date(b.confirm_date)
        );
      case "date-desc":
        return [...contributions].sort(
          (a, b) => new Date(b.confirm_date) - new Date(a.confirm_date)
        );
      default:
        return contributions;
    }
  };

  useEffect(() => {
    setIsLoadingContent(true);
    let sortedContributions = contributions ? [...contributions] : [];
    if (selectedSort) {
      sortedContributions = sortContributions(
        sortedContributions,
        selectedSort
      );
    }
    if (id) {
      sortedContributions = sortedContributions.filter(
        (contribution) => contribution.facultyId === id
      );
    }
    setVisibleContributions(sortedContributions.slice(startIndex, endIndex));
    setIsLoadingContent(false);
  }, [contributions, selectedSort, id, startIndex, endIndex]);

  const handleSmallCardClick = (id) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div
      style={{ padding: "48px", backgroundColor: "#e6e3e3", minHeight: "90vh" }}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={6}>
          <Sider width="100%">
            <Loading isLoading={isLoadingMenu}>
              <Menu onClick={onClick} mode="inline" items={items} />
            </Loading>
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
            <div
              style={{
                paddingLeft: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>Home / Faculty {id && `/ ${facultyLabel(id)}`}</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ marginRight: "10px" }}>Sorted by</div>
                <Select
                  style={{ width: 120 }}
                  defaultValue="Name: A to Z"
                  onChange={handleChangeSelect}
                  options={[
                    { value: "name-asc", label: "Name: A to Z" },
                    { value: "name-desc", label: "Name: Z to A" },
                    { value: "date-asc", label: "Date: Oldest to Newest" },
                    { value: "date-desc", label: "Date: Newest to Oldest" },
                  ]}
                />
              </div>
            </div>
            <Loading isLoading={isLoadingContent}>
              {visibleContributions.length > 0 ? (
                <>
                  <Content
                    style={{
                      minHeight: 280,
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    {visibleContributions.map((contribution) => (
                      <div
                        key={contribution._id}
                        style={{ width: "33.33%", padding: "5px" }}
                        onClick={() => handleSmallCardClick(contribution._id)}
                      >
                        <SmallCardComponent contribution={contribution} />
                      </div>
                    ))}
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
                </>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Loading>
          </Content>
        </Col>
      </Row>
    </div>
  );
};

export default FacultyArticlePage;
