import React, { useContext, useEffect } from "react";
import { Text, View, Platform, Image } from "react-native";
import styled from "styled-components";
import "react-native-gesture-handler";
import MainDrawer from "../Drawer/MainDrawer";
import { UserStore } from "../../context";
import ProfilImg from "../../elements/ProfilImg";
import MainUserProfile from "../../elements/MainUserProfile";
import { TouchableOpacity } from "react-native";

const ProfilInfo = ({ navigation, home }) => {
  const { user, profile, isLogin } = useContext(UserStore);

  const userName =
    user?.userProfileId == profile?.userProfileId
      ? profile?.userName
      : user?.userName;

  const userCheck =
    user?.userProfileId == profile?.userProfileId ? "main" : "member";

  useEffect(() => {}, [user, profile]);

  const checkPlatform = Platform.OS === "ios";

  return (
    <Wrap
      wrapTop={checkPlatform ? "10px" : "40px"}
      Height={checkPlatform ? "75px" : "100px"}
    >
      <Container>
        <UserInfo>
          <MainDrawer navigation={navigation} />
          {/* 로그인전 프로필아이콘 + 문구추가 */}
          {isLogin == false ? (
            <Btn onPress={() => navigation.navigate("로그인")}>
              <Img
                size={"55px"}
                resizeMode="contain"
                source={require("../../../assets/images/Profil/profil_10.png")}
              />
              <UserName> 로그인해주세요!</UserName>
            </Btn>
          ) : isLogin && userCheck == "main" ? (
            <>
              <MainUserProfile size="55px" />
              <UserName>{userName}님</UserName>
            </>
          ) : (
            <ProfilImg size="55px" />
          )}
        </UserInfo>
      </Container>
    </Wrap>
  );
};

const Wrap = styled(View)`
  background-color: #ffb74d;

  height: ${(props) => props.Height};
  padding-top: ${(props) => props.wrapTop};
  padding-left: 20px;
`;

const Container = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const UserName = styled(Text)`
  margin-left: 10px;
  font-size: 22px;
`;

const Btn = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Img = styled(Image)`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: 100px;
  margin-left: 10px;
`;

export default ProfilInfo;
