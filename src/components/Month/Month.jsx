import React, { useState, useEffect, useContext } from "react";
import moment from "moment/moment";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styled from "styled-components";
import apis from "../../shared/apis";
import { UserStore } from "../../context";

const Month = ({ navigation }) => {
  const { user, isLogin, send } = useContext(UserStore);
  useEffect(() => {}, [send]);
  const [getMoment, setMoment] = useState(moment());
  const [marked, setMarked] = useState([]);

  const startDate = moment().subtract(2, "months").format("YYYY-MM");

  const weekList = ["일", "월", "화", "수", "목", "금", "토"];

  useEffect(() => {
    if (isLogin == false) {
      setMarked(null);
    } else if (!!user) {
      setMarked(null);
      const schedule_profile_id = `${user?.userProfileId}`;
      const schedule_start_date = moment(getMoment)
        .startOf("month")
        .format("YYYY-MM-DD");
      const schedule_end_date = moment(getMoment)
        .endOf("month")
        .format("YYYY-MM-DD");

      apis
        .getMonthlyCount(
          schedule_profile_id,
          schedule_start_date,
          schedule_end_date
        )
        .then((res) => {
          if (res.data.result == "000") {
            setMarked(res?.data?.list);
          }
          if (res.data.result == "001") {
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [send, user, isLogin, getMoment]);

  const onPressSchedule = (days) => {
    navigation.navigate("스케줄", {
      day: days,
      click: moment().format("YYYY-MM-DD") > days.format("YYYY-MM-DD"),
    });
  };

  let arry = [];

  const markedArray = marked?.map((current) => {
    if (current?.total_count == current.confirm_count) {
      const markedDay = current?.schedule_date;
      arry.push(markedDay);
    }
  });

  const today = getMoment;
  const firstWeek = today.clone().startOf("month").week();
  const lastWeek =
    today.clone().endOf("month").week() === 1
      ? 53
      : today.clone().endOf("month").week();

  const calendarArr = () => {
    let result = [];
    let week = firstWeek;

    for (week; week <= lastWeek; week++) {
      result = result.concat(
        <Week key={week}>
          {Array(7)
            .fill(0)
            .map((data, index) => {
              let days = today
                .clone()
                .startOf("year")
                .week(week)
                .startOf("week")
                .add(index, "day"); //d로해도되지만 직관성

              if (arry.includes(days.format("YYYY-MM-DD")) == true) {
                return (
                  <TouchableWithoutFeedback
                    onPress={() => onPressSchedule(days)}
                    key={index}
                    disabled={!isLogin}
                  >
                    <Day>
                      <Container>
                        {moment().format("YYYY-MM-DD") ===
                        days.format("YYYY-MM-DD") ? (
                          <Wrap key={index}>
                            <TodayTitle>{days.format("D")}</TodayTitle>
                          </Wrap>
                        ) : (
                          <DayTitle color={"#fff"}>{days.format("D")}</DayTitle>
                        )}

                        <Img
                          source={require("../../../assets/images/check_icon.png")}
                        />
                      </Container>
                    </Day>
                  </TouchableWithoutFeedback>
                );
              } else {
                return (
                  <TouchableWithoutFeedback
                    key={index}
                    onPress={() => onPressSchedule(days)}
                    disabled={!isLogin}
                  >
                    <Day>
                      {moment().format("YYYY-MM-DD") ===
                        days.format("YYYY-MM-DD") &&
                      days.format("MM") == today.format("MM") ? (
                        <TodayWrap>
                          <TodayTitle>{days.format("D")}</TodayTitle>
                        </TodayWrap>
                      ) : (
                        <DayTitle
                          color={
                            days.format("MM") !== today.format("MM")
                              ? "#ffb74d"
                              : "#fff"
                          }
                        >
                          {days.format("D")}
                        </DayTitle>
                      )}
                    </Day>
                  </TouchableWithoutFeedback>
                );
              }
            })}
        </Week>
      );
    }
    return result;
  };

  return (
    <Calendar>
      <View>
        <Header>
          <TouchableOpacity
            hitSlop={{ top: 40, right: 40, bottom: 40, left: 40 }}
            disabled={getMoment.format("YYYY-MM") == startDate}
            onPress={() => {
              setMoment(getMoment.clone().subtract(1, "month"));
            }}
          >
            <AntDesign name="left" size={20} color="#ffffff" />
          </TouchableOpacity>
          <HeaderTtile>{today.format("YYYY 년 MM 월")}</HeaderTtile>
          <TouchableOpacity
            hitSlop={{ top: 40, right: 40, bottom: 40, left: 40 }}
            onPress={() => {
              setMoment(getMoment.clone().add(1, "month"));
            }}
          >
            <AntDesign name="right" size={20} color="#ffffff" />
          </TouchableOpacity>
        </Header>
      </View>
      <Week>
        {weekList.map((i, k) => {
          return (
            <WeekList key={k}>
              <WeekTitle>{i}</WeekTitle>
            </WeekList>
          );
        })}
      </Week>

      <DayWrap>
        <View>{calendarArr()}</View>
      </DayWrap>
    </Calendar>
  );
};

const Calendar = styled(View)`
  width: 100%;
  height: 70%;
  margin-top: 10px;
`;
const Header = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin: 10px auto;
`;

const HeaderTtile = styled(Text)`
  font-size: 20px;
  font-weight: 600;
  color: #fff;
`;

const DayWrap = styled(View)`
  width: 100%;
  height: 60%;
  margin: 3px auto;
`;

const WeekTitle = styled(Text)`
  font-size: 17px;
  font-weight: 600;
  color: #fff;
  margin: 0 auto;
`;

const Week = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 95%;
  margin: 0px auto;
`;

const WeekList = styled(View)`
  display: flex;
  align-items: center;
  text-align: center;
  width: 40px;
  margin-top: 30px;
`;

const Day = styled(View)`
  display: flex;
  align-items: center;
  text-align: center;
  width: 40px;
  height: 75px;
`;

const DayTitle = styled(Text)`
  font-size: 17px;
  margin: 6px 0;
  color: ${(props) => props.color};
`;

const TodayWrap = styled(View)`
  background-color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  display: flex;
  align-items: center;
`;

const TodayTitle = styled(Text)`
  font-size: 17px;
  color: #000;
  margin: auto;
`;

const Img = styled(Image)`
  width: 26px;
  height: 26px;
`;

const Container = styled(View)`
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Wrap = styled(View)`
  position: relative;
  background-color: #fff;
  width: 35px;
  height: 35px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  text-align: center;
`;

export default Month;

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

// const Month = ({ navigation }) => {
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

//   const onPressSchedule = ({ days }) => {
//     console.log(days);
//     navigation.navigate("스케줄", {
//       day: days,
//       click: moment().format("YYYY-MM-DD") > days.format("YYYY-MM-DD"),
//     });
//   };

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
//                   <TouchableWithoutFeedback
//                     onPress={(e) => onPressSchedule(days)}
//                     key={index}
//                     disabled={isLogin}
//                   >
//                     <Day>
//                       {arry.includes(days.format("YYYY-MM-DD")) == true ? (
//                         <Container>
//                           {moment().format("YYYY-MM-DD") ===
//                           days.format("YYYY-MM-DD") ? (
//                             <Wrap key={index}>
//                               <TodayTitle>{days.format("D")}</TodayTitle>
//                             </Wrap>
//                           ) : (
//                             <DayTitle color={"#fff"}>
//                               {days.format("D")}
//                             </DayTitle>
//                           )}

//                           <Img
//                             source={require("../../../assets/images/check_icon.png")}
//                           />
//                         </Container>
//                       ) : moment().format("YYYY-MM-DD") ===
//                           days.format("YYYY-MM-DD") &&
//                         days.format("MM") == today.format("MM") ? (
//                         <TodayWrap>
//                           <TodayTitle>{days.format("D")}</TodayTitle>
//                         </TodayWrap>
//                       ) : (
//                         ""
//                       )}
//                     </Day>
//                   </TouchableWithoutFeedback>
//                 );
//               } else if (days.format("MM") !== today.format("MM")) {
//                 return (
//                   <TouchableWithoutFeedback
//                     key={index}
//                     onPress={(e) => onPressSchedule(days)}
//                     disabled={isLogin}
//                   >
//                     <Day>
//                       <DayTitle color={theme.MainColor}>
//                         {days.format("D")}
//                       </DayTitle>
//                     </Day>
//                   </TouchableWithoutFeedback>
//                 );
//               } else {
//                 return (
//                   <TouchableWithoutFeedback
//                     key={index}
//                     onPress={(e) => onPressSchedule(days)}
//                     disabled={isLogin}
//                   >
//                     <Day>
//                       <DayTitle color={"#fff"}>{days.format("D")}</DayTitle>
//                     </Day>
//                   </TouchableWithoutFeedback>
//                 );
//               }
//             })}
//         </Week>
//       );
//     }
//     return result;
//   };

//   return (
//     <Calendar>
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
//     </Calendar>
//   );
// };

// const Calendar = styled(View)`
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
//   color: #fff;
// `;

// const DayWrap = styled(View)`
//   width: 100%;
//   height: 50%;
//   margin: 3px auto;
// `;

// const WeekTitle = styled(Text)`
//   font-size: 17px;
//   font-weight: 600;
//   color: #fff;
//   margin: 0 auto;
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

// export default Month;
