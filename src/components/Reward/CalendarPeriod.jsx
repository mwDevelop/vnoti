import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment";
import styled from "styled-components";
import { useEffect, useState } from "react";
import theme from "../../shared/theme";
import { MaterialIcons } from "@expo/vector-icons";

const ArrowLeft = () => {
  return <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />;
};

const ArrowRight = () => {
  return <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />;
};

LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],

  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "ko";

const CalendarPeriod = ({ navigation }) => {
  const [marked, setMarked] = useState({});
  const [selected, setSelected] = useState(null);
  const [startDay, setStartingDay] = useState(null);
  const [endingDay, setEndingDay] = useState(null);
  const [month, setMonth] = useState(moment().format("M"));
  const Height = Dimensions.get("window").height;
  const Width = Dimensions.get("window").width;

  useEffect(() => {
    if (startDay === null && endingDay === null) {
      const markedDates = {};
      markedDates[moment().format("YYYY-MM-DD")] = {
        disabled: true,
        startingDay: true,
        color: theme.MainColor,
        textColor: "#fff",
        endingDay: true,
      };
      setMarked(markedDates);
    }
  }, [selected]);

  function EndSetting(e) {
    const markedDates = {};
    const range = moment(e).diff(startDay, "day");
    if (range > 0) {
      for (let i = 1; i <= range; i++) {
        let tempDate = moment(startDay).add(i, "day");
        tempDate = moment(tempDate).format("YYYY-MM-DD");

        if (i < range) {
          markedDates[tempDate] = {
            color: "#fff1db",
            textColor: "#333",
          };
        } else {
          markedDates[tempDate] = {
            endingDay: true,
            color: theme.MainColor,
            textColor: "#fff",
          };
        }
      }
    }

    return markedDates;
  }

  function StartSetting(e) {
    const markedDates = {};
    markedDates[e] = {
      startingDay: true,
      color: theme.MainColor,
      textColor: "#fff",
    };

    return markedDates;
  }

  function MarkedDay(value, e) {
    if (value === "startingDay") {
      const result = StartSetting(e);
      setMarked(result);
    } else {
      const result = EndSetting(e);
      setEndingDay(true);
      setMarked({ ...marked, ...result });
    }
  }

  const onDayPress = (e) => {
    setSelected(e);
    if (selected > e || selected == null) {
      MarkedDay("startingDay", e);
      setStartingDay(e);
      setEndingDay(null);
    } else {
      MarkedDay("ending", e);
      setEndingDay(e);
    }
    console.log(selected === e);
  };

  const checkColor = startDay === null || endingDay === null;

  const onPressPeriod = () => {
    if (checkColor) {
      Alert.alert("기간설정을 확인해주세요");
    } else {
      navigation.navigate("RewardScreen", {
        beg: startDay,
        end: endingDay,
      });
    }
  };

  return (
    <Wrap>
      <Calendar
        onMonthChange={(month) => {
          setMonth(month.month);
        }}
        renderHeader={(date) => {
          return <Month>{month}월</Month>;
        }}
        renderArrow={(direction) => {
          if (direction === "left") {
            return <ArrowLeft />;
          } else {
            return <ArrowRight />;
          }
        }}
        showTodayButton={true}
        markingType="period"
        monthFormat={"MM"}
        current={moment().format("YYYY-MM-DD")}
        onDayPress={(day) => {
          onDayPress(day.dateString);
        }}
        markedDates={marked}
      />
      <BtnWrap>
        <Btn
          bg={
            checkColor ? "rgba(231, 231, 231, 0.3)" : "rgba(255, 183, 77, 0.2)"
          }
          color={checkColor ? "#ededed" : theme.MainColor}
          onPress={() => onPressPeriod()}
        >
          {checkColor ? (
            <Title color={"#888"}>기간을 설정해주세요</Title>
          ) : (
            <Title color={theme.MainColor}>
              {moment(startDay).format("MM.DD dd")} -
              {endingDay === null ? "" : moment(endingDay).format("MM.DD dd")} /
              기간적용
            </Title>
          )}
        </Btn>
      </BtnWrap>
    </Wrap>
  );
};

