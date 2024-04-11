import React, { useEffect, useState } from "react";
import SmallCartComponent from "../../components/SmallCardComponent/SmallCardComponent";
import BigCardComponent from "../../components/BigCardComponent/BigCardComponent";
import * as ContributionService from "../../services/ContributionService";
import {
  Wrapper,
  WrapperSlider,
  WrapperMiniPost,
  WrapperContent,
} from "./style";
import logo from "../../assets/images/logo2.png";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/LoadingComponent/LoadingComponent";
const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  ///lấy những bài đã accepted
  const [contributions, setContributions] = useState([]);
  const [smallContributions, setSmallContributions] = useState([]);
  console.log('REACT_APP_API_URL', process.env.REACT_APP_API_URL);
  useEffect(() => {
    const fetchContribution = async () => {
      try {
        const res = await ContributionService.getAllContributions();
        setContributions(
          res?.data
            ?.filter((contribution) => contribution?.status == "Accepted")
            .sort((a, b) => new Date(b.confirm_date) - new Date(a.confirm_date))
            .slice(0, 3)
        );
        setSmallContributions(
          res?.data
            ?.filter((contribution) => contribution?.status == "Accepted")
            .sort((a, b) => new Date(b.confirm_date) - new Date(a.confirm_date))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };
    fetchContribution();
  }, []);
  /// ấn card bé
  const handleSmallCardClick = (id) => {
    // Navigate to detail/:id page when a SmallCardComponent is clicked
    navigate(`/detail/${id}`);
  };
  return (
    <Wrapper>
      <WrapperSlider>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            style={{ width: "15rem", backgroundColor: "transparent" }}
          ></img>
          <div
            style={{
              fontFamily: "'Raleway', 'Helvetica', sans-serif",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              paddingBottom: "50px",
              borderBottom: "solid 1px rgba(160, 160, 160, 0.3)",
              marginBottom: "50px",
            }}
          >
            THINK GLOBALLY, ACT LOCALLY
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Loading isLoading={isLoading}>
            {contributions &&
              contributions.map((contribution) => (
                <div
                  key={contribution._id}
                  style={{ width: "33.33%", padding: "5px" }}
                >
                  <WrapperMiniPost
                    onClick={() => handleSmallCardClick(contribution._id)}
                  >
                    <SmallCartComponent contribution={contribution} />
                  </WrapperMiniPost>
                </div>
              ))}
          </Loading>
        </div>
      </WrapperSlider>
      <WrapperContent>
        <Loading isLoading={isLoading}>
          {contributions &&
            contributions.map((contribution) => (
              <div style={{ marginBottom: "50px" }}>
                <BigCardComponent
                  contribution={contribution}
                  title={contribution.title}
                  date={contribution.lastupdated_date}
                  author={contribution.studentId}
                  key={contribution._id}
                  img={
                    contribution?.imageFiles?.length > 0 &&
                    contribution.imageFiles[0]
                  }
                  id={contribution?._id}
                />
              </div>
            ))}
        </Loading>
      </WrapperContent>
    </Wrapper>
  );
};

export default HomePage;
