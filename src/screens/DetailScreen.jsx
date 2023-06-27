import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import styled from "styled-components";

const DetailScreen = ({ navigation }) => {
  return (
    <Wrap>
      <TopNav>
        <BackBtn onPress={() => navigation.navigate("MainScreen")}>
          <Icon
            source={require("../../assets/images/back_icon_w.png")}
            resizeMode="contain"
          />
        </BackBtn>
        <Title>복용약 추가</Title>
        <Icon />
      </TopNav>
    </Wrap>
  );
};

const Wrap = styled(View)`
  height: 100%;
  background-color: #ffffff;
`;

const TopNav = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ffab48;
  height: 100px;
  padding-top: 40px;
`;

const Title = styled(Text)`
  font-size: 25px;
  font-weight: 600;
  color: #fdfdfd;
`;

const Icon = styled(Image)`
  width: 35px;
  margin-left: 10px;
`;

const BackBtn = styled(TouchableOpacity)``;

export default DetailScreen;
