import React from 'react'
import { Button, Result } from 'antd';

const NotFoundPage = () => {
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

  return (
    <div style={resultStyle}>
      <Result
        status="404"
        title={<span style={titleStyle}>404</span>}
        subTitle={<span style={subTitleStyle}>Sorry, the page you visited does not exist.</span>}
        extra={<Button type="primary">Back Home</Button>}
        style={contentStyle}
        icon={<img src="/path/to/image.png" alt="404" style={imageStyle} />}
      />
    </div>
  );
}
export default NotFoundPage
