import React, { useContext, useEffect, useState } from "react";

import { Text, View, Image } from "react-native";
import styled from "styled-components";
import { StatusBar } from "expo-status-bar";

import theme from "../shared/theme";
import moment from "moment";

import RewardLists from "../components/Reward/RewardLists";
import RewardHistory from "./../components/Reward/RewardHistory";
import { UserStore } from "../context";
import apis from "../shared/apis";
import axios from "axios";
import CryptoJS from "react-native-crypto-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "../elements/Modal";
import { Platform } from "react-native";
import ProfilInfo from "../components/Main/ProfilInfo";

const RewardScreen = ({ navigation, route }) => {
  const { isLogin, user, profile } = useContext(UserStore);

  const data = route.params;
  const today = moment().format("YYYY-MM-DD");
  const weekAgo = moment(today).subtract("1", "w").format("YYYY-MM-DD");

  const [history, setHistory] = useState(null);
  const [period, setPeriod] = useState();
  const [checked, setChecked] = useState();
  const [attend, setAttend] = useState();
  const [update, setUpdate] = useState();
  const [token, setToken] = useState();
  const [modal, setModal] = useState(false);
  const [pressAttend, setPressAttend] = useState();
  const [point, setPoint] = useState();
  const [userPoint, setUserPoint] = useState(0);
  const [todayPoint, setTodayPoint] = useState();

  function cryptoJs() {
    let data = {
      id: user.userId,
      name: user.userName,
      point: sumPoint(),
      cellphone: user.userPhoneNum.replace(
        /^(\d{2,3})(\d{3,4})(\d{4})$/,
        `$1-$2-$3`
      ),
      token: token,
    };

    let key = "df6j9afxxtbxl16ofcjtiubn1jqme9rf";
    key = CryptoJS.enc.Utf8.parse(key);

    let iv = "oywx885ouh2d3v84";
    iv = CryptoJS.enc.Utf8.parse(iv);

    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });
    encrypted = encrypted.toString();

    return encodeURIComponent(encrypted);
  }

  useEffect(() => {
    if (data !== undefined) {
      apis.getHistory(data.beg, data.end).then((res) => {
        setPeriod(res.data.list);
      });
    }
  }, [data]);

  useEffect(() => {
    apis.getUserInfo(profile?.userId).then((res) => {
      const data = res.data.data;
      setUserPoint(data.mb_point);
    });

    apis.getReward(1, weekAgo, today, today).then(
      axios.spread((res1, res2, res3, res4) => {
        if (res1.data.result === "000") {
          setHistory(res1.data.list);
        } else {
          setHistory("none");
        }
        setChecked(res2.data.data);
        setAttend(res3.data.list);
        setTodayPoint(res4.data.list);
      })
    );
    AsyncStorage.getItem("userToken").then((res) => setToken(res));
  }, [update]);

  function sumPoint(data) {
    const result = data?.reduce(function add(sum, currValue) {
      return sum + currValue.mbp_point;
    }, 0);

    return result;
  }

  const check = data !== undefined;
  const getModalData = (isRegPoint, point) => {
    setModal(true);
    setPressAttend(isRegPoint);
    setPoint(point);
  };

  const valueHistory = history === "none";

  return (
    <Container bg={theme.MainColor}>
      <StatusBar style={theme.MainColor} />
      <View
        style={{
          paddingTop: Platform.OS === "ios" ? 45 : 5,
        }}
      >
        <View style={{ height: Platform.OS === "ios" ? 75 : 100 }}>
          <ProfilInfo
            navigation={navigation}
            isLogin={isLogin}
            value={"reward"}
          />
        </View>

        {modal ? (
          <Modal
            setModal={setModal}
            content={
              pressAttend ? "이미 출석체크를 하셨습니다." : "출석체크 완료!"
            }
            value={pressAttend}
            point={point}
          />
        ) : (
          ""
        )}

        <Wrap>
          {history == null ? (
            <Wrap>
              <Flex>
                <Gif
                  source={require("../../assets/images/loading.gif")}
                  resizeMode="contain"
                />
              </Flex>
            </Wrap>
          ) : (
            <>
              <RewardLists
                checked={checked}
                attend={attend}
                sumPoint={userPoint}
                cryptoJs={cryptoJs}
                setUpdate={setUpdate}
                update={update}
                getModalData={getModalData}
                today={valueHistory ? 0 : sumPoint(todayPoint)}
                isLogin={isLogin}
              />
              <RewardHistory
                history={valueHistory ? "null" : check ? period : history}
                navigation={navigation}
                beg={check ? data.beg : weekAgo}
                end={check ? data.end : today}
                isLogin={isLogin}
              />
            </>
          )}
        </Wrap>
      </View>
    </Container>
  );
};

const Container = styled(View)`
  height: 100%;
  background-color: ${(props) => props.bg};
`;

const InfoText = styled(Text)`
  font-size: 25px;
  font-weight: 600;
  color: #444;
  margin: auto;
`;

const Wrap = styled(View)`
  background-color: #fff;
  height: 100%;
`;

const Flex = styled(View)`
  margin: 70% auto;
`;

const Gif = styled(Image)`
  width: 100px;
`;

export default RewardScreen;
