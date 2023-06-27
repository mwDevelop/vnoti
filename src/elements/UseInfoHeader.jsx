import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import styled from "styled-components";

const UseInfoHeader = ({ title, navigation }) => {
  return (
    <Wrap>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 32, bottom: 32, left: 32, right: 32 }}
      >
        <Img
          resizeMode="contain"
          source={require("../../assets/images/back_icon_b.png")}
        />
      </TouchableOpacity>

      <Title>{title}</Title>
    </Wrap>
  );
};

const Wrap = styled(View)`
  width: 100%;
  height: 100px;
  background-color: #fff;
  padding: 50px 0px 0px 15px;

  display: flex;
  flex-direction: row;
  align-items: center;

  border-bottom-width: 1px;
  border-color: #f6f6f6;
`;

const Title = styled(Text)`
  font-size: 21px;
  font-weight: 600;
  margin: auto;
  padding-right: 35px;
`;
const Img = styled(Image)`
  width: 20px;
  height: 20px;
`;

export default UseInfoHeader;
