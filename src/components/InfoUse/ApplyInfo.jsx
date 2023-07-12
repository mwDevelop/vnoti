import React from "react";
import { View } from "react-native";
import InfoUse from "./InfoUse";

const ApplyInfo = ({ navigation }) => {
  const data = [
    {
      id: 0,
      img: require("../../../assets/images/Info/ApplyInfo_01.png"),
    },
    {
      id: 1,
      img: require("../../../assets/images/Info/ApplyInfo_02.png"),
    },
    {
      id: 2,
      img: require("../../../assets/images/Info/ApplyInfo_03.png"),
    },
    {
      id: 3,
      img: require("../../../assets/images/Info/ApplyInfo_04.png"),
    },
  ];

  return (
    <View>
      <InfoUse data={data} title={"내꺼볼래 신청"} navigation={navigation} />
    </View>
  );
};

export default ApplyInfo;
