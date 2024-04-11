import React from 'react';
import { Button, Result } from 'antd';
import HomePage from '../HomePage/HomePage';
import { useNavigate } from 'react-router-dom'
const ContactPage = () => {
    const resultStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    };
  
    const contentStyle = {
      textAlign: 'center',
    };
  
    const titleStyle = {
      fontSize: '36px',
    };
  
    const subTitleStyle = {
      fontSize: '24px',
    };
  
    const imageStyle = {
      width: '200px',
      height: '200px',
    };
    const navigate = useNavigate();
    const handleBackHome = () => {
      navigate('/');
    }
    return (
      <div style={resultStyle}>
        <Result
          status="404"
          title={<span style={titleStyle}>Welcome to our Contact page! We are happy that you are interested in school information and we will try to support you as best we can."
          If you have any questions, suggestions or requests, please email us at: 'fptcms.edu.vn' or in case of emergency, contact us immediately via hotline: '1800 9191' for direct support. We will try to reply to you as soon as possible</span>}
          extra={<Button type="primary" onClick={handleBackHome}>Back Home</Button>}
          style={contentStyle}
          icon={<img src="/path/to/image.png" alt="" style={imageStyle} />}
        />
      </div>
    );
  }
export default ContactPage;