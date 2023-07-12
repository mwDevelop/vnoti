import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import theme from "../../shared/theme";
import apis from "../../shared/apis";
import * as Linking from "expo-linking";

const RewardLists = ({
  cryptoJs,
  checked,
  attend,
  sumPoint,
  setUpdate,
  update,
  getModalData,
  today,
  isLogin,
}) => {
  const isRegPoint = checked?.checked;
  const [value, setValue] = useState(false);
  const onPressAttend = () => {
    if (isRegPoint) {
      getModalData(isRegPoint);
      setValue(true);
    } else {
      apis.getAttend().then((res) => {
        const data = res.data.data;
        if (res.data.result === "004") {
          getModalData(0, "open", value, "004");
        } else {
          getModalData(isRegPoint, data?.get_point);
          setUpdate(update + 1);
        }
      });
    }

    setTimeout(() => setValue(false), 3000);
  };

  useEffect(() => {}, [value]);

  const onPressUsePoint = () => {
    const result = cryptoJs();
    Linking.openURL(`https://alldeal.kr/Login/Vnoti?vcode=${result}`);
  };

  return (
    <Container>
      <InfoWrap>
        <Content>
          <Title color="#666">
            나의{" "}
            <Bold color="#333" size="16px">
              전체
            </Bold>{" "}
            포인트
          </Title>
          <Bold color="#444">
            {!sumPoint ? 0 : Number(sumPoint).toLocaleString()}
            <Bold color="#444" size="22px">
              P
            </Bold>
          </Bold>
        </Content>
        <Content>
          <Title color="#666">현재까지 출석</Title>
          <Bold color={theme.MainColor}>
            {!attend?.length ? 0 : attend?.length}
            <Bold color="#444" size="22px">
              회
            </Bold>
          </Bold>
        </Content>
      </InfoWrap>
      <TodayWrap>
        <Text color="#666">
          <Bold color="#333" size="16px">
            오늘
          </Bold>{" "}
          받은 포인트{" "}
          <Bold color={theme.MainColor} size="16px">
            {!today ? 0 : today}p
          </Bold>
        </Text>
      </TodayWrap>
      <BtnWrap>
        <Btn onPress={() => onPressAttend()} disabled={!isLogin}>
          <Title color={isRegPoint ? "#B8B8B8" : "#444444"}>
            {isRegPoint ? "출석체크완료" : "출석체크하기"}
          </Title>
        </Btn>
        <Btn onPress={() => onPressUsePoint()}>
          <Title>포인트사용하기</Title>
        </Btn>
      </BtnWrap>
    </Container>
  );
};

const Display = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled(View)`
  width: 100%;

  background-color: #fff;
  padding: 25px 15px;
`;

const InfoWrap = styled(Display)`
  width: 100%;
  height: 100px;
  border: 1px solid #f1f1f1;
  border-radius: 8px;

  flex-direction: row;
`;

const TodayWrap = styled(Display)`
  width: 100%;
  height: 46px;
  border: 1px solid #f1f1f1;
  border-radius: 8px;

  margin: 10px 0px;
`;

const Content = styled(Display)`
  flex-direction: column;
  width: 50%;
  height: 100%;
`;

const Title = styled(Text)`
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.color};
`;

const Bold = styled(Text)`
  font-size: ${(props) => (props.size ? props.size : "28px")};
  font-weight: bold;
  color: ${(props) => props.color};
`;

const Btn = styled(TouchableOpacity)`
  width: 48%;
  height: 50px;
  border: 1px solid;
  border-color: ${(props) => (props.color ? "#7D7D7D" : "#f1f1f1")};
  border-radius: 6px;
  background-color: ${(props) => (props.bg ? "#F9F9F9" : "#fff")};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0px;
`;

const BtnWrap = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
export default RewardLists;
