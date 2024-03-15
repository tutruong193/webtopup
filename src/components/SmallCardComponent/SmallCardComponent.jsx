
import React from 'react'
import { Card } from 'antd';
import { WrapperCardStyle } from './style';
import acb from '../../assets/images/pic01.jpg';
const { Meta } = Card;

const SmallComponent = () => {
  return (
    <div>
      <WrapperCardStyle
        hoverable
        style={{ borderRadius: 0 }}
        cover={<img alt="example" src={acb} />}
      >
        <div style={{ display: 'flex', padding: '20px 0px', justifyItems: 'space-between' }}>
          <div style={{ padding: '0px 20px', flex: 1, width: '70%' }}>
            <div>RUTRUM NEQUE ACCUMSAN</div>
            <div style={{color: 'rgba(160, 160, 160, 0.3)'}}>OCTOBER 19, 2015</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', width: '30%' }}>
            <img style={{
              width: '40px',
              height: '40px',
              borderRadius: '100%',
              marginLeft: 'auto',
              marginRight: 'auto', ight: 'auto', ight: 'auto', ight: 'auto',
            }} src={acb} />

          </div>
        </div>
      </WrapperCardStyle>
    </div>
  )
}

export default SmallComponent
