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
import logo from "../../assets/images/logo.jpg";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/LoadingComponent/LoadingComponent";
const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  ///lấy những bài đã accepted
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
        <div>
          <img src={logo}></img>
          <h1
            style={{
              fontFamily: "'Raleway', 'Helvetica', sans-serif",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: "900",
              padding: "20px 0",
              marginTop: "14px",
            }}
          >
            FUTURE TIMES
          </h1>
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
        <div style={{display: 'flex', justifyContent:'center'}}>
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