const Wrap = styled(View)`
  width: 100%;
  height: 90%;
  background-color: #fff;
  position: relative;
`;

const BtnWrap = styled(View)`
  position: absolute;
  bottom: 50px;
  width: 100%;
  left: 5%;
`;

const Btn = styled(TouchableOpacity)`
  width: 90%;
  height: 48px;
  background: ${(props) => props.bg};
  border: 1px solid;
  border-color: ${(props) => props.color};
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  color: ${(props) => props.color};
`;

const Month = styled(Text)`
  font-weight: 700;
  font-size: 20px;
  color: #333333;
`;

export default CalendarPeriod;

// import React, { useState, useEffect, useContext } from "react";
// import moment from "moment/moment";
// import {
//   View,
//   Text,
//   TouchableWithoutFeedback,
//   Image,
//   TouchableOpacity,
// } from "react-native";
// import { AntDesign } from "@expo/vector-icons";
// import styled from "styled-components";
// import apis from "../../shared/apis";
// import { UserStore } from "../../context";
// import theme from "../../shared/theme";

// const Calendar = ({ navigation }) => {
//   const { user, isLogin, send } = useContext(UserStore);
//   useEffect(() => {}, [send]);
//   const [getMoment, setMoment] = useState(moment());
//   const [marked, setMarked] = useState([]);

//   const startDate = moment().subtract(2, "months").format("YYYY-MM");

//   const weekList = ["일", "월", "화", "수", "목", "금", "토"];

//   useEffect(() => {
//     if (isLogin == false) {
//       setMarked(null);
//     } else if (!!user) {
//       setMarked(null);
//       const schedule_profile_id = `${user?.userProfileId}`;
//       const schedule_start_date = moment(getMoment)
//         .startOf("month")
//         .format("YYYY-MM-DD");

//       const schedule_end_date = moment(getMoment)
//         .endOf("month")
//         .format("YYYY-MM-DD");
//       apis
//         .getMonthlyCount(
//           schedule_profile_id,
//           schedule_start_date,
//           schedule_end_date
//         )
//         .then((res) => {
//           if (res.data.result == "000") {
//             setMarked(res?.data?.list);
//           }
//           if (res.data.result == "001") {
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [send, user, isLogin, getMoment]);

//   let arry = [];
//   const test = marked?.map((current) => {
//     if (current?.total_count == current.confirm_count) {
//       const markedDay = current?.schedule_date;
//       arry.push(markedDay);
//     }
//   });

//   const today = getMoment;
//   const firstWeek = today.clone().startOf("month").week();
//   const lastWeek =
//     today.clone().endOf("month").week() === 1
//       ? 53
//       : today.clone().endOf("month").week();

//   const calendarArr = () => {
//     let result = [];
//     let week = firstWeek;

//     for (week; week <= lastWeek; week++) {
//       result = result.concat(
//         <Week key={week}>
//           {Array(7)
//             .fill(0)
//             .map((data, index) => {
//               let days = today
//                 .clone()
//                 .startOf("year")
//                 .week(week)
//                 .startOf("week")
//                 .add(index, "day"); //d로해도되지만 직관성

