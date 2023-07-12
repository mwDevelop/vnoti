import React from "react";
import { View } from "react-native";
import InfoUse from "./InfoUse";

const RequestInfo = ({ navigation }) => {
  const data = [
    {
      id: 0,
      img: require("../../../assets/images/Info/RequestInfo_01.png"),
    },
    {
      id: 1,
      img: require("../../../assets/images/Info/RequestInfo_02.png"),
    },
    {
      id: 2,
      img: require("../../../assets/images/Info/RequestInfo_03.png"),
    },
    {
      id: 3,
      img: require("../../../assets/images/Info/RequestInfo_04.png"),
    },
  ];

  return (
    <View>
      <InfoUse data={data} title={"내꺼볼래 받기"} navigation={navigation} />
    </View>
  );
};

export default RequestInfo;
