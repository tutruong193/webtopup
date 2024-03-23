import { Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React from 'react'
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons'
import SmallCardComponent from '../../components/SmallCardComponent/SmallCardComponent';
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,
    children: new Array(3).fill(null).map((_, j) => {
      const subKey = index * 3 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});
const FacultyArticlePage = () => {
  return (
    <div style={{ padding: '48px', backgroundColor: '#e6e3e3' }}>
      <div style={{ display: 'flex' }}>
        <div>
          <Sider style={{ background: "white" }} width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
              items={items2}
            />
          </Sider>
        </div>
        <div style={{ width: '20px', backgroundColor: '#e6e3e3' }}></div>
        <div >
          <div >
            <div>
              <div>It</div>
              <div style={{ display: 'flex', }}>
                <div style={{ margin: '5px' }}><SmallCardComponent /></div>
                <div style={{ margin: '5px' }}><SmallCardComponent /></div>
                <div style={{ margin: '5px' }}><SmallCardComponent /></div>
                <div style={{ margin: '5px' }}><SmallCardComponent /></div>
              </div>
            </div>
            <div>
              <div>Desgin</div>
              <div style={{ display: 'flex' }}>
                <div style={{ margin: '5px' }}><SmallCardComponent /></div>
                <div style={{ margin: '5px' }}><SmallCardComponent /></div>
                <div style={{ margin: '5px' }}><SmallCardComponent /></div>
                <div style={{ margin: '5px' }}><SmallCardComponent /></div>
              </div>
              <div>Business</div>
              <div style={{ display: 'flex' }}>
                <div style={{ margin: '5px' }}><SmallCardComponent /></div>
                <div style={{ margin: '5px' }}><SmallCardComponent /></div>
                <div style={{ margin: '5px' }}><SmallCardComponent /></div>
                <div style={{ margin: '5px' }}><SmallCardComponent /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacultyArticlePage
