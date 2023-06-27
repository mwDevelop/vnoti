import React from "react";
import { View, Text, Image } from "react-native";

import styled from "styled-components";
import theme from "../shared/theme";

const ShareBtn = () => {
  return (
    <Btn border={theme.MainColor}>
      <BtnText color={theme.MainColor}>내꺼볼래?</BtnText>
      <IconImg
        resizeMode="contain"
        source={require("../../assets/images/envelope.png")}
      />
    </Btn>
  );
};

export default ShareBtn;

const Btn = styled(View)`
  height: 35px;
  border: ${(props) => props.border};
  border-radius: 50px;
  margin-right: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 10px;
`;

const BtnText = styled(Text)`
  margin: auto 3px;
  color: ${(props) => props.color};
  font-size: 22px;
`;

const IconImg = styled(Image)`
  width: 20px;
  height: 20px;
`;
