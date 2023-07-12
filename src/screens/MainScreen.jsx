import React, { useState, useEffect, useContext } from "react";

import {
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  View,
  Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import theme from "../shared/theme";
import styled from "styled-components";
import "react-native-gesture-handler";
import ProfilInfo from "../components/Main/ProfilInfo";
import { UserStore } from "../context";
import apis from "../shared/apis";
import moment from "moment/moment";
import * as Analytics from "expo-firebase-analytics";
import { getStatusBarHeight } from "react-native-status-bar-height";

import Month from "../components/Month/Month";

const MainScreen = ({ navigation, route }) => {
  const { profile, isLogin, user, update, send } = useContext(UserStore);

  const [changed, setChanged] = useState(null);

  const today = moment().format("YYYY-MM-DD");
  const checkUser =
    profile?.userProfileId == user?.userProfileId ? "main" : "member";

  useEffect(() => {
    if (isLogin) {
      setChanged(null);
      if (checkUser == "main") {
        const profile_id = profile?.userProfileId;
        const day = today;
        apis.getJournal(profile_id, day).then((res) => {
          const data = res?.data?.list;
          if (data?.length <= 0) {
            setChanged(false);
          } else {
            setChanged(true);
          }
        });
      } else if (checkUser == "member") {
        setChanged(null);
      }
    } else if (isLogin === false) {
      setChanged(false);
    }
  }, [user, isLogin, update, send]);

  useEffect(() => {
    Analytics.logEvent("screen_view", { firebase_screen: "홈" });
  }, []);

  const checkJournal = () => {
    if (isLogin == false || isLogin == undefined) {
      Alert.alert("로그인을 해주세요!");
      navigation.navigate("로그인");
    } else {
      setChanged(true);
      const data = {
        journal_dt: today,
        journal_message: "기상완료 하였습니다!",
        journal_profile_id: profile?.userProfileId,
      };
      apis.putJournal(data).then((res) => {
        if (res.data.result === "000") {
          Alert.alert("기상완료!오늘도 화이팅하세요!");
        }
      });
    }
  };

  return (
    <Wrap>
      <StatusBar style={theme.MainColor} />
      <View
        style={{
          paddingTop: Platform.OS === "ios" ? 45 : 5,
          position: "relative",
          height: "100%",
        }}
      >
        <View style={{ height: Platform.OS === "ios" ? 75 : 100 }}>
          <ProfilInfo navigation={navigation} isLogin={isLogin} />
        </View>

        <MothWrap>
          <Month navigation={navigation} />
        </MothWrap>
        {changed == null ? (
          ""
        ) : (
          <Btn onPress={checkJournal} disabled={changed}>
            <Img
              source={
                changed
                  ? require("../../assets/images/sun.png")
                  : require("../../assets/images/moon.png")
              }
            />
          </Btn>
        )}
      </View>
    </Wrap>
  );
};

const Wrap = styled(View)`
  background-color: ${(props) => props.theme.MainColor};
  height: 100%;
  position: relative;
`;

const Btn = styled(TouchableOpacity)`
  height: 65px;
  position: absolute;
  bottom: 30px;
  right: 2%;
`;

const Img = styled(Image)`
  width: 250px;
  height: 65px;
`;

const MothWrap = styled(View)`
  height: 70%;
`;

export default MainScreen;