//               if (arry.includes(days.format("YYYY-MM-DD")) == true) {
//                 return (
//                   <Day key={index}>
//                     <Container>
//                       {moment().format("YYYY-MM-DD") ===
//                       days.format("YYYY-MM-DD") ? (
//                         <Wrap key={index}>
//                           <TodayTitle>{days.format("D")}</TodayTitle>
//                         </Wrap>
//                       ) : (
//                         <DayTitle>{days.format("D")}</DayTitle>
//                       )}
//                     </Container>
//                   </Day>
//                 );
//               }
//               if (
//                 moment().format("YYYY-MM-DD") === days.format("YYYY-MM-DD") &&
//                 days.format("MM") == today.format("MM")
//               ) {
//                 return (
//                   <Day key={index}>
//                     <TodayWrap>
//                       <TodayTitle>{days.format("D")}</TodayTitle>
//                     </TodayWrap>
//                   </Day>
//                 );
//               } else if (days.format("MM") !== today.format("MM")) {
//                 return (
//                   <Day key={index}>
//                     <DayTitle>{days.format("D")}</DayTitle>
//                   </Day>
//                 );
//               } else {
//                 return (
//                   <Day key={index}>
//                     <DayTitle color={"#fff"}>{days.format("D")}</DayTitle>
//                   </Day>
//                 );
//               }
//             })}
//         </Week>
//       );
//     }
//     return result;
//   };

//   return (
//     <CalendarWrap>
//       <View>
//         <Header>
//           <TouchableOpacity
//             hitSlop={{ top: 40, right: 40, bottom: 40, left: 40 }}
//             disabled={getMoment.format("YYYY-MM") == startDate}
//             onPress={() => {
//               setMoment(getMoment.clone().subtract(1, "month"));
//             }}
//           >
//             <AntDesign name="left" size={20} color="#ffffff" />
//           </TouchableOpacity>
//           <HeaderTtile>{today.format("YYYY 년 MM 월")}</HeaderTtile>
//           <TouchableOpacity
//             hitSlop={{ top: 40, right: 40, bottom: 40, left: 40 }}
//             onPress={() => {
//               setMoment(getMoment.clone().add(1, "month"));
//             }}
//           >
//             <AntDesign name="right" size={20} color="#ffffff" />
//           </TouchableOpacity>
//         </Header>
//       </View>
//       <Week>
//         {weekList.map((i, k) => {
//           return (
//             <WeekList key={k}>
//               <WeekTitle>{i}</WeekTitle>
//             </WeekList>
//           );
//         })}
//       </Week>

//       <DayWrap>
//         <View>{calendarArr()}</View>
//       </DayWrap>
//     </CalendarWrap>
//   );
// };

// const CalendarWrap = styled(View)`
//   width: 100%;
//   height: 70%;
//   margin-top: 10px;
// `;
// const Header = styled(View)`
//   width: 100%;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: space-around;
//   margin: 10px auto;
// `;

// const HeaderTtile = styled(Text)`
//   font-size: 20px;
//   font-weight: 600;
// `;

// const DayWrap = styled(View)`
//   width: 100%;
//   height: 50%;
//   margin: 3px auto;
// `;

// const WeekTitle = styled(Text)`
//   font-size: 17px;
//   font-weight: 600;

//   margin: 10px auto;
// `;

// const Week = styled(View)`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   width: 95%;
//   margin: 0px auto;
// `;

// const WeekList = styled(View)`
//   display: flex;
//   align-items: center;
//   text-align: center;
//   width: 40px;
//   margin-top: 20px;
// `;

// const Day = styled(View)`
//   display: flex;
//   align-items: center;
//   text-align: center;
//   width: 40px;
//   height: 65px;
// `;

// const DayTitle = styled(Text)`
//   font-size: 17px;
//   margin: 6px 0;
//   color: ${(props) => props.color};
// `;

// const TodayWrap = styled(View)`
//   background-color: #fff;
//   width: 40px;
//   height: 40px;
//   border-radius: 100px;
//   display: flex;
//   align-items: center;
// `;

// const TodayTitle = styled(Text)`
//   font-size: 17px;
//   color: #000;
//   margin: auto;
// `;

// const Img = styled(Image)`
//   width: 26px;
//   height: 26px;
// `;

// const Container = styled(View)`
//   height: 68px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// `;

// const Wrap = styled(View)`
//   position: relative;
//   background-color: #fff;
//   width: 35px;
//   height: 35px;
//   border-radius: 100px;
//   display: flex;
//   align-items: center;
//   text-align: center;
// `;

// export default Calendar;
