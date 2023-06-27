import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styled from "styled-components";
import UseInfoHeader from "../elements/UseInfoHeader";

const UseInfoScreen = ({ navigation }) => {
  return (
    <Wrap>
      <UseInfoHeader title={"앱 이용 방법"} navigation={navigation} />
      <>
        <OptionList onPress={() => navigation.navigate("ApplyInfo")}>
          <Container>
            <Title>내꺼볼래 신청</Title>
          </Container>
        </OptionList>
        <OptionList onPress={() => navigation.navigate("RequestInfo")}>
          <Container>
            <Title>내꺼볼래 받기</Title>
          </Container>
        </OptionList>
        <OptionList onPress={() => navigation.navigate("LinkInfo")}>
          <Container>
            <Title>프로필 연결</Title>
          </Container>
        </OptionList>
        <OptionList onPress={() => navigation.navigate("EtcInfo")}>
          <Container>
            <Title>기타 기능 소개</Title>
          </Container>
        </OptionList>
      </>
    </Wrap>
  );
};

const Wrap = styled(View)`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
`;

const Container = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const OptionList = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 30px;

  border-bottom-width: 1px;
  border-color: #f6f6f6;
  height: 65px;
`;

const Title = styled(Text)`
  font-size: 17px;
`;

export default UseInfoScreen;
