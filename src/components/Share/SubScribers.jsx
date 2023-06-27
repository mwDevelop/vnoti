import React, { useEffect, useState, useContext } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styled from "styled-components";
import apis from "../../shared/apis";
import { UserStore } from "../../context";
import theme from "../../shared/theme";

const SubScribers = ({ navigation, data, color }) => {
  const { setUpdate, update } = useContext(UserStore);
  const [info, setInfo] = useState(false);

  const deleteSubScribers = () => {
    apis.deleteSubscribe(data.subscribe_id).then((res) => {
      setUpdate(update - 1);
      setInfo(false);
    });
  };

  return (
    <Wrap>
      <Container onPress={() => setInfo(!info)}>
        <UserImg bgcolor={color}></UserImg>
        <Name>{data?.subscribe_receiver_name}</Name>

        <Approval bgColor={" #ffffff"}>
          {data?.subscribe_approval_yn == "y" ? (
            <Approval bgColor={" #FFF6EC"}>
              <YnText color={theme.MainColor}>공유중</YnText>
            </Approval>
          ) : (
            <Approval bgColor={" #EDEDED"}>
              <YnText color={" #868686"}>대기중</YnText>
            </Approval>
          )}
        </Approval>
        <Icon
          source={require("../../../assets/images/dot.png")}
          resizeMode="contain"
        />
      </Container>
      {info ? (
        <UserContainer>
          <UserWrap>
            <TextWrap>
              <YnText color={" #000"}>전화번호</YnText>
              <Text>
                {data?.subscribe_receiver_phone.replace(
                  /(\d{3})(\d{4})(\d{4})/,
                  "$1-$2-$3"
                )}
              </Text>
            </TextWrap>

            <Btn onPress={deleteSubScribers}>
              <YnText color={" #E94343"}>삭제</YnText>
            </Btn>
          </UserWrap>
        </UserContainer>
      ) : (
        ""
      )}
    </Wrap>
  );
};

const UserContainer = styled(View)`
  width: 100%;
  display: flex;
  align-items: flex-end;
  /* margin-top: 10px; */
`;

const Wrap = styled(View)`
  width: 100%;
  display: flex;
  /* align-items: flex-end; */
  margin-top: 10px;
`;

const Container = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const UserImg = styled(View)`
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background-color: ${(props) => props.bgcolor};
  margin-right: 10px;
`;

const Name = styled(Text)`
  width: 48%;
  font-size: 17px;
`;

const Approval = styled(View)`
  background-color: ${(props) => props.bgColor};
  border-radius: 4px;
`;

const YnText = styled(Text)`
  padding: 5px;
  font-size: 16px;
  color: ${(props) => props.color};
  margin: auto;
`;

const Icon = styled(Image)`
  height: 25px;
  margin-left: 15px;
`;

const UserWrap = styled(View)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 130px;
  border-color: #f1f1f1;
  border-width: 1px;
  border-radius: 8px;
  margin: 10px 0 0 0;
`;

const Btn = styled(TouchableOpacity)`
  width: 100%;
  height: 35px;
  border-color: #f1f1f1;
  border-top-width: 1px;
  margin-top: 5px;
`;

const TextWrap = styled(View)`
  height: 50px;
`;
export default SubScribers;
