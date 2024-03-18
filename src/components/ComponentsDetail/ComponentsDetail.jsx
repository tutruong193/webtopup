import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import avatar from '../../assets/images/avatar.jpg'
const { Header, Content, Footer } = Layout;

const App = () => {
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
        <div
          style={{
            background: colorBgContainer,
            //minHeight: 80,
            padding: 300,
          }}
        >
          <div style={{ width: '944px', height: 'fit-content', border: 'solid 1px rgba(200, 200, 200, 0.3)' }}>
            <div style={{ width: '100%', height: '200px', display: 'flex', borderBottom: 'solid 1px rgba(200, 200, 200, 0.3)' }}>
              <div style={{ width: '100%', borderRight: 'solid 1px rgba(200, 200, 200, 0.3)' }}>
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
                  }} src={avatar} alt="" />
                </div>
              </div>
            </div>
            <div style={{ width: '100%', height: 'fit-content', border: 'solid 1px rgba(160, 160, ; 160, 0.3)' }}>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img style={{ width: '850px', height: '350px', padding: '20px 0px' }} src={avatar} alt="" />
                <div style={{ width: '850px', height: 'fit-content', padding: '20px 0px' }}>
                  Mauris neque quam, fermentum ut nisl vitae, convallis maximus nisl. Sed mattis nunc id lorem euismod placerat. Vivamus porttitor magna enim, ac accumsan tortor cursus at. Phasellus sed ultricies mi non congue ullam corper. Praesent tincidunt sed tellus ut rutrum. Sed vitae justo condimentum, porta lectus vitae, ultricies congue gravida diam non fringilla.
                </div>

              </div>
            </div>
          </div>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >

      </Footer>
    </Layout>
  );
};
export default App;