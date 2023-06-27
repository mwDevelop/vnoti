import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import styled from "styled-components";
import apis from "../../shared/apis";
import theme from "../../shared/theme";
import axios from "axios";

const Phone = ({ navigation, route }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [authNumber, setAuthNumber] = useState("");
  const [authCheck, setAuthCheck] = useState(false);

  const onChangeAuth = (e) => {
    setAuthNumber(e.nativeEvent.text);
  };

  const sendAuth = () => {
    if (phoneNumber == "" || phoneNumber?.length < 11) {
      Alert.alert("전화번호를 확인해주세요!");
    } else {
      const data = {
        sms_receiver_phone: `${phoneNumber}`,
      };

      apis
        .postAuth(data)
        .then((res) => {
          console.log(res);
          if (res.data.result == "000") {
            setAuthCheck(true);
          } else {
            Alert.alert("다시 확인해주세요!");
          }
        })
        .catch(function (error) {
          console.log("실패");
          console.log(error);
        });
    }
  };

  const checkAuth = async () => {
    const data = {
      sms_receiver_phone: `${phoneNumber}`,
      sms_auth_number: `${authNumber}`,
    };
    apis.postCheckAuth(data).then((response) => {
      if (response.data.result === "000") {
        Alert.alert("인증이 완료되었습니다.");
        navigation.navigate("AuthCheck", {
          userPhoneNum: phoneNumber,
          deviceToken: route?.params?.deviceToken,
        });
      } else {
        Alert.alert("인증 번호가 잘못되었습니다.");
      }
    });
  };

  return (
    <AllWrap>
      <Container>
        {authCheck ? (
          <InputContainer>
            <Text style={styles.title}>인증번호를{"\n"}입력해주세요</Text>
            <Wrap>
              <InputBox
                style={styles.input}
                type="text"
                value={authNumber}
                placeholder={"인증번호"}
                onChange={onChangeAuth}
                keyboardType="number-pad"
                maxLength={4}
                hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
              />
              <Btn
                bgColor={authNumber.length > 3 ? theme.SubColor : "#F0F0F0"}
                activeOpacity={0.8}
                onPress={checkAuth}
              >
                <BtnText fontColor={authNumber.length > 3 ? "#fff" : "#000000"}>
                  확인
                </BtnText>
              </Btn>
            </Wrap>
          </InputContainer>
        ) : (
          <InputContainer>
            <Text style={styles.title}>본인인증이{"\n"}필요해요</Text>

            <Wrap>
              <TextInput
                type="text"
                onChangeText={(text) => setPhoneNumber(text)}
                placeholder={"전화번호"}
                value={phoneNumber}
                keyboardType="number-pad"
                style={styles.input}
                maxLength={11}
              />
              <Btn
                bgColor={phoneNumber.length > 10 ? theme.SubColor : "#F0F0F0"}
                activeOpacity={0.8}
                onPress={sendAuth}
              >
                <BtnText fontColor={phoneNumber.length > 10 ? "#fff" : "#000"}>
                  인증 요청
                </BtnText>
              </Btn>
            </Wrap>
          </InputContainer>
        )}
      </Container>
      <LogoWrap>
        <Image
          style={styles.img}
          source={require("../../../assets/images/loginLogo.png")}
          resizeMode="contain"
        />
      </LogoWrap>
    </AllWrap>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 38,
    fontWeight: "600",
    lineHeight: 45,
    marginTop: 30,
  },
  button: {
    width: 120,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#000",
  },
  input: {
    width: "65%",
    fontSize: 23,
    marginRight: 10,
  },

  imgtitle: {
    fontSize: 25,
    fontWeight: "600",
    color: "#FF8A00",
    marginTop: 10,
  },
  img: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});

const AllWrap = styled(SafeAreaView)`
  width: 100%;
  height: 100%;
  background-color: #fff;
`;

const Container = styled(View)`
  height: 70%;
  background-color: #fff;
  padding: 50px 20px 0px 20px;
`;

const InputContainer = styled(View)`
  width: 100%;
  height: 100%;
`;

const Wrap = styled(View)`
  width: 100%;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: auto;
`;

const Btn = styled(TouchableOpacity)`
  width: 30%;
  height: 45px;
  border-radius: 8px;
  background-color: ${(props) => props.bgColor};
  padding: 0 1px;
`;

const BtnText = styled(Text)`
  margin: auto;
  font-size: 18px;
  text-align: center;
  color: ${(props) => props.fontColor};
`;

const InputBox = styled(TextInput)`
  width: ${(props) => props.btnW};
  font-size: 18px;
  margin-right: 10px;
`;

const LogoWrap = styled(View)`
  margin: 10px auto 20px auto;
`;
export default Phone;
