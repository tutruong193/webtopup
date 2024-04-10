import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
  max-width: 352px;
  & img {
    max-width: 100%;
    max-height: 176px;
  }
  & .ant-card-body {
    padding: 0px;
  }
`;
