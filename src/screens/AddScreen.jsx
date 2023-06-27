import React, { useEffect, useContext } from "react";
import { Text, View, TouchableOpacity } from "react-native";

import styled from "styled-components";
import AddPill from "../components/AddPill/AddPill";
import EditPill from "../components/MyPill/EditPill";
import { UserStore } from "../context";
import { Ionicons } from "@expo/vector-icons";

const AddScreen = ({ navigation, route }) => {
  const { user } = useContext(UserStore);

  useEffect(() => {}, [user]);

  const editData = route.params.data;
  const value = route.params.value;

  return (
    <Wrap>
      <TopNav>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} color={"#FFAB48"} />
        </TouchableOpacity>
        <Title>{value ? "수정" : "추가"}</Title>
        <Title></Title>
      </TopNav>
      {value ? (
        <EditPill navigation={navigation} editData={editData} value={value} />
      ) : (
        <AddPill
          data={user?.userProfileId}
          navigation={navigation}
          value={value}
        />
      )}
    </Wrap>
  );
};

const Wrap = styled(View)`
  width: 100%;

  padding: 0 3px;
  background-color: #f5f5f5;
`;

const TopNav = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
  margin-left: 10px;
`;

const Title = styled(Text)`
  font-size: 23px;
  font-weight: 600;
  color: #ffab48;
  padding: 10px 10px 10px 0;
`;

export default AddScreen;
