import React, { useContext } from "react";
import { Image } from "react-native";
import styled from "styled-components";
import "react-native-gesture-handler";
import { UserStore } from "../context";
import { useEffect } from "react";

const ProfilImg = ({ size }) => {
  const { user, profile, isLogin } = useContext(UserStore);

  useEffect(() => {}, [user, profile, isLogin]);

  return (
    <>
      {user?.userProfile !== null ? (
        <Img size={size} source={{ uri: user?.userProfile }} />
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
