
import styled from "styled-components";

export const Wrapper = styled.div`
    width: 100%;
    padding: 5%;
    display: flex;
    background-color: #e6e3e3
`;
export const WrapperSlider = styled.div`
    width: 30%;
    padding-right: 60px;
`;
export const WrapperImage = styled.img`
background-image: url(data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100px' height='100px' viewBox='0 0 100 100' preserveAspectRatio='none' zoomAndPan='disable'%3E%3Cpolygon points='0,0 100,0 100,25 50,0 0,25' style='fill:%23f4f4f4' /%3E%3Cpolygon points='0,100 100,100 100,75 50,100 0,75' style='fill:%23f4f4f4' /%3E%3C/svg%3E);
background-position: top left;
background-repeat: no-repeat;
background-size: 100% 100%;
content: '';
display: block;
height: 100%;
left: 0;
position: absolute;
top: 0;
width: 100%;
`
export const WrapperMiniPost = styled.div`
    margin-bottom: 30px;
    width: 352px
`;

export const WrapperContent = styled.div`
    width: 70%;
    display: flex;
    align-items: center;
    flex-direction: column;
`;


