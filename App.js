import "react-native-gesture-handler";
import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, TextInput } from "react-native";

import MainNavigation from "./src/components/Navigations/MainNavigation";
import { ThemeProvider } from "styled-components";
import theme from "./src/shared/theme";
import * as Linking from "expo-linking";
import AcceptShare from "./src/components/Share/AcceptShare";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apis from "./src/shared/apis";

import { UserStore } from "./src/context";
import OnboardingScreen from "./src/screens/OnboardingScreen";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.autoCorrect = false;
TextInput.defaultProps.allowFontScaling = false;

const Stack = createStackNavigator();

const App = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLogin, setIsLogin] = useState(null);
  const [send, setSend] = useState(false);
  const [update, setUpdate] = useState(1000);
  const [add, setAdd] = useState(0);

  const [onBoarding, setOnBoarding] = useState();

  useEffect(() => {
    AsyncStorage.getAllKeys().then((res) => {
      if (!res.includes("check")) {
        const check = "firstTime";
        AsyncStorage.setItem("check", check);
        setOnBoarding(false);
        setIsLogin(false);
      } else {
        if (res.length !== 0 || onBoarding == undefined) {
          setOnBoarding(true);
          if (res?.includes("main_user") === true) {
            AsyncStorage.getItem("main_user").then((res) => {
              const user = JSON.parse(res);

              if (user !== null) {
                const profile_id = user?.userProfileId;
                apis.getProfile(profile_id).then((res) => {
                  const data = res?.data?.data;
                  const userInfo = {
                    userProfileId: data?.profile_id,
                    userId: data?.profile_mb_id,
                    userName: data?.profile_name,
                    userBirth: data?.profile_birth,
                    userEmail: user?.userEmail,
                    userGender: data?.profile_gender,
                    userProfile: data?.profile_image,
                    userPhoneNum: user?.userPhoneNum,
                  };
                  setUser(userInfo);
                  setProfile(userInfo);
                  setIsLogin(true);
                });
              }
            });
          } else {
            setIsLogin(false);
          }
        } else {
          setIsLogin(false);
        }
      }
    });
  }, [send]);

  function saveUserInfo(userInfo) {
    return setUser(userInfo);
  }

  function changeUser(userInfo) {
    if (profile !== null) {
      return setUser(userInfo);
    }
  }

  return (
    <UserStore.Provider
      value={{
        user,
        setUser,
        saveUserInfo,
        isLogin,
        setIsLogin,
        profile,
        setProfile,
        changeUser,
        send,
        setSend,
        setUpdate,
        update,
        add,
        setAdd,
        setOnBoarding,
      }}
    >
      <ThemeProvider theme={theme}>
        <NavigationContainer
          linking={{
            prefixes: ["vnoti://"],
            async getInitialURL() {
              let url = await Linking.getInitialURL();
              if (url != null) {
                return url;
              }
            },
            subscribe(listener) {
              const onReceiveURL = ({ url }) => listener(url);
              const subscription = Linking.addEventListener(
                "url",
                onReceiveURL
              );
              return () => {
                subscription.remove();
              };
            },
            config: {
              initialRouteName: "MainNavigation",
              screens: {
                AcceptShare: "approval/:id",
                MainNavigation: {
                  screens: {
                    MainScreen: "main",
                  },
                },
              },
            },
          }}
        >
          {onBoarding == undefined ? (
            ""
          ) : onBoarding ? (
            <Stack.Navigator initialRouteName="MainNavigation">
              <Stack.Screen
                name="MainNavigation"
                component={MainNavigation}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="AcceptShare"
                component={AcceptShare}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator initialRouteName="OnboardingScreen">
              <Stack.Screen
                name="온보딩"
                component={OnboardingScreen}
                navigation={navigation}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="MainNavigation"
                component={MainNavigation}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </ThemeProvider>
    </UserStore.Provider>
  );
};

export default App;
