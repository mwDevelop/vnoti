import React from "react";
import { View, SafeAreaView } from "react-native";
import styled from "styled-components";
import EditProfil from "../components/Profil/EditProfil";
import { StatusBar } from "expo-status-bar";

const EditScreen = ({ route }) => {
  const data = route.params.data;
  const color = "#f5f5f5";
  return (
    <Wrap>
      <StatusBar style={color} />
      <EditProfil data={data} />
      <Option></Option>
    </Wrap>
  );
};

const Wrap = styled(SafeAreaView)`
  background-color: #f5f5f5;
  width: 100%;
  height: 100%;
  padding: 50px 20px;
`;

const Option = styled(View)`
  background-color: #fff;
  width: 100%;
  height: 300px;
`;
export default EditScreen;
