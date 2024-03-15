import React from 'react'
import { Col, Row } from 'antd';
import { Button, Flex } from 'antd';
import { WrapperCardStyle, WrapperHeaderCart } from './style'
import { HeartOutlined, WechatOutlined } from '@ant-design/icons'
import acb from '../../assets/images/pic01.jpg';
const BigCardComponents = () => {
  return (
    <div style={{ width: '944px', height: 'fit-content', border: 'solid 1px rgba(160, 160, 160, 0.3)' }}>
      <div style={{ width: '100%', height: '200px', display: 'flex', borderBottom: 'solid 1px rgba(160, 160, 160, 0.3)' }}>
        <div style={{ width: '70%', borderRight: 'solid 1px rgba(160, 160, 160, 0.3)' }}>
          <div style={{ padding: '30px' }}>
            <div style={{ color: 'inherit', fontSize: '30px', padding: '48px' }}>MAGNA SED ADIPISCING</div>
            <div style={{ width: '102%', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: ' -20px' }}>LOREM IPSUM DOLOR AMET NULLAM CONSEQUAT ETIAM FEUGIAT</div>
          </div>
        </div>
        <div style={{ width: '30%', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '10px' }}>NOVEMBER 1, 2015</div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ padding: '0px 10px' }}>Nguyen Van An</div>
            <img style={{
              borderRadius: '100%',
              width: '3em',
              height: '3em'
            }} src={acb} alt="" />
          </div>
        </div>
      </div>
      <div style={{ width: '100%', height: 'fit-content', border: 'solid 1px rgba(160, 160, ; 160, 0.3)' }}>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img style={{ width: '850px', height: '350px', padding: '20px 0px' }} src={acb} alt="" />
          <div style={{ width: '850px', height: 'fit-content', padding: '20px 0px' }}>
            Mauris neque quam, fermentum ut nisl vitae, convallis maximus nisl. Sed mattis nunc id lorem euismod placerat. Vivamus porttitor magna enim, ac accumsan tortor cursus at. Phasellus sed ultricies mi non congue ullam corper. Praesent tincidunt sed tellus ut rutrum. Sed vitae justo condimentum, porta lectus vitae, ultricies congue gravida diam non fringilla.
          </div>
          <div style={{ width: '850px', display: 'flex', flexDirection: 'row', paddingTop: '20px' }}>
            <Button type="dashed">Dashed Button</Button>
            <div style={{ width: '850px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', height: 'fit-content' }}>
              <div style={{ padding: '0px 20px' }}> <HeartOutlined /> 68</div>
              <div style={{ padding: '0px 20px', borderLeft: 'solid 1px' }}> <WechatOutlined /> 69</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default BigCardComponents
