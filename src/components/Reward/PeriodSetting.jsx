import React from "react";
import { View } from "react-native";
import UseInfoHeader from "../../elements/UseInfoHeader";
import CalendarPeriod from "./CalendarPeriod";
import styled from "styled-components";

const PeriodSetting = ({ navigation }) => {
  return (
    <Wrap>
      <UseInfoHeader title="날짜 설정" navigation={navigation} />
      <CalendarPeriod navigation={navigation} />
    </Wrap>
  );
};

const Wrap = styled(View)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export default PeriodSetting;
