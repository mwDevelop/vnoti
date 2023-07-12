import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  Modal,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";

import apis from "../../shared/apis";
import styled from "styled-components";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { UserStore } from "../../context";
import { PillShape, PillGuideline } from "../Function/Pill";

import theme from "../../shared/theme";

const MyPillItem = ({ navigation, setCountPill }) => {
  const { user, isLogin, send, update, setUpdate, add } = useContext(UserStore);

  const [pillData, setPillData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [num, setNum] = useState();

  const checkPlateform = Platform.OS === "ios";
  const platform = checkPlateform ? 75 : 100;
  const platformList = checkPlateform ? 80 : 30;

  const bar = checkPlateform
    ? "0px"
    : `${Math.floor(Number(platform) - getStatusBarHeight())}px`;

  useEffect(() => {
    const medicine_profile_id = user?.userProfileId;
    apis.getPillList(medicine_profile_id).then((res) => {
      const data = res.data.list;
      setPillData(data);
      setCountPill(data?.length >= 10 ? true : false);
      if (data?.length === 0) {
        setPillData(null);
      }
    });
  }, [user, update, isLogin, send, add]);

  const deleteMyPill = (e, i) => {
    const medicine_id = e;
    setModalVisible(false);

    apis.deleteMyPill(medicine_id).then((res) => {
      if (res.data.result == "000") {
        setUpdate(update - 1);
        Alert.alert("삭제되었습니다.");
      } else {
        Alert.alert("다시 확인해주세요");
      }
    });
  };

  const onPressModal = (e) => {
    setModalVisible(true);
    setNum(e);
  };

  const onPressAddScreen = (i) => {
    setModalVisible(false);
    navigation.navigate("AddScreen", {
      data: i,
      value: true,
    });
  };

  return (
    <Wrap>
      <DisplayWrap direction={"row"} content={"flex-start"}>
        <Title color={theme.MainColor}>복용중인 약</Title>
        <Img
          style={{ resizeMode: "contain" }}
          source={require("../../../assets/images/mypill.png")}
        />
      </DisplayWrap>

      {pillData === null || isLogin === false ? (
        <ListWrap>
          <PillListIcon
            style={{ resizeMode: "contain" }}
            source={require("../../../assets/images/pillList.png")}
          />
          <ListTitle color={"#000"} size={"20px"} font={"600"}>
            아직 등록된 복용 리스트가 없어요.
          </ListTitle>
          <ImgWrap>
            <Image
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
              source={require("../../../assets/images/plus_icon.png")}
            />
            <ListTitle color={"#AAAAAA"} size={"17px"} font={"400"}>
              를 눌러 정보를 입력해주세요.
            </ListTitle>
          </ImgWrap>
        </ListWrap>
      ) : (
        ""
      )}
      <Items>
        {pillData &&
          pillData?.map((i, k) => {
            const time = JSON.parse(i.medicine_time);
            const shape = i?.medicine_shape;
            return (
              <View
                key={k}
                style={{
                  flexDirection: "row",
                  marginBottom: 15,
                }}
              >
                <>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={num === i.medicine_id ? modalVisible : ""}
                    onRequestClose={() => {
                      setModalVisible(false);
                    }}
                  >
                    <Pressable
                      style={{
                        flex: 1,
                        backgroundColor: "transparent",
                      }}
                      onPress={() => setModalVisible(false)}
                    >
                      <ModalBg height={"100%"} bar={bar}>
                        <ModalContainer bar={`${platformList}px`}>
                          <ModalWrap
                            style={{
                              shadowColor: "#3d3d3d",
                              shadowOffset: { width: 3, height: 3 },
                              shadowOpacity: 0.4,
                              elevation: 7,
                            }}
                          >
                            <Top>
                              <ModalTtitle>정보</ModalTtitle>

                              <Pressable
                                onPress={(e) => setModalVisible(false)}
                              >
                                <Img
                                  style={{ resizeMode: "contain" }}
                                  source={require("../../../assets/images/cancel.png")}
                                />
                              </Pressable>
                            </Top>

                            <DisplayWrap
                              direction="column"
                              content="flex-start"
                            >
                              <Icon
                                source={
                                  shape == 1
                                    ? require("../../../assets/images/pill_icon_01.png")
                                    : shape == 2
                                    ? require("../../../assets/images/pill_icon_03.png")
                                    : require("../../../assets/images/pill_icon_02.png")
                                }
                                resizeMode="contain"
                              />

                              <Title>{i?.medicine_name}</Title>
                            </DisplayWrap>
                            <TextWrap>
                              <Sub>
                                <SubTitle>섭취시간</SubTitle>
                                {time?.map((a, b) => {
                                  return (
                                    <View key={b}>
                                      <Info>{a}, </Info>
                                    </View>
                                  );
                                })}
                              </Sub>
                              <Sub>
                                <SubTitle>섭취방법</SubTitle>
                                <Info>
                                  {PillGuideline(i.medicine_guideline)}
                                  {i.medicine_dose}
                                  {PillShape(shape)} 복용
                                </Info>
                              </Sub>
                            </TextWrap>
                            <DisplayWrap direction="row" content="space-around">
                              <Btn
                                onPress={(e) => {
                                  onPressAddScreen(i);
                                }}
                              >
                                <BtnTitle>수정</BtnTitle>
                              </Btn>
                              <Btn
                                key={i.medicine_id}
                                onPress={(e) => {
                                  deleteMyPill(i.medicine_id, i);
                                }}
                              >
                                <BtnTitle>삭제</BtnTitle>
                              </Btn>
                            </DisplayWrap>
                          </ModalWrap>
                        </ModalContainer>
                      </ModalBg>
                    </Pressable>
                  </Modal>
                  <Pressable
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                    onPress={(e) => onPressModal(i.medicine_id)}
                  >
                    <InfoTitlte>{i?.medicine_name}</InfoTitlte>
                    <InfoText>
                      {i?.medicine_dose}
                      {i?.medicine_shape == 1
                        ? "알(정)"
                        : i?.medicine_shape == 2
                        ? "포"
                        : "스푼"}
                    </InfoText>
                    <InfoText>
                      {i?.medicine_cycle_type == 1
                        ? `하루${time.length}번`
                        : i?.medicine_cycle_type == 2
                        ? `${i.medicine_cycle}시간마다`
                        : ""}
                    </InfoText>
                  </Pressable>
                </>
              </View>
            );
          })}
      </Items>
    </Wrap>
  );
};

const InfoText = styled(Text)`
  width: 30%;
  font-weight: 500;
  font-size: 20px;
  color: #959595;
`;
const InfoTitlte = styled(Text)`
  width: 40%;
  font-weight: 600;
  font-size: 20px;
  color: #333333;
`;

const Items = styled(ScrollView)`
  background-color: #fff;
  height: 100%;
  margin-bottom: 90px;
`;

const Wrap = styled(View)`
  padding: 20px;
  background-color: #fff;
  height: 100%;
`;

const DisplayWrap = styled(View)`
  display: flex;
  flex-direction: ${(props) => props.direction};
  align-items: center;
  justify-content: ${(props) => props.content};
  margin: 5px 0 10px 0;
`;

const Title = styled(Text)`
  font-size: 23px;
  color: ${(props) => props.color};
  font-weight: 600;
  margin-right: 5px;
`;

const ModalBg = styled(View)`
  position: absolute;
  right: 0px;
  bottom: 0px;
  left: 0px;
  top: ${(props) => props.bar};
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;

  width: 100%;
  height: 100%;
  margin: auto;
  padding: 0px 5px;
`;

const ModalWrap = styled(View)`
  width: 85%;
  height: 350px;
  background-color: #fffdfd;
  border-radius: 20px;
`;

const Img = styled(Image)`
  width: 25px;
  height: 25px;
  margin-right: 10px;
`;

const Icon = styled(Image)`
  margin: 10px auto 10px auto;
  width: 60px;
  height: 60px;
`;

const TextWrap = styled(View)`
  display: flex;
  flex-direction: column;
  margin: 0px 15px;
`;

const Sub = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  margin-bottom: 10px;
`;

const SubTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: #ffab48;
  background-color: #ffedd9;
  border-radius: 5px;
  padding: 6px 5px;
  margin-right: 10px;
  overflow: hidden;
`;

const Info = styled(Text)`
  font-size: 18px;
`;

const Top = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;

  height: 60px;
  background-color: #ffab48;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
`;

const ModalTtitle = styled(Text)`
  font-size: 23px;
  color: #fff;
  font-weight: 600;
  margin: auto;
  padding-left: 30px;
`;

const Btn = styled(Pressable)`
  width: 44%;
  height: 45px;
  border-radius: 8px;
  border: 1px;
  border-color: #e7e7e7;
  margin-bottom: 10px;
`;

const BtnTitle = styled(Text)`
  color: #787878;
  font-weight: 600;
  margin: auto;
  font-size: 18px;
`;

const PillListIcon = styled(Image)`
  width: 150px;
  height: 150px;
  margin: 0 auto;
`;

const ListTitle = styled(Text)`
  font-size: ${(props) => props.size};
  color: ${(props) => props.color};
  font-weight: ${(props) => props.font};
  margin: 0 auto;
`;

const ListWrap = styled(View)`
  width: 100%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImgWrap = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export default MyPillItem;
