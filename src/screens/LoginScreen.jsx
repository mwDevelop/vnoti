import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  Platform,
  Linking,
  AppState,
} from "react-native";
import styled from "styled-components";
// import KakaoLogin from "../components/Login/KakaoLogin";
import theme from "../shared/theme";
import { registerForPushNotificationsAsync } from "../components/DeviceToken";
import Constants from "expo-constants";
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";

const LoginScreen = ({ navigation }) => {
  const [deviceToken, setDeviceToken] = useState();

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        registerForPushNotificationsAsync().then((res) => {
          if (res !== undefined) {
            setDeviceToken(res);
          }
        });
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });
    return () => {
      subscription.remove();
    };
  }, [appStateVisible]);

  const settingAlarm = async () => {
    if (Platform.OS === "ios") {
      Linking.openSettings();
    } else {
      const pkg = Constants.manifest.releaseChannel
        ? Constants.manifest.android.package
        : "host.exp.exponent";
      await startActivityAsync(ActivityAction.APP_NOTIFICATION_SETTINGS, {
        extra: { "android.provider.extra.APP_PACKAGE": pkg },
      }).then((data) => {
        registerForPushNotificationsAsync().then((res) => {
          if (res !== undefined) {
            setDeviceToken(res);
          }
        });
      });
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((res) => {
      if (res == undefined) {
        Alert.alert(
          "알림 설정",
          "알림 설정이 차단 되어있습니다. 알림 설정을 변경해주세요!",
          [
            {
              text: "알림 설정하러 가기",
              onPress: () => {
                settingAlarm();
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
      } else {
        setDeviceToken(res);
      }
    });
  }, []);

  return (
    // <View style={styles.container}>
    //   <ImgWrap>
    //     <Image
    //       style={styles.img}
    //       source={require("../../assets/images/logo_logoName.png")}
    //       resizeMode="contain"
    //     />
    //     {/* <Image
    //         style={styles.logoName}
    //         source={require("../../assets/images/logoName.png")}
    //         resizeMode="contain"
    //       /> */}
    //   </ImgWrap>
    //   <View style={styles.wrap}>
    //     <Btn
    //       bgColor={theme.SubColor}
    //       onPress={() =>
    //         navigation.navigate("Phone", { deviceToken: deviceToken })
    //       }
    //       style={{ width: Dimensions.get("window").width - 40 }}
    //     >
    //       <BtnTitle font="#fffff">
    //         <TitleBlod>휴대폰 번호</TitleBlod>로 시작
    //       </BtnTitle>
    //     </Btn>
    //     <TouchableOpacity
    //       onPress={() =>
    //         navigation.navigate("KakaoLogin", { deviceToken: deviceToken })
    //       }
    //     >
    //       <Image
    //         source={require("../../assets/images/kakao_login.png")}
    //         resizeMode="contain"
    //         style={{
    //           width: Dimensions.get("window").width - 40,
    //           height: 60,
    //           padding: 10,
    //         }}
    //       />
    //     </TouchableOpacity>
    //     {/* <Btn
    //       bgColor={"#000"}
    //       style={{ width: Dimensions.get("window").width - 40 }}
    //     >
    //       <BtnTitle>Apple로 시작</BtnTitle>
    //     </Btn> */}
    //   </View>
    // </View>
    <Wrap>
      <Container>
        <ImgWrap>
          <Image
            style={styles.img}
            source={require("../../assets/images/logo_logoName.png")}
            resizeMode="contain"
          />
        </ImgWrap>

        <BtnWrap>
          <Btn
            bgColor={theme.SubColor}
            onPress={() =>
              navigation.navigate("Phone", { deviceToken: deviceToken })
            }
          >
            <LoginWrap>
              <LoginImg
                source={require("../../assets/images/phone.png")}
                resizeMode="contain"
              />
              <BtnTitle font="#fff" weight="600">
                휴대폰 번호
                <BtnTitle font="#fff" weight="400">
                  로 시작
                </BtnTitle>
              </BtnTitle>
            </LoginWrap>
          </Btn>
          <Btn
            bgColor={"#FEE500"}
            onPress={() =>
              navigation.navigate("KakaoLogin", { deviceToken: deviceToken })
            }
          >
            <LoginWrap>
              <LoginImg
                source={require("../../assets/images/kakao_login.png")}
                resizeMode="contain"
              />
              <BtnTitle font="#000" weight="600">
                카카오톡
                <BtnTitle font="#000" weight="400">
                  으로 시작
                </BtnTitle>
              </BtnTitle>
            </LoginWrap>
          </Btn>
        </BtnWrap>
      </Container>
    </Wrap>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#FFAB48",
    marginTop: 30,
  },
  img: {
    width: 200,
    height: 250,
  },
  logoName: {
    height: 80,
    marginTop: 30,
  },
});

const Wrap = styled(View)`
  width: 100%;
  height: 100%;
  background-color: #fff;
`;

const Btn = styled(TouchableOpacity)`
  width: 90%;
  height: 45px;
  background-color: ${(props) => props.bgColor};
  border-radius: 10px;
  margin-bottom: 10px;
`;

const Container = styled(View)`
  width: 100%;
  height: 100%;
`;

const LoginImg = styled(Image)`
  width: 20px;
  height: 22px;
  margin-right: 5px;
  position: absolute;
  left: 15px;
`;

const ImgWrap = styled(View)`
  margin: auto;
  padding-bottom: 30px;
`;

const BtnWrap = styled(View)`
  width: 100%;
  position: absolute;
  justify-content: center;
  align-items: center;
  bottom: 50px;
`;

const LoginWrap = styled(View)`
  margin: auto;
  width: 100%;
`;

const BtnTitle = styled(Text)`
  font-size: 15px;
  font-weight: ${(props) => props.weight};
  color: ${(props) => props.font};
  margin: auto;
  padding-left: 15px;
`;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 24,
//   },

//   logoWrap: {},
//   wrap: {
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 50,
//   },
//   title: {
//     fontSize: 40,
//     fontWeight: "700",
//     color: "#FFAB48",
//     marginTop: 30,
//   },
//   img: {
//     width: 200,
//     height: 200,

//     height: 300,
//   },
//   logoName: {
//     height: 80,
//     marginTop: 30,
//   },
// });

// const Btn = styled(TouchableOpacity)`
//   height: 50px;
//   background-color: ${(props) => props.bgColor};
//   border-radius: 8px;
//   margin: 10px 0;

//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

// const ImgWrap = styled(View)`
//   display: flex;
//   justify-content: center;
// `;

// const BtnTitle = styled(Text)`
//   font-size: 20px;
//   font-weight: 400;
//   color: #fff;
// `;

// const TitleBlod = styled(Text)`
//   font-size: 20px;
//   font-weight: 700;
//   color: #fff;
// `;

export default LoginScreen;
