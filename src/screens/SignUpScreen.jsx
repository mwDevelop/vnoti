import React, { useState, useContext } from "react";

import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import Wrap from "../elements/wrap";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apis from "../shared/apis";
import { UserStore } from "../context";
import styled from "styled-components";
import ProfilImg from "../components/ImagePicker/ProfilImg";
import AgreeConditions from "../components/Login/AgreeConditions";
import DatePicker from "../components/AddPill/DatePicker";
import DropDownPicker from "react-native-dropdown-picker";
import { AntDesign } from "@expo/vector-icons";

const SignUpScreen = ({ navigation, route }) => {
  const { saveUserInfo, setProfile, setIsLogin } = useContext(UserStore);

  let [photo, setPhoto] = useState(null);
  const [check, setCheck] = useState(null);
  const [agree, setAgree] = useState(true);
  const [inputs, setInputs] = useState({
    userName: "",
    phoneNum: `${route?.params?.phoneNum}`,
    email: "",
    emailAdress: "",
    brith: "",
    gender: "",
  });

  const [openCountBox, setOpenCountBox] = useState(false);
  const [selectedCount, setSelectedCount] = useState(null);
  const [emailOptions, setEmailOptions] = useState([
    { label: "naver.com", value: "naver.com" },
    { label: "gmail.com", value: "gmail.com" },
    { label: "hanmail.com", value: "hanmail.com" },
    { label: "kakao.com", value: "kakao.com" },
    { label: "직접입력하기", value: "directly" },
  ]);

  const { userName, phoneNum, email, brith, gender, emailAdress } = inputs;

  const onChange = (keyvalue, e) => {
    setInputs({
      ...inputs,
      [keyvalue]: e,
    });
  };

  const phoneNumValue = phoneNum
    ?.replace(/ /g, "")
    ?.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");

  const deviceToken = route?.params?.pushoken;

  const checkGender = (e) => {
    if (e == "f") {
      setCheck(true);
    } else {
      setCheck(false);
    }
    setInputs({
      ...inputs,
      gender: e,
    });
  };

  const getData = (agree) => {
    setAgree(agree);
  };

  const getImg = (photo) => {
    setPhoto(photo);
  };

  const getDateDate = (e) => {
    setInputs({
      ...inputs,
      brith: e,
    });
  };

  const emailTest = () => {
    setOpenCountBox(true);
    setSelectedCount(null);
  };

  const checkEmail =
    selectedCount == "directly"
      ? emailAdress == ""
        ? "null"
        : emailAdress
      : selectedCount;
  const userEmail = `${email}@${checkEmail}`;

  function EmailCheck(userEmail) {
    const email_reg =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (userEmail.includes("null") == true || email == "") {
      Alert.alert("이메일을 확인해주세요");
    } else if (userEmail.includes(".") == false || !email_reg.test(userEmail)) {
      Alert.alert("이메일 형식이 올바르지 않습니다.");
    } else {
      LoginCheckTest();
    }
  }

  const clickSignUp = async (deviceToken) => {
    if (userName == "") {
      Alert.alert("이름을 입력해주세요!");
    } else if (userEmail.includes("null") == true && email == "") {
      LoginCheckTest();
    } else {
      EmailCheck(userEmail);
    }
  };

  function LoginCheckTest() {
    const data = {
      mb_name: `${userName}`,
      mb_cellphone: `${phoneNum}`,
      mb_email: `${email == "" ? "" : userEmail}`,
      mb_birth: `${brith == "" ? "" : brith}`,
      mb_gender: `${gender == "" ? "" : gender}`,
      profile_image: `${photo == "" ? "" : photo}`,
    };

    apis.putMember(data).then((response) => {
      if (response.data.result == "000") {
        const userData = {
          mb_cellphone: `${phoneNum}`,
          mb_device_token: `${deviceToken}`,
        };
        apis.postLogin(userData).then((response) => {
          if (response.data.result == "000") {
            const loginUserToken = response?.data?.token;
            const userInfo = {
              userToken: `${response?.data?.token}`,
              userDeviveToken: deviceToken,
              userId: `${response?.data?.user?.mb_id}`,
              userProfileId: `${response?.data.user?.mb_profile_id}`,
              userName: `${response?.data?.user.mb_name}`,
              userPhoneNum: `${phoneNum}`,
              userEmail: `${response?.data?.user.mb_email}`,
              userBirth: `${response?.data?.user.mb_birth}`,
              userGender: `${response?.data?.user.mb_gender}`,
              userProfile: `${photo}`,
            };

            AsyncStorage.setItem("main_user", JSON.stringify(userInfo));
            AsyncStorage.setItem("userToken", loginUserToken);
            saveUserInfo(userInfo);
            setProfile(userInfo);
            setIsLogin(true);
            setInputs("");
            Alert.alert("로그인되었습니다!");
            navigation.reset({ routes: [{ name: "DrawerComponent" }] });
          }
        });
      } else {
        Alert.alert("입력정보를 확인해주세요!");
      }
    });
  }

  return (
    <>
      {agree == true ? (
        <AgreeConditions getData={getData} agree={agree} />
      ) : (
        <ScrollView style={{ zIndex: -100 }}>
          <Wrap>
            <Title>건강한 습관{"\n"}함께해요.</Title>

            <Container>
              <ProfilImg
                url={photo}
                onChangePhoto={setPhoto}
                getImg={getImg}
                size={"120px"}
              />
            </Container>
            <ListItem>
              이름<ListItem red>*</ListItem>
            </ListItem>

            <ListWrap>
              <Input
                placeholder={"최대 6글자까지 가능"}
                name="userName"
                value={userName}
                onChangeText={(e) => onChange("userName", e)}
                maxLength={6}
              />
            </ListWrap>
            <ListItem>
              휴대폰 번호 <ListItem red>*</ListItem>
            </ListItem>
            <ListWrap>
              <PhoneNum>{phoneNumValue}</PhoneNum>
            </ListWrap>
            <ListItem>이메일(선택)</ListItem>
            <ListWrap>
              <EmailWrap style={{ zIndex: 2000 }}>
                <EmailInput
                  placeholder={"이메일"}
                  onChangeText={(e) => onChange("email", e)}
                  value={email}
                  keyboardType="email-address"
                  maxLength={15}
                />
                <ListItem>@</ListItem>

                {selectedCount == "directly" ? (
                  <>
                    <EmailInput
                      placeholder={"이메일"}
                      onChangeText={(e) => onChange("emailAdress", e)}
                      value={emailAdress}
                      keyboardType="email-address"
                      maxLength={13}
                    />
                    <TouchableOpacity onPress={() => emailTest()}>
                      <AntDesign name="down" size={16} color="black" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <SelectEmail
                    style={{ zIndex: 1000 }}
                    placeholder={"선택해주세요"}
                    open={openCountBox}
                    value={selectedCount}
                    items={emailOptions}
                    setOpen={setOpenCountBox}
                    setValue={setSelectedCount}
                    setItems={setEmailOptions}
                    containerStyle={{
                      width: "51%",
                    }}
                    textStyle={{
                      fontSize: 17,
                    }}
                    dropDownContainerStyle={{
                      zIndex: 1000,
                      borderColor: "#fff",
                      background: "#fff",
                      marginTop: 3,
                      shadowColor: "#000",
                      shadowOffset: { width: 2, height: 2 },
                      shadowOpacity: 0.3,
                      elevation: 7,
                    }}
                    placeholderStyle={{ fontSize: 17 }}
                  />
                )}
              </EmailWrap>
            </ListWrap>
            <ListItem style={{ zIndex: -100 }}>생년월일(선택)</ListItem>
            <ListWrap style={{ zIndex: -100 }}>
              <DatePicker
                getDateDate={getDateDate}
                size={"17px"}
                paddingSize={"15px 10px"}
              />
            </ListWrap>

            <ListItem style={{ zIndex: -100 }}>성별(선택)</ListItem>
            <SelectBox>
              <Option
                color={check == true ? "#FFAB48" : "#868686"}
                onPress={(e) => checkGender("f")}
              >
                <OptionTitle color={check == true ? "#FFAB48" : "#868686"}>
                  여성
                </OptionTitle>
              </Option>
              <Option
                color={check == false ? "#FFAB48" : "#868686"}
                onPress={(e) => checkGender("m")}
              >
                <OptionTitle color={check == false ? "#FFAB48" : "#868686"}>
                  남성
                </OptionTitle>
              </Option>
            </SelectBox>

            <Btn onPress={(e) => clickSignUp(deviceToken)} bgColor={"#FFB74D"}>
              <BtnTitle>완료</BtnTitle>
            </Btn>
          </Wrap>
        </ScrollView>
      )}
    </>
  );
};

