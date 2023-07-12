import React from "react";
import { Image } from "react-native";
import styled from "styled-components";
import "react-native-gesture-handler";

const ProfilImg = ({ size, url }) => {
  return (
    <>
      {url !== "null" ? (
        <Img size={size} source={{ uri: url }} />
      ) : (
        <Img
          size={size}
          resizeMode="contain"
          source={require("../../assets/images/Profil/profil_10.png")}
        />
      )}
    </>
  );
};

const Img = styled(Image)`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: 100px;
  margin-left: 10px;
`;

export default ProfilImg;
