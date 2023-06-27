import React from "react";
import { TouchableOpacity, Image } from "react-native";

import styled from "styled-components";

const MainDrawer = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.openDrawer()}
      hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
    >
      <Icon
        source={require("../../../assets/images/drawer_icon.png")}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const Icon = styled(Image)`
  width: 25px;
  height: 25px;
`;

export default MainDrawer;
