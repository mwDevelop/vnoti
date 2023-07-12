import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Platform,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import { AntDesign } from "@expo/vector-icons";

import styled from "styled-components";

const AgreeConditions = ({ getData }) => {
  const data = [
    {
      id: 0,
      title: "(필수) 브이노티 약관 및 동의사항",
      url: { uri: "http://vnoti.kr/service/provision" },
      keyValue: "requireOne",
    },
    {
      id: 1,
      title: "(필수) 브이노티 개인정보처리방침",
      url: { uri: "http://vnoti.kr/service/policy" },
      keyValue: "requireTwo",
    },
    {
      id: 2,
      title: "(선택) 마케팅 정보 수신 동의",
      url: { uri: "http://vnoti.kr/service/marketing" },
      keyValue: "option",
    },
  ];
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [num, setNum] = useState();

  const handleCheck = (e, i) => {
    if (i == false) {
      setCheckedItems((checkedItems) => [...checkedItems, e]);
    } else {
      setCheckedItems(checkedItems.filter((item) => item !== e));
    }
  };

  useEffect(() => {
    if (checkedItems.length >= 3) {
      setIsAllChecked(true);
    } else {
      setIsAllChecked(false);
    }
  }, [checkedItems]);

  const handleAllCheck = (e) => {
    setIsAllChecked(!isAllChecked);
    if (e == false) {
      setCheckedItems([0, 1, 2]);
    } else {
      setCheckedItems([]);
    }
  };

  const checkOption = checkedItems.length >= 3 ? true : false;
  const requiredOption = checkedItems.includes(0) && checkedItems.includes(1);

  const onClick = (e) => {
    if (e == true) {
      getData(false);
    } else if (requiredOption == true) {
      getData(false);
    } else {
      Alert.alert("약관동의를 해주세요!!");
    }
  };

  const clickModal = (e) => {
    handleCheck(e, checkedItems.includes(e) ? true : false);
    setNum(e);
    setShowAppOptions(!showAppOptions);
  };

  const btnColor = checkOption >= 3 || requiredOption == true;

  return (
    <Wrap>
      <Logo
        resizeMode="contain"
        source={require("../../../assets/images/smallLogoName.png")}
      />
      <Title color={"#000"}>브이노티가 처음이신가요?</Title>
      <Title color={"#FFAB48"}>
        약관에 동의
        <Title color={"#000"}>해주세요.</Title>
      </Title>
      <CheckBox>
        <Btn
          color={"#F8F8F8"}
          height={"55px"}
          onPress={(e) => handleAllCheck(isAllChecked ? true : false)}
        >
          <BtnTitle>약관 전체 동의</BtnTitle>
          {isAllChecked == false ? (
            <BtnIcon
              resizeMode="contain"
              source={require("../../../assets/images/checkcircle_G.png")}
            />
          ) : (
            <BtnIcon
              resizeMode="contain"
              source={require("../../../assets/images/checkcircle_O.png")}
            />
          )}
        </Btn>
        <CheckList>
          {data.map((i, k) => {
            return (
              <Btn
                key={k}
                name={i.keyValue}
                value={i.keyValue}
                onPress={(e) => clickModal(i.id)}
                color={"#fff"}
                height={"45px"}
              >
                <CheckTitle>{i.title}</CheckTitle>

                <Modal
                  visible={num === i.id ? showAppOptions : ""}
                  animationType="slide"
                  onRequestClose={() => setShowAppOptions(false)}
                >
                  <ModalWrap>
                    <BackBtn
                      top={Platform.OS == "ios" ? "45px" : "10px"}
                      onPress={() => setShowAppOptions(false)}
                    >
                      <AntDesign name="close" size={40} color="black" />
                    </BackBtn>

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                      <WebView
                        source={i.url}
                        originWhitelist={["*"]}
                        scrollEnabled={true}
                        startInLoadingState={true}
                        renderLoading={() => <Text>브이노티 이용약관</Text>}
                        style={{ height: 100 }}
                      />
                    </ScrollView>
                  </ModalWrap>
                </Modal>

                <BtnIcon
                  resizeMode="contain"
                  source={
                    checkedItems.includes(i.id)
                      ? require("../../../assets/images/checkcircle_O.png")
                      : require("../../../assets/images/checkcircle_G.png")
                  }
                />
              </Btn>
            );
          })}
        </CheckList>
        <Btn
          color={btnColor ? "#FFAB48" : "#F2F2F2"}
          height={"50px"}
          onPress={(e) => onClick(checkOption)}
        >
          <StartTitle color={btnColor ? "#fff" : "#C3C3C3"}>
            시작하기
          </StartTitle>
        </Btn>
      </CheckBox>
    </Wrap>
  );
};

const Wrap = styled(View)`
  padding: 60px 20px;
  background-color: #fff;
  height: 100%;
`;

const ModalWrap = styled(View)`
  width: 100%;
  height: 100%;

  padding: 80px 0px 40px 0px;
  background-color: #fff;
`;

const Logo = styled(Image)`
  width: 150px;
  height: 80px;
  margin-bottom: 30px;
`;

const Title = styled(Text)`
  font-size: 29px;
  color: ${(props) => props.color};
  font-weight: 600;
`;
const CheckBox = styled(View)`
  width: 100%;
  margin-top: 20%;
`;

const Btn = styled(TouchableOpacity)`
  width: 100%;
  height: ${(props) => props.height};
  background-color: ${(props) => props.color};
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px 0px 0px;
`;

const BtnTitle = styled(Text)`
  font-size: 22px;
  padding-left: 30px;
  margin: auto 0;
`;

const StartTitle = styled(Text)`
  font-size: 22px;
  margin: auto;
  color: ${(props) => props.color};
`;

const BtnIcon = styled(Image)`
  width: 30px;
  height: 30px;
  margin-right: 5px;
`;

const CheckList = styled(View)`
  width: 100%;
  padding: 0 0 0 20px;
  margin: 2% auto 5% auto;
`;

const CheckTitle = styled(Text)`
  color: #666666;
  font-size: 17px;
`;

const BackBtn = styled(TouchableOpacity)`
  position: absolute;
  top: ${(props) => props.top};
  right: 20px;
`;

export default AgreeConditions;
