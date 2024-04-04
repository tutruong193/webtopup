import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
  max-width: 352px;
  & img {
    width: 100%;
    height: 176px;
  }
  & .ant-card-body {
    padding: 0px;
  }
`;
