import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
  Alert,
} from "react-native";
import moment from "moment";
import "moment/locale/ko";
import { StatusBar } from "expo-status-bar";
import ProfilInfo from "../components/Main/ProfilInfo";
import ScheduleList from "../components/Main/ScheduleList";
import CalendarStrip from "react-native-calendar-strip";
import { Animated } from "react-native";
import apis from "../shared/apis";
import styled from "styled-components";
import { UserStore } from "../context";
import Modal from "../elements/Modal";
import theme from "../shared/theme";
import * as Analytics from "expo-firebase-analytics";
import Moment from "../elements/Moment";

const HomeScreen = ({ navigation, route }) => {
  const { user, update, isLogin, send, setUpdate } = useContext(UserStore);
  const [value, onChangeText] = useState(route?.params?.day);

  let selectedDate = value == undefined ? moment() : value;

  const [monthStart, setMonthStart] = useState(selectedDate);
  const [monthEnd, setMonthEnd] = useState(selectedDate);
  const [dateSelected, setDateSelected] = useState(selectedDate);
  const [todayList, setTodayList] = useState();
  const [noneClick, setNoneClick] = useState();
  const [today, setToday] = useState();
  const [modal, setModal] = useState();
  const [point, setPoint] = useState();
  const [content, setContent] = useState();
  const [fade, setFade] = useState(null);
  const [fadeModal, setFadeModal] = useState(false);

  const schedule_profile_id = user?.userProfileId;
  const schedule_date = moment(dateSelected)?.format("YYYY-MM-DD");

  useEffect(() => {
    if (isLogin === true) {
      apis
        .getSchedule(schedule_profile_id, schedule_date)
        .then((res) => {
          const data = res.data.list;
          setTodayList(data);
          const today = moment().format("YYYY-MM-DD");
          const valueClick =
            schedule_date == today
              ? "today"
              : schedule_date > today
              ? "tomorrow"
              : "yesterday";
          setNoneClick(valueClick);
          navigation.setParams({ day: undefined });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setTodayList();
      setNoneClick(true);
    }
  }, [dateSelected, user, update, send]);

  useEffect(() => {
    Analytics.logEvent("screen_view", { firebase_screen: "스케줄" });
  }, []);

  const moveToday = () => {
    setDateSelected(moment());
    setUpdate(update - 1);
  };

  const onPressAddPill = () => {
    if (isLogin) {
      navigation.navigate("AddScreen", { value: false });
    } else {
      Alert.alert("로그인을 해주세요!");
      navigation.navigate("로그인");
    }
  };

  const getModalData = (e, open, value, fade) => {
    setModal(open);
    setContent(value);
    setPoint(e);
    setFade(fade);
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 5,
      duration: 4000,
      delay: 1000,
      useNativeDriver: true,
    }).start();
  };

  const getFade = () => {
    setFadeModal(true);
    fadeIn();
  };

  return (
    <Container color={theme.MainColor}>
      <StatusBar style={theme.MainColor} />
      <ProfilInfo navigation={navigation} />
      {modal === "open" ? (
        <ModalBg>
          <Modal
            point={point}
            setModal={setModal}
            content={content}
            navigation={navigation}
            getModalData={getModalData}
            fade={fade}
            getFade={getFade}
            setFadeModal={setFadeModal}
          />
        </ModalBg>
      ) : (
        ""
      )}

      {fade === "004" && fadeModal ? (
        <ModalBg>
          <Animated.View
            style={[
              {
                opacity: fadeAnim,
                zIndex: 1000,
                position: "relative",
                top: "38%",
              },
            ]}
          >
            <Modal
              point={point}
              setModal={setModal}
              content={"004"}
              navigation={navigation}
              fade={fade}
              setFadeModal={setFadeModal}
            />
          </Animated.View>
        </ModalBg>
      ) : (
        ""
      )}

      <>
        <CalendarWrap>
          <HeaderWrap>
            {Moment(monthStart, "ko", "YM") === Moment(monthEnd, "ko", "YM") ? (
              <DayTitle color={"#fff"}>
                {Moment(monthStart, "ko", "YM")}
              </DayTitle>
            ) : (
              <>
                <DayTitle color={"#fff"}>
                  {Moment(monthStart, "ko", "YM")}
                  <DayTitle color={"#fff"}>
                    /{Moment(monthEnd, "ko", "M")}
                  </DayTitle>
                </DayTitle>
              </>
            )}
            <TouchableOpacity onPress={moveToday}>
              <DayTitle color={"#fff"}>오늘</DayTitle>
            </TouchableOpacity>
          </HeaderWrap>
          <CalendarStrip
            maxDate={moment().add(30, "d").format("YYYY-MM-DD")}
            minDate={moment().subtract(2, "months").format("YYYY-MM-DD")}
            scrollable={true}
            style={{
              height: 70,
              marginBottom: 10,
            }}
            scrollerPaging={true}
            dateNumberStyle={{
              color: "#fff",
              fontSize: Platform.OS == "ios" ? 18 : 15,
              marginTop: 15,
            }}
            dateNameStyle={{
              color: "#fff",
              fontSize: Platform.OS == "ios" ? 18 : 15,
            }}
            updateWeek={false}
            highlightDateNameStyle={{
              color: "#FF8A00",
              fontSize: Platform.OS == "ios" ? 18 : 15,
            }}
            highlightDateNumberStyle={{
              color: "#FF8A00",
              marginTop: 15,
              fontSize: Platform.OS == "ios" ? 18 : 15,
            }}
            daySelectionAnimation={{
              type: "background",
              highlightColor: "#FFEDD9",
            }}
            dayContainerStyle={{ height: 70, width: 40 }}
            dayComponentHeight={70}
            selectedDate={dateSelected}
            onDateSelected={setDateSelected}
            setSelectedDate={(date) => console.log(date)}
            calendarHeaderContainerStyle={{
              height: 0,
              position: "absolute",
              display: "none",
            }}
            onWeekChanged={(start, end) => {
              setMonthStart(start), setMonthEnd(end);
            }}
            iconStyle={{ display: "none" }}
            onWeekScrollStart={(res) => setToday(res)}
          />
        </CalendarWrap>

        <Wrap style={{ flex: 1, marginBottom: 70 }}>
          <DayTitleWrap>
            <DayTitle color={"#292929"}>
              {moment(dateSelected).format("MM월DD일 ddd요일")}
            </DayTitle>
          </DayTitleWrap>
          <View>
            {todayList ? (
              <ListWrap>
                <View style={{ flex: 1 }}>
                  <ScrollView>
                    {todayList?.map((item, k) => {
                      return (
                        <ScheduleList
                          key={k}
                          data={item}
                          noneClick={noneClick === "today"}
                          day={dateSelected}
                          navigation={navigation}
                          getModalData={getModalData}
                        />
                      );
                    })}
                  </ScrollView>
                </View>
              </ListWrap>
            ) : todayList &&
              todayList?.length === 0 &&
              valueClick !== "yesterday" ? (
              <ListWrap>
                <Logo>
                  <HomeCalendar
                    resizeMode="contain"
                    source={require("../../assets/images/homeCalendar.png")}
                  />
                  <LogoTitle color={"#000"} size={"20px"} bloder={"600"}>
                    아직 등록된 복용 스케줄이 없어요
                  </LogoTitle>
                  <LogoTitle size={"16px"} color={"#b3b3b3"} bloder={"500"}>
                    추가 하기를 눌러 정보를 입력해주세요:)
                  </LogoTitle>
                  <AddBtn color={"#E9E9E9"} onPress={() => onPressAddPill()}>
                    <LogoTitle color={"#848484"} size={"20px"} bloder={"500"}>
                      추가하기
                    </LogoTitle>
                  </AddBtn>
                </Logo>
              </ListWrap>
            ) : (
              <ListWrap color={"#fff "}>
                <LogoTitle color={"#AAAAAA"} size={"20px"} bloder={"500"}>
                  {"지난 날짜 스케줄이에요!"}
                </LogoTitle>
              </ListWrap>
            )}
          </View>
        </Wrap>
      </>
    </Container>
  );
};

