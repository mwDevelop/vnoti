import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import theme from "../../shared/theme";
import moment from "moment";

const RewardHistory = ({ history, navigation, beg, end }) => {
  const onPressOpen = () => {
    navigation.navigate("PeriodSetting");
  };

  function format(e) {
    return moment(e).format("YYYY.MM.DD");
  }

  return (
    <History>
      <Top onPress={() => onPressOpen()}>
        <Font color="#A7A7A7" size="15px" weight="600">
          전체{" "}
          <Font color="#A7A7A7" size="15px" weight="500">
            l {format(beg)} - {format(end)}
          </Font>
        </Font>
      </Top>

      <SafeAreaView>
        <List>
          <View style={{ flex: 1 }}>
            <ScrollView>
              {history &&
                history.map((i, k) => {
                  return (
                    <Item key={k}>
                      <View>
                        <Font color="#444" size="16px">
                          {i.mbp_reason}
                        </Font>
                        <Font color="#A7A7A7" size="16px">
                          {format(i?.mbp_reg_dt)}
                        </Font>
                      </View>
                      <View>
                        <Font
                          color={theme.MainColor}
                          size="23px"
                          weight="weight"
                        >
                          {i.mbp_point}P
                        </Font>
                      </View>
                    </Item>
                  );
                })}
            </ScrollView>
          </View>
        </List>
      </SafeAreaView>
    </History>
  );
};

const History = styled(View)`
  height: 100%;
  position: relative;
`;

const Top = styled(TouchableOpacity)`
  width: 100%;

  padding: 10px 20px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-color: #e7e7e7;
`;

const List = styled(View)`
  width: 100%;
  height: 78%;
  margin-bottom: -100px;
`;

const Item = styled(View)`
  width: 100%;
  height: 75px;
  padding: 0px 20px;

  /* border-bottom: 1px; */
  /* border-style: dashed; */
  /* border-color: #e7e7e7;
  border-bottom-width: 1px; */

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Font = styled(Text)`
  font-size: ${(props) => props.size};
  font-weight: ${(props) =>
    props.weight === "600" ? "600" : props.weight === "500" ? "500" : "400"};
  color: ${(props) => props.color};
  line-height: 24px;
`;

const MothWrap = styled(View)`
  position: absolute;
  width: 80%;
  height: 60%;
  background-color: #ffb74d;

  z-index: 1000;
  border-radius: 20px;

  top: -10%;
  left: 10%;
`;

export default RewardHistory;
