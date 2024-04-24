import { Spin } from "antd";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
const Loading = ({ children, isLoading, deday = 200, color = 'blue' }) => {
  return (
    <Spin
      spinning={isLoading}
      delay={deday}
      size="large"
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 24,
            color: color
          }}
          spin
        />
      }
    >
      {children}
    </Spin>
  );
};

export default Loading;
