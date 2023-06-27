import React, { useEffect, useContext } from "react";
import { View, Text } from "react-native";
import styled from "styled-components";
import { UserStore } from "../../context";

const DrawerUserInfo = ({}) => {
  const { profile } = useContext(UserStore);

  const userName = profile == null ? "" : profile?.userName;

  useEffect(() => {}, [profile]);

  return (
    <View>
      <UserInfo color={"#C1C1C1"} name={userName?.length < 5 ? "25px" : "20px"}>
        안녕하세요.
      </UserInfo>

      {profile == null ? (
        <UserInfo
          color={"#292929"}
          name={userName?.length < 5 ? "25px" : "20px"}
        >
          로그인을 해주세요!
        </UserInfo>
      ) : (
        profile && (
          <UserInfo
            color={"#292929"}
            name={userName?.length < 5 ? "25px" : "20px"}
          >
            {userName}
            <UserInfo
              color={"#C1C1C1"}
              name={userName?.length < 5 ? "25px" : "20px"}
            >
              님
            </UserInfo>
          </UserInfo>
        )
      )}
    </View>
  );
};

export default DrawerUserInfo;

const UserInfo = styled(Text)`
  font-size: ${(props) => props.name};
  color: ${(props) => props.color};
  font-weight: 600;
`;
