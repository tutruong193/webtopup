import React from 'react'
import SmallComponent from '../../components/SmallCardComponent/SmallComponent'
import BigCardComponents from '../../components/BigCardComponents/BigCardComponents'
import { WrapperSmallCart } from './style'
import acb from '../../assets/images/pic01.jpg';
const HomePage = () => {
  return (
    <div style={{ padding: '60px', display: 'flex' }}>
      <div style={{ marginRight: '60px' }}>
        <div style={{ borderBottom: '1px solid', marginBottom: '30px' }}>
          <div style={{ marginBottom: '32px' }}> <img style={{
            borderRadius: '50%',
            width: '50px',
            height: '50px'
          }} src={acb} alt="" /></div>
          <div style={{ marginBottom: '32px' }}>FUTURE IMPERFECT</div>
          <div style={{ marginBottom: '32px' }}>ANOTHER FINE RESPONSIVE SITE TEMPLATE BY HTML5 UP</div>
        </div>
        <WrapperSmallCart>
          <SmallComponent />
        </WrapperSmallCart>
        <WrapperSmallCart>
          <SmallComponent />
        </WrapperSmallCart>
        <WrapperSmallCart>
          <SmallComponent />
        </WrapperSmallCart>
        <WrapperSmallCart>
          <SmallComponent />
        </WrapperSmallCart>
      </div>
      <div>
        <div style={{ marginBottom: '32px' }}>
          <BigCardComponents />
        </div>
        <div style={{ marginBottom: '32px' }}>
          <BigCardComponents />
        </div>
        <div style={{ marginBottom: '32px' }}>
          <BigCardComponents />
        </div>
        <div style={{ marginBottom: '32px' }}>
          <BigCardComponents />
        </div>
      </div>


    </div>
  )
}

export default HomePage
