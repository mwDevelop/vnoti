import React, { useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import styled from "styled-components";

const DatePicker = ({ getDateDate, data, size, paddingSize }) => {
  const [selectedDate, setSelectedDate] = useState();
  const check = data ? true : false;
  const [first, setFirst] = useState(check);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const dateData = moment(date).format("YYYY-MM-DD");
    setDatePickerVisibility(false);
    setSelectedDate(date);
    getDateDate(dateData);
    setFirst(false);
  };

  return (
    <Container>
      <TimeContainer
        title="Show Date Picker"
        onPress={showDatePicker}
        paddingSize={paddingSize}
      >
        {selectedDate !== undefined ? (
          <BtnText color={"#000"} size={size}>{` ${moment(selectedDate).format(
            "YYYY-MM-DD"
          )}`}</BtnText>
        ) : first ? (
          <BtnText color={"#000"} size={size}>
            {data === "null" || data === "0000-00-00"
              ? "날짜를 선택해주세요!"
              : data}
          </BtnText>
        ) : (
          <BtnText color={"#A1A1A1"} size={size}>
            날짜를 선택해주세요!
          </BtnText>
        )}
      </TimeContainer>

      <DateTimePickerModal
        mode="date"
        isVisible={isDatePickerVisible}
        maximumDate={new Date(moment().format("YYYY-MM-DD"))}
        setSelectedDate={setSelectedDate}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        locale={"ko"}
        cancelTextIOS={"취소하기"}
        confirmTextIOS={"완료하기"}
      />
    </Container>
  );
};

const Container = styled(View)`
  width: 60%;
`;

const TimeContainer = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  width: 100%;
  border-radius: 10px;
  background-color: "#fff";
  padding: ${(props) => props.paddingSize};
`;

const BtnText = styled(Text)`
  width: 100%;
  font-size: ${(props) => props.size};
  font-weight: ${(props) => (props.weight ? props.weight : "0")};
  color: ${(props) => props.color};
`;

export default DatePicker;
