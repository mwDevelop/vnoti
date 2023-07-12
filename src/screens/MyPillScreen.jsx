import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Image, Alert } from "react-native";
import ProfilInfo from "../components/Main/ProfilInfo";
import styled from "styled-components";
import MyPillItem from "../components/MyPill/MyPillItem";
import * as Analytics from "expo-firebase-analytics";
import { StatusBar } from "expo-status-bar";
import theme from "../shared/theme";
import { UserStore } from "../context";
import { Platform } from "react-native";

const MyPillScreen = ({ navigation }) => {
  const { isLogin } = useContext(UserStore);
  const [countPill, setCountPill] = useState();
  useEffect(() => {
    Analytics.logEvent("screen_view", { firebase_screen: "약" });
  }, []);

  const onPressAddPill = () => {
    if (isLogin) {
      navigation.navigate("AddScreen", { value: false });
    } else {
      Alert.alert("로그인을 해주세요!");
      navigation.navigate("로그인");
    }
  };

  return (
    <Container>
      <StatusBar style={theme.MainColor} />
      <View
        style={{
          paddingTop: Platform.OS === "ios" ? 45 : 5,
        }}
      >
        <ProfilInfo navigation={navigation} isLogin={isLogin} />

        <Wrap>
          <MyPillItem navigation={navigation} setCountPill={setCountPill} />
          {countPill ? (
            ""
          ) : (
            <AddBtn
              onPress={() => onPressAddPill()}
              disabled={countPill}
              bottom={Platform.OS === "ios" ? 170 : 220}
            >
              <Img source={require("../../assets/images/plus_icon.png")} />
            </AddBtn>
          )}
        </Wrap>
      </View>
    </Container>
  );
};

const Wrap = styled(View)`
  background-color: #fff;
`;

const Container = styled(View)`
  background-color: #ffb74d;
  height: 100%;
`;

const AddBtn = styled(TouchableOpacity)`
  position: absolute;
  bottom: ${(props) => props.bottom}px;
  right: 10px;
`;

const Img = styled(Image)`
  width: 80px;
  height: 80px;
`;

export default MyPillScreen;
