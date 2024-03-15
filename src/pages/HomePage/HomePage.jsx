import React from 'react'
import SmallCartComponent from '../../components/SmallCardComponent/SmallCardComponent'
import BigCardComponent from '../../components/BigCardComponent/BigCardComponent'
import {
  Wrapper,
  WrapperSlider,
  WrapperMiniPost,
  WrapperContent,
  WrapperImage
} from './style'
import logo from '../../assets/images/logo.jpg'
const HomePage = () => {
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
        <div style={{ paddingBottom: '40px' }}>
          <BigCardComponent />
        </div>
        <div style={{ paddingBottom: '40px' }}>
          <BigCardComponent />
        </div>
        <div style={{ paddingBottom: '40px' }}>
          <BigCardComponent />
        </div>
      </WrapperContent>
    </Wrapper>

  )
}

export default HomePage