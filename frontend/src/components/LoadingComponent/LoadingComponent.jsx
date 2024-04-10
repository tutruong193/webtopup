import { Spin } from "antd";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
const Loading = ({ children, isLoading, deday = 200 }) => {
  return (
    <Spin
      spinning={isLoading}
      delay={deday}
      size="large"
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 24,
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
