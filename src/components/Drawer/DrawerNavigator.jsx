import React, { useEffect, useState, useContext } from "react";
import { TouchableOpacity, Image, View, Text, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styled from "styled-components";
import MemberList from "../Share/MemberList";
import apis from "../../shared/apis";
import DrawerUserInfo from "./DrawerUserInfo";

import { UserStore } from "../../context";
import theme from "../../shared/theme";

import axios from "axios";
import ProfilImg from "../../elements/ProfilImg";

const DravwerNavigtor = ({ navigation }) => {
  const {
    isLogin,
    user,
    setUser,
    setIsLogin,
    profile,
    setProfile,
    send,
    update,
  } = useContext(UserStore);

  const [subscriptions, setSubscriptions] = useState();
  const [subScribers, setSubScribers] = useState();

  useEffect(() => {
    if (isLogin) {
      apis.getDrawerList(user?.userProfileId).then(
        axios.spread((res1, res2) => {
          setSubScribers(res1?.data?.list);
          setSubscriptions(res2?.data?.list);
        })
      );
    } else {
      setSubscriptions("");
      setSubScribers("");
    }
  }, [isLogin, user, profile, send, update]);

  const logout = async () => {
    try {
      setIsLogin(false);
      setUser();
      setProfile();
      AsyncStorage.removeItem("main_user");
      AsyncStorage.removeItem("userToken");
      navigation.navigate("홈");
    } catch (error) {
      console.log(error);
    }
  };

  const name = profile?.userName;

  return (
    <>
      <Wrap>
        <View>
          <UserInfoWrap>
            <View>
              <DrawerUserInfo />
              <BtnWrap>
                {isLogin ? (
                  <>
                    <Btn
                      border={theme.MainColor}
                      onPress={() => {
                        navigation.navigate("공유");
                      }}
                    >
                      <BtnText btnfont={"18px"} color={theme.MainColor}>
                        내꺼볼래?
                      </BtnText>
                      <IconImg
                        resizeMode="contain"
                        source={require("../../../assets/images/envelope.png")}
                      />
                    </Btn>
                  </>
                ) : (
                  ""
                )}
              </BtnWrap>
            </View>

            {isLogin ? (
              <TopWrap>
                <ProfilImg
                  size={name?.length < 5 ? "80px" : "70px"}
                  url={profile?.userProfile}
                />
                <PageBtn
                  onPress={() => {
                    navigation.navigate("UseInfoComponent");
                  }}
                >
                  <UserImg
                    resizeMode={"contain"}
                    source={require("../../../assets/images/help.png")}
                    name={"26px"}
                  />
                </PageBtn>
              </TopWrap>
            ) : (
              <PageBtn
                onPress={() => {
                  navigation.navigate("UseInfoComponent");
                }}
              >
                <UserImg
                  resizeMode={"contain"}
                  source={require("../../../assets/images/help.png")}
                  name={"26px"}
                />
              </PageBtn>
            )}
          </UserInfoWrap>
        </View>
        <MemberList
          subscriptions={subscriptions}
          subScribers={subScribers}
          navigation={navigation}
        />
      </Wrap>
      <LoginBtn
        border={isLogin ? "#858585" : "#333"}
        onPress={() => {
          isLogin ? logout() : navigation.navigate("로그인");
        }}
        size={Platform.OS === "ios" ? "60px" : "50px"}
      >
        <BtnText btnfont={"18px"} color={"#858585"}>
          {isLogin ? "로그아웃" : "로그인"}
        </BtnText>
        <UserImg
          resizeMode={"contain"}
          source={require("../../../assets/images/login.png")}
          name={"21px"}
        />
      </LoginBtn>
    </>
  );
};

export default DravwerNavigtor;

const Wrap = styled(View)`
  margin-top: 30px;
  border-bottom: 1px;
`;

const UserImg = styled(Image)`
  width: ${(props) => props.name};
  height: ${(props) => props.name};
`;

const IconImg = styled(Image)`
  width: 20px;
  height: 20px;
`;

const UserInfoWrap = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 30px 0px 10px 15px;
`;

const BtnWrap = styled(View)`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
`;

const Btn = styled(TouchableOpacity)`
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
  font-size: ${(props) => props.btnfont};
`;

const LoginBtn = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: ${(props) => props.size};
  border-width: 1px;
  border-color: #efefef;
  padding-right: 5px;
  background-color: #fff;
  z-index: 0;
`;

const TopWrap = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const PageBtn = styled(TouchableOpacity)`
  margin-right: 20px;
`;
