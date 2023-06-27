import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
  TouchableWithoutFeedback,
  AppState,
  Modal,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import EditProfil from "../components/Profil/EditProfil";
import styled from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { UserStore } from "../context";

import apis from "../shared/apis";
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";
import Constants from "expo-constants";
import { registerForPushNotificationsAsync } from "../components/DeviceToken";
import { Alert } from "react-native";

import * as Analytics from "expo-firebase-analytics";

const MyPageScreen = ({ navigation }) => {
  const { profile, setIsLogin, setUser, setProfile } = useContext(UserStore);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [openModal, setOpenModal] = useState();

  const clickModal = (e) => {
    setOpenModal(e);
    setShowAppOptions(!showAppOptions);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        registerForPushNotificationsAsync().then((res) => {
          if (res !== undefined) {
            const chageInfo = {
              mb_device_token: res,
            };
            const mb_id = profile?.userId;
            apis.editUserInfo(mb_id, chageInfo).then((res) => {
              const result = res.data.result;
              if (result == "000") {
              } else if (result == "001") {
              }
            });
          } else {
          }
        });
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });
    return () => {
      subscription.remove();
    };
  }, [appStateVisible, profile]);

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

  const settingAlarm = async () => {
    if (Platform.OS === "ios") {
      Linking.openSettings().then((res) => res);
    } else {
      const pkg = Constants.manifest.releaseChannel
        ? Constants.manifest.android.package
        : "host.exp.exponent";
      await startActivityAsync(ActivityAction.APP_NOTIFICATION_SETTINGS, {
        extra: { "android.provider.extra.APP_PACKAGE": pkg },
      }).then((data) => {
        registerForPushNotificationsAsync().then((res) => {
          if (res !== undefined) {
            const chageInfo = {
              mb_device_token: res,
            };
            const mb_id = profile?.userId;
            apis.editUserInfo(mb_id, chageInfo).then((res) => {});
          }
        });
      });
    }
  };

  const deleteMember = () => {
    Alert.alert(
      "회원 탈퇴",
      "회원 탈퇴 하시겠습니까?",
      [
        {
          text: "회원탈퇴",
          onPress: () => {
            deleteUser();
          },
        },
        {
          text: "취소",
          onPress: () => {},
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const deleteUser = () => {
    const mb_id = profile.userId;
    apis.deleteMember(mb_id).then((res) => {
      if (res.data.result === "000") {
        AsyncStorage.removeItem("main_user");
        AsyncStorage.removeItem("userToken");
        setIsLogin(false);
        setUser();
        setProfile();
        Alert.alert("회원탈퇴가 완료되었습니다.");
        navigation.navigate("홈");
      }
    });
  };

  useEffect(() => {
    Analytics.logEvent("screen_view", { firebase_screen: "내정보" });
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "#f5f5f5" }}>
      <Wrap>
        <EditProfil />
        <OptionWrap style={{ zIndex: -100 }}>
          <Btn onPress={settingAlarm}>
            <OptionList>
              <Container>
                <Img
                  source={require("../../assets/images/option_02.png")}
                  style={{ resizeMode: "contain" }}
                />
                <Title>알림설정</Title>
              </Container>
            </OptionList>
          </Btn>
          <OptionList>
            <TouchableOpacity
              onPress={() => navigation.navigate("UseInfoComponent")}
            >
              <Container>
                <Img
                  source={require("../../assets/images/option_01.png")}
                  style={{ resizeMode: "contain" }}
                />
                <Title>앱 이용안내</Title>
              </Container>
            </TouchableOpacity>
          </OptionList>

          <OptionList>
            <TouchableOpacity onPress={logout}>
              <Container>
                <Img
                  source={require("../../assets/images/option_03.png")}
                  style={{ resizeMode: "contain" }}
                />
                <Title>로그아웃</Title>
              </Container>
            </TouchableOpacity>
          </OptionList>
        </OptionWrap>
        <Container>
          <TouchableOpacity onPress={(e) => clickModal("conditions")}>
            <Info>이용약관 </Info>
          </TouchableOpacity>
          <Modal
            visible={openModal == "conditions" ? showAppOptions : ""}
            animationType="slide"
            onRequestClose={() => setShowAppOptions(false)}
          >
            <ModalWrap
              topWrap={
                Platform.OS === "ios"
                  ? "130px 0px 40px 0px"
                  : "70px 0px 40px 0px"
              }
            >
              <BackBtn
                onPress={() => setShowAppOptions(false)}
                top={Platform.OS === "ios" ? "70px" : "30px"}
              >
                <AntDesign name="close" size={40} color="black" />
              </BackBtn>
              <WebView
                source={{ uri: "http://vnoti.kr/service/provision" }}
                originWhitelist={["*"]}
                scrollEnabled={true}
                startInLoadingState={true}
                renderLoading={() => <Text>브이노티 이용약관</Text>}
              />
            </ModalWrap>
          </Modal>
          <TouchableOpacity onPress={(e) => clickModal("individual")}>
            <Bold>개인정보처리방침 </Bold>
          </TouchableOpacity>

          <Modal
            visible={openModal == "individual" ? showAppOptions : ""}
            animationType="slide"
            onRequestClose={() => setShowAppOptions(false)}
          >
            <ModalWrap
              topWrap={
                Platform.OS === "ios"
                  ? "130px 0px 40px 0px"
                  : "70px 0px 40px 0px"
              }
            >
              <BackBtn
                onPress={() => setShowAppOptions(false)}
                top={Platform.OS === "ios" ? "70px" : "30px"}
              >
                <AntDesign name="close" size={40} color="black" />
              </BackBtn>
              <WebView
                source={{ uri: "http://vnoti.kr/service/policy" }}
                originWhitelist={["*"]}
                scrollEnabled={true}
                startInLoadingState={true}
                renderLoading={() => <Text>브이노티 이용약관</Text>}
              />
            </ModalWrap>
          </Modal>
          <Info onPress={deleteMember}> 회원탈퇴</Info>
        </Container>
      </Wrap>
    </ScrollView>
  );
};

const Wrap = styled(View)`
  height: 100%;
  padding: 20px 20px 30px 20px;
  background-color: #f5f5f5;
`;

const OptionWrap = styled(View)`
  width: 100%;
  background-color: #ffffff;
  border-radius: 10px;
`;

const OptionList = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;

  border-bottom-width: 1px;
  border-color: #f6f6f6;
  height: 50px;
`;

const Img = styled(Image)`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const Title = styled(Text)`
  font-size: 17px;
`;

const Info = styled(Text)`
  font-size: 14px;
  color: #afafaf;
  margin: 10px 5px 0 0;
`;

const Bold = styled(Text)`
  font-size: 14px;
  color: #afafaf;
  margin: 10px 5px 0 0;
  font-weight: 600;
`;

const Container = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Btn = styled(TouchableWithoutFeedback)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ModalWrap = styled(View)`
  width: 100%;
  padding: ${(props) => props.topWrap};
  background-color: #fff;
  height: 100%;
`;

const BackBtn = styled(TouchableOpacity)`
  position: absolute;
  top: ${(props) => props.top};
  right: 20px;
`;

export default MyPageScreen;
