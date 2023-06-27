import React, { useState, useEffect, useContext } from "react";

import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
  TouchableNativeFeedback,
  Platform,
  Dimensions,
} from "react-native";

import styled from "styled-components";

import apis from "../../shared/apis";
import * as SMS from "expo-sms";

import { UserStore } from "../../context";

const SendShare = ({ navigation }) => {
  const { profile, setSend, send } = useContext(UserStore);
  const [isAvailable, setIsAvailable] = useState(false);
  const [userInfo, setUserInfo] = useState();

  const sendSms = async () => {
    const isSmsAvailable = SMS.isAvailableAsync();
    setIsAvailable(isSmsAvailable);
  };

  const windowWidth = Math.floor(Dimensions.get("window").width);

  const [inputs, setInputs] = useState({
    name: "",
    phone: "",
  });

  const { name, phone } = inputs;

  useEffect(() => {
    setUserInfo(profile?.userProfileId);
    sendSms();
  }, [profile, phone]);

  const onChange = (keyvalue, e) => {
    setInputs({
      ...inputs,
      [keyvalue]: e,
    });
  };

  const [url, setUrl] = useState();

  const sendShareMms = () => {
    if (name.length > 0 && phone.length > 10) {
      const data = {
        subscribe_profile_id: profile?.userProfileId,
        subscribe_receiver_name: name,
        subscribe_receiver_phone: phone,
        subscribe_permission: "0",
      };

      apis.putSubScribe(data).then(async (res) => {
        if (res.data.result == "000") {
          setUrl(res.data.url);
          const { result } = await SMS.sendSMSAsync([phone], `${res.data.url}`);

          setSend(!send);
          setInputs("");
          navigation.navigate("ApplicationShare", { name: name });
        } else if (res.data.result == "003") {
          Alert.alert("이미 신청된 정보입니다.");
          setTimeout(() => navigation.navigate("홈"), 1000);
        }
      });
    } else {
      Alert.alert("입력한 정보를 확인해주세요!");
    }
  };

  return (
    <Wrap>
      <Box>
        {windowWidth > 300 ? (
          <Box>
            <LogoImage
              source={require("../../../assets/images/smile02.png")}
              ImgLeft="20px"
              ImgBottom={Platform.OS == "ios" ? "50px" : "7px"}
              ImgSize={Platform.OS == "ios" ? "95px" : "90px"}
            />
            <LogoImage
              source={require("../../../assets/images/smile01.png")}
              ImgLeft={Platform.OS == "ios" ? "300px" : "270px"}
              ImgBottom={Platform.OS == "ios" ? "130px" : "33px"}
              ImgSize={Platform.OS == "ios" ? "98px" : "90px"}
            />
          </Box>
        ) : (
          <></>
        )}
      </Box>
      <Container>
        <ScrollView>
          <BtnWrap>
            <Text></Text>
            <CancelBtn onPress={() => navigation.navigate("DrawerComponent")}>
              <CancelImg
                source={require("../../../assets/images/shareBtn.png")}
              />
            </CancelBtn>
          </BtnWrap>
          <TextWrap heigth={Platform.OS == "ios" ? "70%" : "100%"}>
            <Title titlesize="30px" color={"#fff"} font={"600"}>
              내꺼볼래?
            </Title>

            <Title titlesize="18px" color={"#fff"}>
              나와 가족,친구들이 함께 기록을 볼 수 있어요.
            </Title>

            <InputBox>
              <SendTitle titlesize="25px" color={"#000"}>
                신청하기
              </SendTitle>

              <Title titlesize="20px">누구에게?</Title>

              <Input
                onChangeText={(e) => onChange("name", e)}
                name="name"
                eredqd
                value={name}
                placeholder={"보여줄 사람의 이름/닉네임을 입력해 주세요."}
                maxLength={6}
              />
              <Title titlesize="20px">전화번호</Title>
              <Input
                onChangeText={(e) => onChange("phone", e)}
                name="phone"
                value={phone}
                keyboardType="number-pad"
                placeholder={"휴대폰 번호를 입력해 주세요."}
                maxLength={11}
              />

              <Btn
                onPress={sendShareMms}
                bgColor={phone?.length > 10 ? "#FFE793" : "#F0F0F0"}
                width={"100%"}
                heigth={"50px"}
              >
                <SendTitle
                  titlesize="20px"
                  color={phone?.length > 10 ? "#FC9A27" : "#A0A0A0"}
                >
                  전송
                </SendTitle>
              </Btn>
            </InputBox>
          </TextWrap>
        </ScrollView>
      </Container>
    </Wrap>
  );
};

const TextWrap = styled(View)`
  width: 100%;
  height: ${(props) => props.heigth};
  margin: auto;
`;

const BtnWrap = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Wrap = styled(View)`
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px 10px;
`;

const Container = styled(View)`
  width: 95%;
  height: 100%;
  margin: 45px auto 0px auto;
`;

const Title = styled(Text)`
  font-size: ${(props) => props.titlesize};
  padding-top: 10px;
  font-weight: 600;
  color: ${(props) => props.color};
  margin: 5px 0px;
`;

const SendTitle = styled(Text)`
  font-size: ${(props) => props.titlesize};
  font-weight: 600;
  color: ${(props) => props.color};
  margin: auto;
`;

const Btn = styled(TouchableOpacity)`
  width: ${(props) => props.width};
  height: ${(props) => props.heigth};

  background-color: ${(props) => props.bgColor};
  border-radius: 50px;
`;

const Input = styled(TextInput)`
  font-size: 16px;
  height: 50px;
  padding: 0 10px;
  background: #f8f8f8;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const InputBox = styled(View)`
  position: relative;
  width: 100%;
  height: 400px;

  background-color: #fff;
  border-radius: 25px;
  margin: 20px auto;
  padding: 30px 20px;
`;

const Box = styled(View)`
  position: absolute;
  bottom: 0;
  border-top-left-radius: 140px;
  border-top-right-radius: 140px;
`;

const LogoImage = styled(Image)`
  position: absolute;
  width: ${(props) => props.ImgSize};
  height: ${(props) => props.ImgSize};
  bottom: ${(props) => props.ImgBottom};
  left: ${(props) => props.ImgLeft};
`;

const CancelBtn = styled(TouchableNativeFeedback)`
  position: absolute;
  top: 50px;
  right: 0px;
`;

const CancelImg = styled(Image)`
  width: 28px;
  height: 28px;
`;

export default SendShare;
