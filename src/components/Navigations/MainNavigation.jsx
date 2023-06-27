import React, { useContext } from "react";
import { Alert, Image } from "react-native";

import MainScreen from "../../screens/MainScreen";
import AddScreen from "../../screens/AddScreen";
import EditScreen from "../../screens/EditScreen";
import HomeScreen from "../../screens/HomeScreen";
import MyPillScreen from "../../screens/MyPillScreen";
import LoginScreen from "../../screens/LoginScreen";
import Phone from "../Login/Phone";
import AuthCheck from "../Login/AuthCheck";
import AgreeConditions from "../Login/AgreeConditions";
import MyPageScreen from "../../screens/MyPageScreen";
import MainDrawer from "../Drawer/MainDrawer";
import ApplyInfo from "../InfoUse/ApplyInfo";
import RequestInfo from "../InfoUse/RequestInfo";
import LinkInfo from "../InfoUse/LinkInfo";
import EtcInfo from "../InfoUse/EtcInfo";
import UseInfoScreen from "../../screens/UseInfoScreen";

import MyPillItem from "../MyPill/MyPillItem";
import SignUpScreen from "../../screens/SignUpScreen";
import ShareScreen from "../../screens/ShareScreen";
import DravwerNavigtor from "../Drawer/DrawerNavigator";

import ApplicationShare from "../Share/ApplicationShare";
import SendShare from "../Share/SendShare";
import KakaoLogin from "../Login/KakaoLogin";

import OnboardingScreen from "../../screens/OnboardingScreen";

import RewardScreen from "../../screens/RewardScreen";
import PeriodSetting from "../Reward/PeriodSetting";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import styled from "styled-components";
import theme from "../../shared/theme";
import { UserStore } from "../../context";
import RewardHistory from "../Reward/RewardHistory";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerComponent = ({ navigation }) => {
  return (
    <Drawer.Navigator
      useLegacyImplementation={true}
      initialRouteName="TabComponent"
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => <DravwerNavigtor {...props} />}
    >
      <Drawer.Screen name="메인" component={TabComponent} />
      <Drawer.Screen name="수정" component={EditScreen} />
      <Drawer.Screen name="MainDrawer" component={MainDrawer} />
    </Drawer.Navigator>
  );
};

const TabComponent = ({ navigation }) => {
  const { isLogin } = useContext(UserStore);

  return (
    <Tab.Navigator
      initialRouteName="MainScreen"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.MainColor,
        tabBarIcon: ({ focused }) => TapBarIcon(focused, route.name),
        tabBarLabelStyle: {
          fontSize: 13,
        },
      })}
    >
      <Tab.Screen
        name="홈"
        component={MainScreen}
        options={{ unmountOnBlur: true }}
      />
      <Tab.Screen
        name="스케줄"
        component={HomeScreen}
        options={{ unmountOnBlur: true }}
      />
      <Tab.Screen
        name="약"
        component={MyPillComponent}
        options={{ unmountOnBlur: true }}
      />
      {/* <Tab.Screen
        name="리워드"
        component={RewardComponent}
        options={{ unmountOnBlur: true }}
      /> */}

      <Tab.Screen
        name="내 정보"
        component={MyPageScreen}
        options={{ unmountOnBlur: true }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            if (isLogin == true) {
              return;
            } else {
              Alert.alert("로그인을 해주세요!");
              e.preventDefault();
              navigation.navigate("로그인");
            }
          },
        })}
      />
    </Tab.Navigator>
  );
};

const TapBarIcon = (focused, name) => {
  if (name === "홈") {
    return (
      <Icon
        style={{ resizeMode: "contain" }}
        source={
          focused
            ? require("../../../assets/images/c_tab_icon1.png")
            : require("../../../assets/images/tab_icon1.png")
        }
      />
    );
  } else if (name === "스케줄") {
    return (
      <Icon
        style={{ resizeMode: "contain" }}
        source={
          focused
            ? require("../../../assets/images/c_tab_icon2.png")
            : require("../../../assets/images/tab_icon2.png")
        }
      />
    );
  } else if (name === "약") {
    return (
      <Icon
        style={{ resizeMode: "contain" }}
        source={
          focused
            ? require("../../../assets/images/c_tab_icon3.png")
            : require("../../../assets/images/tab_icon3.png")
        }
      />
    );
  } else if (name === "리워드") {
    return (
      <Icon
        style={{ resizeMode: "contain" }}
        source={
          focused
            ? require("../../../assets/images/c_tab_icon5.png")
            : require("../../../assets/images/tab_icon5.png")
        }
      />
    );
  } else if (name === "내 정보") {
    return (
      <Icon
        style={{ resizeMode: "contain" }}
        source={
          focused
            ? require("../../../assets/images/c_tab_icon4.png")
            : require("../../../assets/images/tab_icon4.png")
        }
      />
    );
  }
};
const MyPillComponent = () => {
  return (
    <Stack.Navigator
      initialRouteName="MyPillScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MyPillScreen" component={MyPillScreen} />
      <Stack.Screen name="MyPillItem" component={MyPillItem} />
    </Stack.Navigator>
  );
};

const RewardComponent = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="RewardScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="RewardScreen" component={RewardScreen} />
      <Stack.Screen
        name="PeriodSetting"
        component={PeriodSetting}
        navigation={navigation}
      />
    </Stack.Navigator>
  );
};

const ShareComponent = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="ShareScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ShareScreen"
        component={ShareScreen}
        navigation={navigation}
      />
      <Stack.Screen
        name="SendShare"
        component={SendShare}
        navigation={navigation}
      />
      <Stack.Screen name="ApplicationShare" component={ApplicationShare} />
    </Stack.Navigator>
  );
};

const LoginComponent = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Phone" component={Phone} />
      <Stack.Screen name="AuthCheck" component={AuthCheck} />
      <Stack.Screen name="KakaoLogin" component={KakaoLogin} />
      <Stack.Screen name="AgreeConditions" component={AgreeConditions} />
    </Stack.Navigator>
  );
};

const UseInfoComponent = () => {
  return (
    <Stack.Navigator
      initialRouteName="UseInfoScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="UseInfoScreen" component={UseInfoScreen} />
      <Stack.Screen name="ApplyInfo" component={ApplyInfo} />
      <Stack.Screen name="RequestInfo" component={RequestInfo} />
      <Stack.Screen name="LinkInfo" component={LinkInfo} />
      <Stack.Screen name="EtcInfo" component={EtcInfo} />
    </Stack.Navigator>
  );
};

const MainNavigation = ({ navigation, isLogin }) => {
  return (
    <Stack.Navigator initialRouteName="MainScreen">
      <Stack.Screen
        name="DrawerComponent"
        component={DrawerComponent}
        navigation={navigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="로그인"
        component={LoginComponent}
        navigation={navigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="공유"
        component={ShareComponent}
        navigation={navigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddScreen"
        component={AddScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UseInfoComponent"
        component={UseInfoComponent}
        navigation={navigation}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="온보딩"
        component={OnboardingScreen}
        navigation={navigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;

const Icon = styled(Image)`
  width: 25px;
  height: 20px;
`;
