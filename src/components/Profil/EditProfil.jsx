import React, { useEffect, useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import styled from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserStore } from "../../context";
import apis from "../../shared/apis";
import ProfilImgPicker from "../ImagePicker/ProfilImg";
import { Alert } from "react-native";
import DatePicker from "../AddPill/DatePicker";
import { SimpleLineIcons } from "@expo/vector-icons";

import { StatusBar } from "expo-status-bar";
import theme from "../../shared/theme";
import SelectEmail from "../../elements/SelectBox";

const EditProfil = () => {
  const { profile, isLogin, setUser, user, setProfile, setUpdate, update } =
    useContext(UserStore);

  useEffect(() => {}, [profile, isLogin]);
  const data = profile;
  const splitEmail = profile?.userEmail;
  const emailAdress = splitEmail?.split("@");

  const emailId = splitEmail && emailAdress[0];
  const email = splitEmail && emailAdress[1];
  const [chageData, setChangeData] = useState(profile);

  const [userInfo, setUserInfo] = useState({
    userName: chageData?.userName,
    userEmail: chageData?.userEmail,
    emailAd: "",
    emailInfo: emailId,
    userBirth: chageData?.userBirth,
    userGender: chageData?.userGender,
    userProfile: chageData?.userProfile,
  });

  const { userName, userEmail, userGender, userBirth, emailInfo, emailAd } =
    userInfo;

  const [editable, setEditable] = useState({
    editName: false,
    editEmail: false,
    editBirth: false,
    editGender: false,
  });

  const { editName, editEmail, editBirth, editGender } = editable;

  const handleChange = (keyvalue, e) => {
    setUserInfo({
      ...userInfo,
      [keyvalue]: e,
    });
  };

  const [openCountBox, setOpenCountBox] = useState(false);
  const [selectedCount, setSelectedCount] = useState(email == "" ? "" : email);

  const [emailOptions, setEmailOptions] = useState([
    { label: "naver.com", value: "naver.com" },
    { label: "gmail.com", value: "gmail.com" },
    { label: "hanmail.com", value: "hanmail.com" },
    { label: "kakao.com", value: "kakao.com" },
    { label: "직접입력", value: "directly" },
  ]);

  const handleKeyDown = (e) => {
    console.log("저장");
  };

  let [photo, setPhoto] = useState(data?.userProfile);

  const genderData = userGender == "" ? null : userGender == "m" ? false : true;

  const [check, setCheck] = useState(genderData);

  const checkGender = (e) => {
    handleChange(userGender, e);
    if (e == "f") {
      setCheck(true);
    } else {
      setCheck(false);
    }

    saveInfo("userGender", e, "editGender");
  };

  const getDateDate = (e) => {
    setUserInfo({
      ...userInfo,
      userBirth: e,
    });
  };

  const emailTest = () => {
    setOpenCountBox(true);
    setSelectedCount(null);
  };

  const saveEmail = (e, key, value, edit) => {
    const checkEmail = selectedCount == "directly" ? value : selectedCount;
    const checkId = key;

    if (checkEmail?.includes(".") == false || checkId == "undefined") {
      Alert.alert("이메일을 확인해주세요.");
    } else {
      const email_reg =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
      const newEmail = `${checkId}@${checkEmail}`;
      if (!email_reg.test(newEmail)) {
        Alert.alert("이메일형식이 올바르지 않습니다.");
      } else {
        setUserInfo({
          ...userInfo,
          userEmail: `${newEmail}`,
        });
        saveInfo(e, newEmail, edit);
      }
    }
  };

  const saveInfo = async (e, key, edit) => {
    if (key == "") {
      Alert.alert("이름을 입력해주세요!");
    } else {
      setEditable({
        ...editable,
        [edit]: false,
      });
      if (profile?.userId !== user?.userId) {
        setProfile({
          ...profile,
          [e]: key,
        });
      } else {
        setProfile({
          ...profile,
          [e]: key,
        });
        setUser({
          ...user,
          [e]: key,
        });
      }
      const mb_id = profile?.userId;
      const profile_Id = profile?.userProfileId;
      let chageUserInfo = {};
      let chageProfile = {};
      let main_user = {};
      if (e == "userName") {
        chageUserInfo = {
          mb_name: `${userName}`,
        };
        chageProfile = {
          profile_name: `${userName}`,
        };
        main_user = {
          userName: `${userName}`,
        };
      } else if (e == "userEmail") {
        chageUserInfo = {
          mb_email: `${key}`,
        };
        main_user = {
          userEmail: `${key}`,
        };
      } else if (e == "userGender") {
        chageUserInfo = {
          mb_gender: `${key}`,
        };
        chageProfile = {
          profile_name: `${userName}`,
          profile_gender: `${key}`,
        };
        main_user = {
          userGender: `${key}`,
        };
      } else if (e == "userBirth") {
        chageUserInfo = {
          mb_birth: `${userBirth}`,
        };
        chageProfile = {
          profile_name: `${userName}`,
          profile_birth: `${userBirth}`,
        };
        main_user = {
          userBirth: `${userBirth}`,
        };
      }
      AsyncStorage.mergeItem("main_user", JSON.stringify(main_user)).then(
        (res) => {
          AsyncStorage.getItem("main_user", (err, result) => {});
        }
      );
      await apis
        .editUserInfo(mb_id, chageUserInfo)
        .then((res) => {})
        .catch((err) => console.log(err));
      {
        e == "userEmail"
          ? ""
          : await apis
              .editProfile(profile_Id, chageProfile)
              .then((res) => {})
              .catch((err) => console.log(err));
      }
    }
  };

  const editInfo = (keyvalue) => {
    setEditable({
      ...editable,
      [keyvalue]: true,
    });
  };

  const getImg = (photo) => {
    setProfile({
      ...profile,
      userProfile: photo,
    });

    const profile_Id = profile?.userProfileId;
    const chageProfile = {
      profile_name: `${userName}`,
      profile_image: `${photo}`,
    };
    const main_user = {
      userProfile: `${userBirth}`,
    };
    AsyncStorage.mergeItem("main_user", JSON.stringify(main_user)).then(
      (res) => {
        AsyncStorage.getItem("main_user", (err, result) => {});
      }
    );

    apis.editProfile(profile_Id, chageProfile).then((res) => {
      if (res?.data?.result == "000") {
        setUpdate(update - 1);
      }
    });
  };

  return (
    <Container>
      <StatusBar style={theme.gray} />
      <Header>
        <ProfilImgPicker
          url={photo}
          onChangePhoto={setPhoto}
          size={"90px"}
          editProfile={true}
          getImg={getImg}
        />

        <InfoWrap>
          <Name>{userName}</Name>
          <Text style={{ marginLeft: 5 }}>
            {profile?.userPhone || profile?.userPhoneNum}
          </Text>
        </InfoWrap>
      </Header>
      <Edit>
        {/* 사용자 이름 */}
        <EditWrap>
          <Title>이름</Title>
          {editName ? (
            <Input
              type="text"
              name="userName"
              value={userName}
              onChangeText={(e) => handleChange("userName", e)}
              returnKeyType="done"
              onSubmitEditing={handleKeyDown}
              maxLength={6}
            />
          ) : (
            <InputText>{userName}</InputText>
          )}

          {editName ? (
            <EditBtn
              name="name"
              value={userName}
              onPress={(e) => saveInfo("userName", userName, "editName")}
            >
              <SaveBtn color={"#000"}>저장</SaveBtn>
            </EditBtn>
          ) : (
            <EditBtn onPress={(e) => editInfo("editName", editName)}>
              <SaveBtn color={"#A9A9A9"}>수정</SaveBtn>
            </EditBtn>
          )}
        </EditWrap>
        <Line />
        <EditWrap>
          <Title>이메일</Title>

          {editEmail ? (
            <EmailWrap style={{ zIndex: 2000 }}>
              <EmailInput
                placeholder={"이메일"}
                onChangeText={(e) => handleChange("emailInfo", e)}
                value={
                  emailInfo == "null" || emailInfo == "undefined"
                    ? ""
                    : emailInfo
                }
                keyboardType="email-address"
                maxLength={15}
                width={"33%"}
              />
              <Text>@</Text>
              {selectedCount == "directly" ? (
                <View>
                  <EmailInput
                    placeholder={"입력해주세요"}
                    onChangeText={(e) => handleChange("emailAd", e)}
                    value={emailAd}
                    keyboardType="email-address"
                    maxLength={13}
                    width={"60%"}
                  />
                  <TouchableOpacity
                    onPress={() => emailTest()}
                    style={{ position: "absolute", right: 10 }}
                  >
                    <SimpleLineIcons
                      name={"arrow-down"}
                      size={16}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ width: "60%", height: 30 }}>
                  <SelectEmail
                    data={emailOptions}
                    setSelectedCount={setSelectedCount}
                    placeholder={!email ? "선택해주세요" : email}
                    top={"40px"}
                  />
                </View>
              )}
            </EmailWrap>
          ) : (
            <InputText numberOfLines={1} ellipsizeMode="tail">
              {userEmail?.includes("null") || userEmail?.includes("undefined")
                ? "입력해주세요"
                : userEmail}
            </InputText>
          )}

          {editEmail ? (
            <EditBtn
              name="email"
              value={userEmail}
              onPress={(e) =>
                saveEmail("userEmail", emailInfo, emailAd, "editEmail")
              }
            >
              <SaveBtn color={"#000"}>저장</SaveBtn>
            </EditBtn>
          ) : (
            <EditBtn onPress={(e) => editInfo("editEmail")}>
              <SaveBtn color={"#A9A9A9"}>수정</SaveBtn>
            </EditBtn>
          )}
        </EditWrap>
        <Line style={{ zIndex: -100 }} />
        <EditWrap style={{ zIndex: -100 }}>
          <Title>생년월일</Title>
          {editBirth ? (
            <>
              <DatePicker
                getDateDate={getDateDate}
                data={userBirth}
                size={"16px"}
                paddingSize={"0px"}
              />
            </>
          ) : (
            <InputText>
              {!!!userBirth || userBirth == "null" || userBirth == "0000-00-00"
                ? "입력해주세요"
                : userBirth}
            </InputText>
          )}
          <>
            {editBirth ? (
              <EditBtn
                name="userBirth"
                value={userBirth}
                onPress={(e) => saveInfo("userBirth", userBirth, "editBirth")}
              >
                <SaveBtn color={"#000"}>저장</SaveBtn>
              </EditBtn>
            ) : (
              <EditBtn onPress={(e) => editInfo("editBirth")}>
                <SaveBtn color={"#A9A9A9"}>수정</SaveBtn>
              </EditBtn>
            )}
          </>
        </EditWrap>

        <GenderWrap style={{ zIndex: -100 }}>
          <Title>성별</Title>
          <SelectBox>
            <Option
              size={"20px"}
              color={check == true ? "#FFAB48" : "#D9D9D9"}
              onPress={(e) => checkGender("f")}
            >
              <Inner />
            </Option>
            <OptionTitle>여성</OptionTitle>
            <Option
              size={"20px"}
              color={check == false ? "#FFAB48" : "#D9D9D9"}
              onPress={(e) => checkGender("m")}
            >
              <Inner />
            </Option>
            <OptionTitle>남성</OptionTitle>
          </SelectBox>
        </GenderWrap>
      </Edit>
    </Container>
  );
};

