import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, Image, Alert } from "react-native";
import styled from "styled-components";
import moment from "moment/moment";
import { useState } from "react";
import apis from "../../shared/apis";

const ScheduleList = ({ data, noneClick, getModalData }) => {
  const timeA = moment(data?.schedule_dt).format("a ");
  const time = moment(data?.schedule_dt).format("hh:mm ");
  const medicineData = JSON.parse(data?.schedule_medicine);
  const guideline = medicineData?.medicine_guideline;
  const dose = medicineData?.medicine_dose;
  const shape = medicineData?.medicine_shape;

  const [confirm, setConfirm] = useState(data?.schedule_confirm);
  const schedule_id = data?.schedule_id;

  useEffect(() => {
    setConfirm(data.schedule_confirm);
  }, [data]);

  // const onPressConfirm = (e) => {
  //   setConfirm(e);

  //   const data = {
  //     schedule_confirm: e,
  //     point_yn: "y",
  //   };

  //   apis.postSchedule(schedule_id, data).then((res) => {
  //     const data = res.data.data;
  //     const value = e === 1 ? "오늘 복용 완료!" : "복용이 취소되었습니다.";
  //     if (res.data.result === "004") {
  //       getModalData(0, "open", value, "004");
  //     } else {
  //       getModalData(data?.get_point, "open", value, null);
  //     }
  //   });
  // };

  const onPressConfirm = (e) => {
    setConfirm(e);
    {
      e == "1"
        ? Alert.alert("복용 완료하였습니다!")
        : Alert.alert("복용 완료가 취소되었습니다.");
    }
    const data = {
      schedule_confirm: e,
    };
    apis.postSchedule(schedule_id, data).then((res) => {});
  };

  return (
    <Container>
      <TimeWrap>
        <Time>{timeA}</Time>
        <Time>{time}</Time>
      </TimeWrap>
      <Bg></Bg>
      <Wrap color={noneClick ? "#FFF9F1" : "#E7E7E7"}>
        <PillInfo>
          {shape === 1 ? (
            <Icon
              width="40px"
              height="40px"
              source={
                noneClick
                  ? require("../../../assets/images/pill_icon_01.png")
                  : require("../../../assets/images/pill_icon_01_1.png")
              }
              resizeMode="contain"
            />
          ) : shape === 2 ? (
            <Icon
              width="40px"
              height="40px"
              source={
                noneClick
                  ? require("../../../assets/images/pill_icon_03.png")
                  : require("../../../assets/images/pill_icon_03_1.png")
              }
              resizeMode="contain"
            />
          ) : (
            <Icon
              width="40px"
              height="40px"
              source={
                noneClick
                  ? require("../../../assets/images/pill_icon_02.png")
                  : require("../../../assets/images/pill_icon_02_1.png")
              }
              resizeMode="contain"
            />
          )}

          <InfoWrap>
            <Pill>{medicineData.medicine_name}</Pill>
            <Pill>
              {guideline === 1 ? "식전 " : guideline === 2 ? "식후 " : ""}
              {dose}
              {shape === 1 ? "알" : shape === 2 ? "포" : "스푼"} 복용
            </Pill>
          </InfoWrap>
        </PillInfo>

        {confirm === 1 ? (
          <Btn
            onPress={(e) => onPressConfirm(0, noneClick)}
            disabled={!noneClick}
          >
            <CheckIcon
              width="33px"
              height="33px"
              source={
                noneClick
                  ? require("../../../assets/images/checkcircle.png")
                  : require("../../../assets/images/checkcircle_G_D.png")
              }
              resizeMode="contain"
            />
          </Btn>
        ) : (
          <Btn
            onPress={(e) => onPressConfirm(1, noneClick)}
            disabled={!noneClick}
          >
            <CheckIcon
              width="33px"
              height="33px"
              source={require("../../../assets/images/check_icon_g.png")}
              resizeMode="contain"
            />
          </Btn>
        )}
      </Wrap>
    </Container>
  );
};

const Bg = styled(View)`
  background-color: #ffffff;
`;

const Wrap = styled(View)`
  position: relative;
  width: 80%;
  height: 90px;
  background-color: ${(props) => props.color};
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;

  padding-left: 8px;
`;

const Container = styled(View)`
  display: flex;
  flex-direction: row;
  text-align: center;
  align-items: center;

  margin-bottom: 15px;
`;

const TimeWrap = styled(View)`
  width: 18%;
  margin: 0px 7px;
`;

const Time = styled(Text)`
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;

  text-align: center;
  letter-spacing: -0.408px;

  color: #373737;
`;

const Icon = styled(Image)`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const CheckIcon = styled(Image)`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  margin-right: 10px;
`;

const PillInfo = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const InfoWrap = styled(View)`
  display: flex;
  margin-left: 10px;
`;
const Pill = styled(Text)`
  font-size: 20px;
  font-weight: 500;
`;

const Btn = styled(TouchableOpacity)`
  position: absolute;
  right: 5%;
`;

export default ScheduleList;