const SelectEmail = styled(DropDownPicker)`
  border: none;
  border-radius: 10px;
  font-size: 20px;
  background-color: #fff;
`;

const EmailWrap = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: 35px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const ListWrap = styled(View)`
  border-color: #ffb74d;
  border-bottom-width: 1px;
  margin-bottom: 15px;
`;

const ListItem = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => (props.red ? "#EF3F3F" : "#444444")};
`;

const Input = styled(TextInput)`
  font-size: 17px;
  padding: 10px;
  width: 100%;
`;

const EmailInput = styled(TextInput)`
  font-size: 17px;
  padding: 10px;
  width: 45%;
`;

const PhoneNum = styled(Text)`
  font-size: 17px;
  padding: 10px;
`;

const Btn = styled(TouchableOpacity)`
  width: 98%;
  height: 55px;
  background-color: ${(props) => props.bgColor};
  border-radius: 10px;

  justify-content: center;
  align-items: center;
  margin-top: 5%;
  margin-bottom: 50px;
  z-index: -100;
`;

const BtnTitle = styled(Text)`
  font-size: 18px;
  color: #fff;
`;

const Container = styled(View)`
  margin: 20px auto;
`;

const SelectBox = styled(View)`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin: 10px auto;
  width: 100%;
  z-index: -100;
