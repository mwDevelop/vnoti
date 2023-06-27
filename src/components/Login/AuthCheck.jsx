import React, { useContext } from "react";
import { Text, Image, TouchableOpacity, Alert, View } from "react-native";
import Wrap from "../../elements/wrap";
import styled from "styled-components";
import apis from "../../shared/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserStore } from "../../context";

import theme from "../../shared/theme";
import axios from "axios";

const AuthCheck = ({ navigation, route }) => {
  const { saveUserInfo, setIsLogin, setProfile } = useContext(UserStore);

  const userPhoneNum = route?.params?.userPhoneNum;
  const expoPushToken = route?.params?.deviceToken;

  const LoginUser = async (userPhoneNum, expoPushToken) => {
    const userData = {
      mb_cellphone: userPhoneNum,
      mb_device_token: expoPushToken,
    };
    await apis.postLogin(userData).then((response) => {
      if (response.data.result == "000") {
        const member = response?.data;
        const loginUserToken = member?.token;

        const profile_id = member?.user?.mb_profile_id;
        axios({
          method: "GET",
          url: `http://vnoti.co.kr/api/profile/${profile_id}`,
          headers: {
            Authorization: `${loginUserToken}`,
          },
        })
          .then((res) => {
            if (res.data.result == "000") {
              const data = res.data.data;
              const userInfo = {
                userToken: `${member?.token}`,
                userDeviveToken: `${expoPushToken}`,
                userId: `${member?.user?.mb_id}`,
                userProfileId: `${member?.user?.mb_profile_id}`,
                userName: `${member?.user.mb_name}`,
                userPhoneNum: `${userPhoneNum}`,
                userEmail: `${member?.user?.mb_email}`,
                userBirth: `${member?.user?.mb_birth}`,
                userGender: `${member?.user?.mb_gender}`,
                userProfile: `${data?.profile_image}`,
              };
              AsyncStorage.setItem("main_user", JSON.stringify(userInfo));
              AsyncStorage.setItem("userToken", loginUserToken);

              saveUserInfo(userInfo);
              setProfile(userInfo);
              setIsLogin(true);
              Alert.alert("로그인되었습니다.");
              navigation.reset({ routes: [{ name: "DrawerComponent" }] });
            }
          })
          .catch((err) => console.log(err));
      } else {
        navigation.navigate("SignUpScreen", {
          pushoken: `${expoPushToken}`,
          phoneNum: `${userPhoneNum}`,
        });
      }
    });
  };

  return (
    <Container>
      <CheckBox>
        <Title>인증이 완료되었습니다!</Title>
        <Img source={require("../../../assets/images/thumb_up.png")}></Img>
        <Btn
          activeOpacity={0.8}
          onPress={(e) => LoginUser(userPhoneNum, expoPushToken)}
          subColor={theme?.SubColor}
        >
          <BtnText>확인</BtnText>
        </Btn>
      </CheckBox>
    </Container>
  );
};

const Container = styled(View)`
  width: 100%;
  height: 100%;
  margin: auto;
`;

const CheckBox = styled(View)`
  width: 100%;

  display: flex;
  align-items: center;
  margin: auto;
`;

const Title = styled(Text)`
  font-size: 30px;
`;
const Img = styled(Image)`
  width: 180px;
  height: 180px;
  margin-top: 20px;
`;
const Btn = styled(TouchableOpacity)`
  width: 90%;
  height: 55px;
  border-radius: 10px;
  background-color: ${(props) => props.subColor};
  margin: 30px auto;
`;

const BtnText = styled(Text)`
  line-height: 45px;
  font-size: 25px;
  text-align: center;
  color: #fff;

  margin: auto;
`;

export default AuthCheck;
