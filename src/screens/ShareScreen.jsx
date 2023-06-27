import React from "react";

import { View } from "react-native";
import styled from "styled-components";

import SendShare from "../components/Share/SendShare";

const ShareScreen = ({ navigation }) => {
  return (
    <Wrap>
      <SendShare navigation={navigation} />
    </Wrap>
  );
};

const Wrap = styled(View)`
  width: 100%;
  height: 100%;

  background-color: ${(props) => props.theme.MainColor};
`;

export default ShareScreen;
