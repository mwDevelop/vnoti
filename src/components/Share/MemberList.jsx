import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Alert,
  Modal,
} from "react-native";
import styled from "styled-components";
import Subscriptions from "./Subscriptions";
import SubScribers from "./SubScribers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserStore } from "../../context";

const MemberList = ({ navigation, subscriptions, subScribers }) => {
  const { setUser, isLogin, send, setSend, update, setUpdate } =
    useContext(UserStore);
  const Height = Dimensions.get("window").height;

  const color = [
    "#94E8D3",
    "#f8fdb6",
    "#adaed1",
    "#BFBFBF",
    "#F7FFC7",
    "#96c2f5",
    "#cbcef3",
    "#F7FFC7",
    "#94E8D3",
    "#d3f3b5",
    "#2e468a",
    "#96c2f5",
    "#cbcef3",
    "#F7FFC7",
    "#94E8D3",
    "#6667ab",
  ];

  const changeData = ({ value }) => {
    setSend(value);
  };

  const [userName, setUserName] = useState();
  const [userProfile, setUserProfile] = useState();
  const [change, setChange] = useState(false);

  useEffect(() => {
    isLogin == false ? setChange(false) : "";
  }, [isLogin, send, update]);

  const changeProfile = (e, data, v) => {
    Alert.alert(`${data.profile_name}와 연결되었습니다`);
    const userInfo = {
      userProfileId: data.profile_id,
      userName: data.profile_name,
      userId: data.userId,
      subscribeId: data.subscribe_id,
      userProfile: data.profile_image,
    };
    setUser(userInfo);
    setUserName(data.profile_name);
    setUserProfile(data.profile_image);
    setChange(v);
    setUpdate(update - 1);
  };

  const changeMainUser = () => {
    Alert.alert("내프로필로 돌아가기");
    AsyncStorage.getItem("main_user").then((res) => {
      const data = JSON.parse(res);
      const userInfo = {
        userProfileId: data.userProfileId,
        userName: data.userName,
        userId: data.userId,
        userPhoneNum: data.userPhoneNum,
        userProfile: data.userProfile,
      };
      setUser(userInfo);
    });
    setChange(false);
  };

  const [changeM, setChangeM] = useState(true);

  const changeMemberList = () => {
    setChangeM(!changeM);
  };

  return (
    <SafeAreaView>
      {change ? (
        <ShareWrap>
          {userProfile == "undefined" ||
          userProfile == "" ||
          userProfile == "null" ? (
            <UserImg
              resizeMode="contain"
              source={require("../../../assets/images/Profil/profil_10.png")}
            />
          ) : (
            <UserImg
              source={{ uri: userProfile }}
              size={"40px"}
              resizeMode="contain"
            />
          )}

          <Name>{userName}</Name>

          <Icon
            source={require("../../../assets/images/connect_05.png")}
            resizeMode="contain"
          />
          <Btn onPress={changeMainUser}>
            <BtnText>
              연결{"\n"}
              끊기
            </BtnText>
          </Btn>
        </ShareWrap>
      ) : (
        ""
      )}

      <BorderLine></BorderLine>
      <Wrap>
        <TitleWrap>
          {changeM ? (
            <Title color={"#000"} titleSize={"22px"} center={0}>
              내가 <Bolder>볼 수 있는</Bolder> 사람들
            </Title>
          ) : (
            <Title color={"#000"} titleSize={"22px"} center={0}>
              내꺼 <Bolder>보는</Bolder> 사람들
            </Title>
          )}

          <TouchableOpacity onPress={changeMemberList}>
            <Icon
              resizeMode="contain"
              source={require("../../../assets/images/transfer.png")}
            />
          </TouchableOpacity>
        </TitleWrap>

        <ScrollView>
          <View style={{ height: Height + 200 }}>
            {changeM
              ? subscriptions &&
                subscriptions.map((i, k) => {
                  return (
                    <TouchableOpacity
                      key={k}
                      onPress={(e) => changeProfile(i.profile_id, i, true)}
                    >
                      <Subscriptions
                        data={i}
                        navigation={navigation}
                        changeData={changeData}
                      />
                    </TouchableOpacity>
                  );
                })
              : subScribers &&
                subScribers.map((i, k) => {
                  return (
                    <TouchableOpacity key={k}>
                      <SubScribers
                        data={i}
                        color={color[k]}
                        navigation={navigation}
                      />
                    </TouchableOpacity>
                  );
                })}
          </View>
        </ScrollView>
      </Wrap>
    </SafeAreaView>
  );
};

const Wrap = styled(View)`
  padding: 10px 10px;
  height: 100%;
`;

const BorderLine = styled(View)`
  margin-top: 13px;
  border: 0.1px solid #efefef;
  border-top-width: 1px;
`;

const TitleWrap = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const Title = styled(Text)`
  font-size: ${(props) => props.titleSize};
  color: ${(props) => props.color};
  margin: ${(props) => props.center}; ;
`;

const Bolder = styled(Text)`
  font-weight: ${(props) => props.theme.Bolder};
`;

const Icon = styled(Image)`
  width: 25px;
  height: 25px;
  margin-left: 10px;
`;

const ShareWrap = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 5px 10px;
  height: 80px;
`;

const UserImg = styled(Image)`
  width: 55px;
  height: 55px;
  margin-right: 5px;
  border-radius: 100px;
`;

const Name = styled(Text)`
  font-size: 17px;
  margin: auto 4px;
`;

const Btn = styled(TouchableOpacity)`
  position: absolute;
  right: 15px;
  width: 45px;
  height: 45px;
  background-color: #414141;
  border-radius: 5px;
`;

const BtnText = styled(Text)`
  color: #fff;
  margin: auto;
  font-size: 16px;
`;

export default MemberList;
