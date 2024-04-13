import React from "react";
import { Button, Result } from "antd";
import HomePage from "../HomePage/HomePage";
import { useNavigate } from "react-router-dom";
const ContactPage = () => {
  return (
    // <div style={resultStyle}>
    //   <Result
    //     status="404"
    //     title={<span style={titleStyle}>Welcome to our Contact page! We are happy that you are interested in school information and we will try to support you as best we can."
    //     If you have any questions, suggestions or requests, please email us at: 'fptcms.edu.vn' or in case of emergency, contact us immediately via hotline: '1800 9191' for direct support. We will try to reply to you as soon as possible</span>}
    //     extra={<Button type="primary" onClick={handleBackHome}>Back Home</Button>}
    //     style={contentStyle}
    //     icon={<img src="/path/to/image.png" alt="" style={imageStyle} />}
    //   />
    // </div>
    <div
      style={{ padding: "48px", backgroundColor: "#e6e3e3", height: "100vh" }}
    >
      <div
        style={{
          padding: "48px",
          backgroundColor: "white",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1> Welcome to our Contact page! </h1>
        <div>
          <span>
            We are happy that you are interested in school information and we
            will try to support you as best we can." If you have any questions,
            suggestions or requests, please email us for direct support. We will
            try to reply to you as soon as possible
          </span>
        </div>

        <span>Email: fptcms.edu.vn</span>
        <span>Hotline: 1800 9191</span>
      </div>
    </div>
  );
};
export default ContactPage;