`;

const Option = styled(TouchableOpacity)`
  width: 48%;
  height: 40px;
  border-width: 1px;
  border-color: ${(props) => props.color};
  border-radius: 8px;
`;

const OptionTitle = styled(Title)`
  font-size: 16px;
  color: ${(props) => props.color};
  margin: auto;
`;
export default SignUpScreen;

{
  /* <ListItem>생년월일(선택)</ListItem>
        <ListWrap>
          <Input
            placeholder={"생일을 입력해주세요!"}
            onChangeText={(e) => onChange("brith", e)}
            value={brith}
            keyboardType="number-pad"
          />
        </ListWrap> */
}

{
  /* <View style={styles.wrap}>
        <Text style={styles.title}>아이디</Text>
        <TextInput
          placeholder={"아이디을 입력해주세요!"}
          value={userid}
          onChange={(e) => onChangeValue("userid", e)}
        />
      </View> */
}
{
  /* <View style={styles.wrap}>
        <Text style={styles.title}>비밀번호</Text>
        <TextInput
          placeholder={"비밀번호를 입력해주세요!"}
          value={userpassword}
          onChange={(e) => onChangeValue("userpassword", e)}
        />
      </View>
      <View style={styles.wrap}>
        <Text style={styles.title}>비밀번호 확인</Text>
        <TextInput
          placeholder={"비밀번호를 한번 더 입력해주세요!"}
          value={userpasswordchk}
          onChange={(e) => onChangeValue("userpasswordchk", e)}
        />
        {checkPassword == "" ? (
          ""
        ) : checkPassword ? (
          <Text>확인완료!</Text>
        ) : (
          <Text>다시확인!!</Text>
        )}
      </View> */
}
