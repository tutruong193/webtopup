// import { Menu } from 'antd'
// import Sider from 'antd/es/layout/Sider'
// import React from 'react'
// import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons'
// import SmallCardComponent from '../../components/SmallCardComponent/SmallCardComponent';
// const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
//     const key = String(index + 1);
//     return {
//         key: `sub${key}`,
//         icon: React.createElement(icon),
//         label: `subnav ${key}`,
//         children: new Array(3).fill(null).map((_, j) => {
//             const subKey = index * 3 + j + 1;
//             return {
//                 key: subKey,
//                 label: `option${subKey}`,
//             };
//         }),
//     };
// });
// const FacultyArticlePage = () => {
//     return (
//         <div style={{ padding: '48px', backgroundColor: '#e6e3e3' }}>
//             <div>Faculty/article</div>
//             <div style={{ display: 'flex' }}>
//                 <div>
//                     <Sider style={{ background: "white" }} width={200}>
//                         <Menu
//                             mode="inline"
//                             defaultSelectedKeys={['1']}
//                             defaultOpenKeys={['sub1']}
//                             style={{ height: '100%' }}
//                             items={items2}
//                         />
//                     </Sider>
//                 </div>
//                 <div style={{ width: '20px', backgroundColor: '#e6e3e3' }}></div>
//                 <div >
//                     <div >
//                         <div>
//                             <div>Img</div>
//                             <div style={{ display: 'flex', }}>
//                                 <div style={{ margin: '5px' }}><SmallCardComponent /></div>
//                                 <div style={{ margin: '5px' }}><SmallCardComponent /></div>
//                                 <div style={{ margin: '5px' }}><SmallCardComponent /></div>
//                                 <div style={{ margin: '5px' }}><SmallCardComponent /></div>
//                             </div>
//                         </div>
//                         <div>
//                             <div>Article</div>
//                             <div style={{ display: 'flex' }}>
//                                 <div style={{ margin: '5px' }}><SmallCardComponent /></div>
//                                 <div style={{ margin: '5px' }}><SmallCardComponent /></div>
//                                 <div style={{ margin: '5px' }}><SmallCardComponent /></div>
//                                 <div style={{ margin: '5px' }}><SmallCardComponent /></div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default FacultyArticlePage
import React from 'react'
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const items1 = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: ` ${key}`,
    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});
const FacultyArticlePage = () => {
  
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
      return (
        <Layout>
        
          <Content
            style={{
              padding: '0 48px',
            }}
          >
            <Layout
              style={{
                padding: '24px 0',
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Sider
                style={{
                  background: colorBgContainer,
                }}
                width={200}
              >
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{
                    height: '100%',
                  }}
                  items={items2}
                />
              </Sider>
              <Content
                style={{
                  padding: '0 24px',
                  minHeight: 280,
                }}
              >
                Content
              </Content>
            </Layout>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
  )
}

export default FacultyArticlePage
