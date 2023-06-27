import React, { useContext } from "react";
import { Image } from "react-native";
import styled from "styled-components";
import "react-native-gesture-handler";
import { UserStore } from "../context";
import { useEffect } from "react";

const MainUserProfile = ({ size }) => {
  const { profile } = useContext(UserStore);

  useEffect(() => {}, [profile]);

  return (
    <>
      {profile && profile?.userProfile == "null" ? (
        <Img
          size={size}
          source={require("../../assets/images/Profil/profil_10.png")}
        />
      ) : (
        <Img size={size} source={{ uri: profile?.userProfile }} />
      )}
    </>
  );
};

const Img = styled(Image)`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: 100px;
  margin-left: 10px;
  overflow: hidden;
`;

export default MainUserProfile;
