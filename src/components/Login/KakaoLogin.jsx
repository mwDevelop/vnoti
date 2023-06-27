import React, { useEffect, useContext } from "react";
import { View, Alert } from "react-native";
import Webview from "react-native-webview";
import axios from "axios";

import apis from "../../shared/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserStore } from "../../context";

const KakaoLogin = ({ navigation, route }) => {
  const { saveUserInfo, setProfile, setIsLogin } = useContext(UserStore);
  const REST_API_KEY = "9d30acd99215c0055751f20b96516bca";
  const REDIRECT_URI = "http://vnoti.kr/main";

  const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

  const getCode = (target) => {
    const exp = "code=";
    const condition = target.indexOf(exp);
    if (condition !== -1) {
      const request_code = target.substring(condition + exp.length);
      requestToken(request_code);
    }
  };

  const requestToken = async (request_code) => {
    var returnValue = "none";
    var request_token_url = "https://kauth.kakao.com/oauth/token";

    axios({
      method: "post",
      url: request_token_url,
      params: {
        grant_type: "authorization_code",
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code: request_code,
        client_secret: "jXqE5pRgKVHPFuYIsjbxL2SEz1vKJnMo",
      },
    })
      .then((response) => {
        returnValue = response.data.access_token;
        const data = {
          access_token: response.data.access_token,
          mb_device_token: `${route?.params?.deviceToken}`,
        };

        apis
          .postAccess(data)
          .then((response) => {
            if (response.data.result == "000") {
              const loginUserToken = response?.data?.token;
              const data = response?.data?.user;
              const profile_id = data?.mb_profile_id;
              axios({
                method: "GET",
                url: `http://vnoti.kr/api/profile/${profile_id}`,
                headers: {
                  Authorization: `${loginUserToken}`,
                },
              }).then((res) => {
                const userInfo = {
                  userToken: `${response?.data?.token}`,
                  userDeviveToken: `${route?.params?.deviceToken}`,
                  userId: `${data?.mb_id}`,
                  userProfileId: `${data?.mb_profile_id}`,
                  userName: `${data?.mb_name}`,
                  userPhoneNum: `${data?.mb_cellphone}`,
                  userEmail: `${data?.mb_email}`,
                  userBirth: `${data?.mb_birth}`,
                  userGender: `${data?.mb_gender}`,
                  userProfile: `${
                    res.data.data.profile_image !== undefined
                      ? res.data.data.profile_image
                      : "undefined"
                  }`,
                };
                const loginUser = {
                  userId: `${data?.mb_id}`,
                  userProfileId: `${response?.data.user?.mb_profile_id}`,
                  userName: `${response?.data?.user.mb_name}`,
                  userPhoneNum: `${data?.mb_cellphone}`,
                  userEmail: `${data?.mb_email}`,
                  userBirth: `${data?.mb_birth}`,
                  userGender: `${data?.mb_gender}`,
                  userProfile: `${
                    res.data.data.profile_image !== undefined
                      ? res.data.data.profile_image
                      : "undefined"
                  }`,
                };
                AsyncStorage.setItem("main_user", JSON.stringify(loginUser));
                AsyncStorage.setItem("userToken", loginUserToken);
                saveUserInfo(userInfo);
                setProfile(userInfo);
                setIsLogin(true);
                Alert.alert("로그인되었습니다");
                navigation.reset({ routes: [{ name: "DrawerComponent" }] });
              });
            }
          })
          .catch((err) => console.log("🥸🥸err", err));
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <Webview
        originWhitelist={["*"]}
        scalesPageToFit={false}
        style={{ marginTop: 30 }}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        onMessage={(event) => {
          const data = event.nativeEvent.url;
          getCode(data);
        }}
      />
    </View>
  );
};

export default KakaoLogin;
