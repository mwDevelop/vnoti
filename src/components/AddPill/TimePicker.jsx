import React, { useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import "moment/locale/ko";
import styled from "styled-components";

const TimePicker = ({ getTimeData, width, time, value }) => {
  const [selectedTime, setSelectedTime] = useState(time);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (time) => {
    const timeData = moment(time).format("HH:mm");
    setSelectedTime(timeData);
    getTimeData(timeData, value);
    hideDatePicker();
  };

  const dataTime = time == undefined ? "시간 설정" : time;

  const year = moment().format("yyyy");
  const month = moment().format("mm");
  const day = moment().format("DD");

  const timeSplit =
    selectedTime == undefined || selectedTime == "undefined"
      ? moment()
      : selectedTime?.split(":");

  const hh =
    selectedTime == undefined || selectedTime == "undefined"
      ? moment().format("hh")
      : timeSplit[0];
  const mm =
    selectedTime == undefined || selectedTime == "undefined"
      ? moment().format("mm")
      : timeSplit[1];

  return (
    <>
      <TimeContainer width={width} onPress={showDatePicker}>
        <BtnText>{` ${selectedTime ? selectedTime : dataTime}`}</BtnText>
      </TimeContainer>
      <DateTimePickerModal
        cancelTextIOS={"취소하기"}
        confirmTextIOS={"완료하기"}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        mode="time"
        // time={selectedTime}
        // valueData={value}
        isVisible={isDatePickerVisible}
        locale={"ko"}
        date={new Date(year, month, day, hh, mm)}
        minuteInterval={5}
      />
    </>
  );
};

const TimeContainer = styled(TouchableOpacity)`
  width: ${(props) => props.width};
  height: 60px;
  border-radius: 10px;
  font-size: 20px;
  background-color: ${(props) => (props.color ? props.color : "#fff")};
  margin: 0px 4% 3% 0;
`;

const BtnText = styled(Text)`
  font-size: 20px;
  margin: auto;
`;

export default TimePicker;
