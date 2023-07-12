import React from "react";
import { View } from "react-native";
import InfoUse from "./InfoUse";

const LinkInfo = ({ navigation }) => {
  const [pageIndex, setPageIndex] = useState();
  const data = [
    {
      id: 0,
      img: require("../../../assets/images/Info/linkInfo_01.png"),
    },
    {
      id: 1,
      img: require("../../../assets/images/Info/linkInfo_02.png"),
    },
  ];

  return (
    <View>
      <InfoUse data={data} title={"프로필 연결"} navigation={navigation} />
    </View>
  );
};

export default LinkInfo;
