import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import styled from "styled-components";
import apis from "../../shared/apis";

import { UserStore } from "../../context";
import theme from "../../shared/theme";

const Subscriptions = ({ navigation, data }) => {
  const { setSend, send } = useContext(UserStore);
  const mainColor = theme.MainColor;
  const subscribe_id = data?.subscribe_id;

  const approval = (subscribe_id, e) => {
    const yn = e ? "y" : "n";
    const data = {
      subscribe_approval_yn: yn,
    };
    apis.postApproval(subscribe_id, data).then((res) => {
      if (res.data.result == "000") {
        if (e == false) {
          apis.deleteSubscriptions(subscribe_id).then((res) => {
            const result = res.data.result;
            {
              res.data.result === "000"
                ? Alert.alert("거절하였습니다.")
                : Alert.alert("잘못된 요청입니다", result);
            }
            setSend(!send);
            navigation.navigate("메인");
          });
        } else {
          setSend(!send);
          Alert.alert("수락하였습니다!");
          navigation.navigate("메인");
        }
      }

      if (res?.data?.includes("005") == true) {
        setSend(!send);
        Alert.alert("상대방이 신청을 취소하였습니다😢");
        navigation.navigate("메인");
      }
    });
  };

  return (
    <>
      <Wrap>
        {data?.profile_image == "undefined" || data?.profile_image == "null" ? (
          <UserImg
            resizeMode="contain"
            source={require("../../../assets/images/Profil/profil_10.png")}
          />
        ) : (
          <UserImg resizeMode="contain" source={{ uri: data?.profile_image }} />
        )}

        <Name>{data?.profile_name}</Name>

        {data?.subscribe_approval_yn == "y" ? (
          <Approval bgColor={" #FFF6EC"}>
            <YnText color={mainColor}>공유중</YnText>
          </Approval>
        ) : (
          <BtnWrap>
            <Btn
              onPress={(e) => approval(subscribe_id, true)}
              color={mainColor}
            >
              <BtnText color={mainColor}>수락</BtnText>
            </Btn>
            <Btn
              onPress={(e) => approval(subscribe_id, false)}
              color={"#868686"}
            >
              <BtnText color={"#868686"}>거절</BtnText>
            </Btn>
          </BtnWrap>
        )}
      </Wrap>
    </>
  );
};

const Wrap = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  margin-top: 10px;
`;

const UserImg = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 100px;

  margin-right: 10px;
`;

const Name = styled(Text)`
  width: 40%;
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
  margin: 0 auto;
`;

const BtnWrap = styled(View)`
  display: flex;
  flex-direction: row;
`;
const Btn = styled(TouchableOpacity)`
  width: 40px;
  height: 30px;
  border-width: 1px;
  border-color: ${(props) => props.color};
  border-radius: 4px;
  margin-right: 5px;
`;

const BtnText = styled(Text)`
  color: ${(props) => props.color};
  font-size: 15px;
  margin: auto;
`;

export default Subscriptions;
