import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled.div`
    width: 900px;
    border: solid 1px rgba(160, 160, 160, 0.3);
    justify-items: center;
    align-content: center;
    background-color: white
`;

export const WrapperHeaderCart = styled.div`
    background-color: white;
    width: 75%; 
    height: 100%;
    border-right: solid 1px rgba(160, 160, 160, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0px 50px;
`;

export const WrapperBigTextHeaderCartStyle = styled.h2`
    font-family: "Raleway", Helvetica, sans-serif;
    font-weight: bold;
`;

export const WrapperSmallTextHeaderCartStyle = styled.h5`
    font-family: "Raleway", Helvetica, sans-serif;
    font-size: 12px;
    
`;

export const WrapperLinkAuthor = styled.a`
    margin-right: 20px; 
    letter-spacing: 0.25em;
    text-transform: uppercase;
    font-size: 0.6em; 
    font-weight: 400;
    border-bottom: dotted 1px rgba(160, 160, 160, 0.65);
`;
export const WrapperDatePulisher = styled.div`
    display: block;
    font-family: "Raleway", Helvetica, sans-serif;
    font-size: 0.8em;
    font-weight: 800;
    letter-spacing: 0.25em;
    margin-top: 0.5em;
    text-transform: uppercase;
    `
export const WrapperCard = styled(Card)`
width: 100%;
border: none;

`
export const WrapperActionCard = styled.div`
    display: flex;
    padding: 0px 40px
`
