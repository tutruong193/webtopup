import React, { useEffect, useState } from 'react'
import SmallCartComponent from '../../components/SmallCardComponent/SmallCardComponent'
import BigCardComponent from '../../components/BigCardComponent/BigCardComponent'
import * as ContributionService from '../../services/ContributionService'

import {
  Wrapper,
  WrapperSlider,
  WrapperMiniPost,
  WrapperContent,
} from './style'
import logo from '../../assets/images/logo.jpg'
const HomePage = () => {

  ///lấy những bài đã accepted
  const [contributions, setContributions] = useState()
  useEffect(() => {
    const fetchContribution = async () => {
      try {
        const res = await ContributionService.getAllContributions();
        setContributions(res?.data?.filter(contribution => contribution?.status == 'Accepted'))
      } catch (error) {
        console.error('Error fetching faculty data:', error);
      }
    };

    fetchContribution();
  }, [])
  return (
    <Wrapper>
      <WrapperSlider>
        <div>
          <img src={logo} ></img>
          <h1
            style={{
              fontFamily: "'Raleway', 'Helvetica', sans-serif",
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: '900',
              padding: '20px 0',
              marginTop: '14px'
            }}>FUTURE IMPERFECT</h1>
          <div
            style={{
              fontFamily: "'Raleway', 'Helvetica', sans-serif",
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              paddingBottom: '50px',
              borderBottom: 'solid 1px rgba(160, 160, 160, 0.3)',
              marginBottom: '50px'
            }}>ANOTHER FINE RESPONSIVE SITE TEMPLATE BY HTML5 UP</div>
        </div>
        <WrapperMiniPost>
          <SmallCartComponent />
        </WrapperMiniPost>
        <WrapperMiniPost>
          <SmallCartComponent />
        </WrapperMiniPost>
        <WrapperMiniPost>
          <SmallCartComponent />
        </WrapperMiniPost>
      </WrapperSlider>
      <WrapperContent>
        {contributions && contributions.map((contribution) => (
          <div style={{ paddingBottom: '40px' }}>
            <BigCardComponent
              title={contribution.title}
              date={contribution.lastupdated_date}
              author={contribution.studentId}
              key={contribution._id}
              img={contribution?.imageFiles?.length > 0 && contribution.imageFiles[0]}
              id={contribution?._id}
            />
          </div>
        ))}
      </WrapperContent>
    </Wrapper>

  )
}

export default HomePage






