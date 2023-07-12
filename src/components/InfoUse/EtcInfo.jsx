import React from "react";
import { View } from "react-native";

import InfoUse from "./InfoUse";

const EtcInfo = ({ navigation }) => {
  const data = [
    {
      id: 0,
      img: require("../../../assets/images/Info/etcInfo_01.png"),
    },
    {
      id: 1,
      img: require("../../../assets/images/Info/etcInfo_02.png"),
    },
    {
      id: 2,
      img: require("../../../assets/images/Info/etcInfo_03.png"),
    },
  ];

  return (
    <View>
      <InfoUse data={data} title={"기타 기능 소개"} navigation={navigation} />
    </View>
  );
};

export default EtcInfo;
