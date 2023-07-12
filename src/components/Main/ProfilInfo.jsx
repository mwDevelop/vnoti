import React, { useContext, useEffect } from "react";
import { Text, View, Platform, Image } from "react-native";
import styled from "styled-components";
import "react-native-gesture-handler";
import MainDrawer from "../Drawer/MainDrawer";
import { UserStore } from "../../context";
import ProfilImg from "../../elements/ProfilImg";
import { TouchableOpacity } from "react-native";

const ProfilInfo = ({ navigation, value }) => {
  const { user, profile, isLogin, update } = useContext(UserStore);

  const userName =
    user?.userProfileId === profile?.userProfileId || value === "reward"
      ? profile?.userName
      : user?.userName;

  const userImg =
    user?.userProfileId === profile?.userProfileId || value === "reward"
      ? profile?.userProfile
      : user?.userProfile;

  useEffect(() => {}, [user, profile, update]);

  const checkPlatform = Platform.OS === "ios";

  return (
    <Wrap
      wrapTop={checkPlatform ? "10px" : "40px"}
      Height={checkPlatform ? "75px" : "100px"}
    >
      <Container>
        <UserInfo>
          <MainDrawer navigation={navigation} />

          <>
            {isLogin === null ? (
              ""
            ) : isLogin === false ? (
              <Btn onPress={() => navigation.navigate("로그인")}>
                <Img
                  size={"55px"}
                  resizeMode="contain"
                  source={require("../../../assets/images/Profil/profil_10.png")}
                />
                <UserName> 로그인해주세요!</UserName>
              </Btn>
            ) : (
              <>
                <ProfilImg size="55px" url={userImg} />
                <UserName>{userName}님</UserName>
              </>
            )}
          </>
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
  height: 100%;
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
