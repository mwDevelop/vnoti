import React, { useEffect, useContext, useState } from "react";
import { Text, View, Image, TouchableOpacity, Alert } from "react-native";
import styled from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apis from "../../shared/apis";

import { UserStore } from "../../context";
import ShareBtn from "../../elements/ShareBtn";
import { AntDesign } from "@expo/vector-icons";

const AcceptShare = ({ navigation, route }) => {
  const { setUpdate, update } = useContext(UserStore);
  const [sendUser, setSendUser] = useState();
  const [profile, setProfile] = useState();
  const parmasId = route?.params;

  function fetchAndSetUser(subscribeId) {
    apis.getProfile(subscribeId).then((res) => {
      const name = res?.data?.data?.profile_name;
      const img = res?.data?.data?.profile_image;
      setSendUser(name);
      setProfile(img);
    });
  }
  useEffect(() => {
    AsyncStorage.getItem("main_user", (err, result) => {
      const user = JSON.parse(result);
      if (user == null) {
        Alert.alert("로그인 해주세요!");
        navigation.navigate("로그인");
      } else {
        const subscribe_id = parmasId?.id;
        apis.getReceiveSub(subscribe_id).then((res) => {
          if (res.data.result == "000") {
            const subscribeId = res?.data?.data?.subscribe_profile_id;
            fetchAndSetUser(subscribeId);
          } else if (res.data.result == "005") {
            Alert.alert("전화번호가 잘못되었습니다! 전화번호를 확인해주세요!");
            navigation.navigate("DrawerComponent");
          } else {
            navigation.navigate("DrawerComponent");
          }
        });
      }
    });
  }, []);

  const approval = (parmasId, e) => {
    const subscribe_id = parmasId?.id;
    const yn = e ? "y" : "n";
    const data = {
      subscribe_approval_yn: yn,
    };
    apis.postApproval(subscribe_id, data).then((res) => {
      if (res.data.result == "000") {
        if (e == false) {
          apis.deleteSubscriptions(subscribe_id).then((res) => {
            const result = res?.data?.result;
            if (result === "000") {
              Alert.alert("거절하였습니다.");
              navigation.navigate("메인");
            }
          });
        } else {
          setUpdate(update + 1);
          Alert.alert("수락하였습니다!");
          navigation.navigate("메인");
        }
      }
    });
  };

  const onPressMain = () => {
    setUpdate(update + 1);
    navigation.navigate("메인");
  };

  return (
    <Wrap>
      {profile && (
        <>
          <BackBtn onPress={onPressMain}>
            <AntDesign name="close" size={40} color="black" />
          </BackBtn>
          <Container>
            <InfoWrap>
              <Title>
                <Bold>{sendUser}</Bold>님으로부터
              </Title>
              <TitleWrap>
                <ShareBtn />
                <Title>받았어요.</Title>
              </TitleWrap>
            </InfoWrap>

            <UserWrap>
              {profile == "undefined" || profile == "null" || profile == "" ? (
                <Img
                  resizeMode="contain"
                  source={require("../../../assets/images/Profil/profil_10.png")}
                />
              ) : (
                <Img resizeMode="contain" source={{ uri: profile }} />
              )}

              <Bold>{sendUser}</Bold>
            </UserWrap>

            <BtnWrap>
              <Btn onPress={(e) => approval(parmasId, true)}>
                <BtnText>수락</BtnText>
              </Btn>
              <Btn onPress={(e) => approval(parmasId, false)}>
                <BtnText>거절</BtnText>
              </Btn>
            </BtnWrap>
          </Container>
        </>
      )}
    </Wrap>
  );
};

const Container = styled(View)`
  margin: auto;
`;

const Img = styled(Image)`
  width: 120px;
  height: 120px;
  border-radius: 100px;
  margin: auto;
`;

const BackBtn = styled(TouchableOpacity)`
  position: absolute;
  top: 80px;
  right: 20px;
`;

const Wrap = styled(View)`
  position: relative;
  background-color: #fff;
  height: 100%;
  padding: 120px 30px;
`;
const Title = styled(Text)`
  font-size: 25px;
  margin: auto;
`;

const TitleWrap = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px auto;
`;

const Bold = styled(Text)`
  font-weight: 600;
  font-size: 23px;
  margin: 20px auto;
`;

const InfoWrap = styled(View)`
  margin: 0px auto 70px auto;
`;

const UserWrap = styled(View)`
  margin: auto;
`;

const BtnWrap = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  margin: 40px auto;
`;
const Btn = styled(TouchableOpacity)`
  width: 48%;
  height: 45px;
  border: 1px solid #e7e7e7;
  border-radius: 10px;
`;

const BtnText = styled(Text)`
  color: #868686;
  font-size: 20px;
  margin: auto;
`;

export default AcceptShare;
