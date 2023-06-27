import React, { useContext, useEffect, useState } from "react";

import { Text, View, SafeAreaView } from "react-native";
import styled from "styled-components";
import { StatusBar } from "expo-status-bar";
import ProfilInfo from "../components/Main/ProfilInfo";
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
const RewardScreen = ({ navigation, route }) => {
  const { isLogin, user } = useContext(UserStore);
  const data = route.params;
  const today = moment().format("YYYY-MM-DD");
  const weekAgo = moment(today).subtract("1", "w").format("YYYY-MM-DD");

  const [history, setHistory] = useState();
  const [period, setPeriod] = useState();
  const [checked, setChecked] = useState();
  const [attend, setAttend] = useState();
  const [update, setUpdate] = useState();
  const [token, setToken] = useState();
  const [modal, setModal] = useState(false);
  const [pressAttend, setPressAttend] = useState();
  const [point, setPoint] = useState();
  const [todayPoint, setTodayPoint] = useState();

  function cryptoJs() {
    let data = {
      id: user.userId,
      name: user.userName,
      point: sumPoint,
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
    apis.getReward(1, weekAgo, today, today).then(
      axios.spread((res1, res2, res3, res4) => {
        setHistory(res1.data.list);
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

  return (
    <Container bg={theme.MainColor}>
      <StatusBar style={theme.MainColor} />
      <ProfilInfo navigation={navigation} />

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

      {history ? (
        <Wrap>
          <>
            <RewardLists
              history={history}
              checked={checked}
              attend={attend}
              sumPoint={sumPoint(history)}
              cryptoJs={cryptoJs}
              setUpdate={setUpdate}
              update={update}
              getModalData={getModalData}
              today={sumPoint(todayPoint)}
            />
            <RewardHistory
              history={check ? period : history}
              navigation={navigation}
              beg={check ? data.beg : weekAgo}
              end={check ? data.end : today}
            />
          </>
        </Wrap>
      ) : isLogin ? (
        <Wrap>
          <InfoText>로딩 중....</InfoText>
        </Wrap>
      ) : (
        <Wrap>
          <InfoText>로그인해주세요</InfoText>
        </Wrap>
      )}
    </Container>
  );
};

const Container = styled(SafeAreaView)`
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

export default RewardScreen;