const Container = styled(SafeAreaView)`
  position: relative;
  background-color: ${(props) => props.color};
  height: 100%;
  margin-bottom: 40px;
`;

const Wrap = styled(View)`
  position: relative;
  background-color: #fff;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  height: 100%;
`;

const HeaderWrap = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: center;
  height: 50px;
`;

const DayTitle = styled(Text)`
  font-size: 23px;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${(props) => props.color};
`;

const DayTitleWrap = styled(View)`
  width: 100%;
  height: 70px;
  position: relative;
  padding: 20px 0px 0px 20px;
  background-color: ${(props) => props.color};
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  display: flex;
  flex-direction: row;
`;
const ListWrap = styled(View)`
  width: 100%;
  height: 100%;
  background-color: #fff;
`;

const CalendarWrap = styled(View)`
  height: 140px;
  padding: 10px 12px;
`;

const Logo = styled(View)`
  margin: auto;
`;

const LogoTitle = styled(Text)`
  color: ${(props) => props.color};
  margin: auto;
  font-size: ${(props) => props.size};
  font-weight: ${(props) => props.bloder};
  padding-top: 2px;
`;

const AddBtn = styled(TouchableOpacity)`
  width: 100px;
  padding: 5px;
  border-radius: 100px;
  background-color: ${(props) => props.color};
  margin: 15px auto;
`;

const HomeCalendar = styled(Image)`
  width: 100px;
  height: 100px;
  margin: 0px auto;
`;

const ModalBg = styled(View)`
  position: absolute;
  right: 0px;
  bottom: 0px;
  left: 0px;
  top: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  transition: opacity 1s;
`;

export default HomeScreen;