const EmailWrap = styled(View)`
  width: 60%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const EmailInput = styled(TextInput)`
  width: ${(props) => props.width};
  font-size: 16px;
  border-radius: 10px;
  padding: 0px;
`;

const Container = styled(View)`
  width: 100%;
  background-color: #f5f5f5;
  margin-bottom: 25px;
`;

const Header = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 60px;
  height: 60px;
  background-color: #f5f5f5;
`;

const Name = styled(Text)`
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const InfoWrap = styled(View)`
  margin-left: 20px;
`;

const Edit = styled(View)`
  margin-top: 30px;
  background-color: #fff;
  padding: 5px 0px;
  border-radius: 10px;
`;

const EditWrap = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  padding: 0px 15px;
  width: 100%;
  height: 48px;
`;

const GenderWrap = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;

  padding: 0px 15px;
  width: 100%;
  height: 48px;
`;

const Line = styled(View)`
  border-bottom-color: #efefef;
  border-bottom-width: 1px;
`;

const Title = styled(Text)`
  font-size: 16px;
  width: 22%;
  padding: 5px 0px;
`;

const Input = styled(TextInput)`
  width: 60%;
  font-size: 16px;
  border-radius: 10px;
`;

const InputText = styled(Text)`
  width: 60%;
  font-size: 15px;

  color: #5b5b5b;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EditBtn = styled(TouchableOpacity)`
  width: 45px;
  height: 30px;
  background-color: #eeeeee;

  border-radius: 5px;
  align-items: center;
`;

const SaveBtn = styled(Text)`
  color: ${(props) => props.color};
  font-size: 16px;
  margin: auto 0;
`;

const SelectBox = styled(View)`
  display: flex;
  flex-direction: row;
  width: 62%;
  height: 48px;
  align-items: center;
  margin-left: 5px;
`;

const Option = styled(TouchableOpacity)`
  width: 20px;
  height: 20px;
  border-width: 1px;
  background-color: ${(props) => props.color};
  border-color: ${(props) => props.color};
  border-radius: 10px;
  margin-right: 10px;
`;

const Inner = styled(View)`
  width: 12px;
  height: 12px;
  background-color: #fff;
  border-radius: 10px;
  margin: auto;
`;

const OptionTitle = styled(Title)`
  font-size: 16px;
`;

export default EditProfil;
