import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import styled from "styled-components";
import theme from "../../shared/theme";
import ShareBtn from "../../elements/ShareBtn";

const ApplicationShare = ({ navigation, route }) => {
  return (
    <Wrap>
      <Container>
        <Title>
          <Bolder>{route?.params?.name}</Bolder>님에게
        </Title>
        <TitleWrap>
          <ShareBtn />
          <Title>완료했어요!</Title>
        </TitleWrap>
        <ImgWrap>
          <LogoImg
            source={require("../../../assets/images/shareLogo.png")}
            resizeMode={"contain"}
          />
        </ImgWrap>
      </Container>
      <Btn
        mainColor={theme.MainColor}
        onPress={() =>
          navigation.reset({ routes: [{ name: "DrawerComponent" }] })
        }
      >
        <BtnText>확인</BtnText>
      </Btn>
    </Wrap>
  );
};

const Wrap = styled(View)`
  background-color: #ffffff;
  height: 100%;
`;

const Container = styled(View)`
  height: 70%;
  margin: auto;
`;

const TitleWrap = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: 30px;
  margin: 5px auto;
`;

const Bolder = styled(Text)`
  font-size: 33px;
  font-weight: 600;
`;
const ImgWrap = styled(View)`
  position: relative;
  margin-top: 30%;
`;

const LogoImg = styled(Image)`
  width: 250px;
  height: 250px;
  margin: auto;
`;

const Btn = styled(TouchableOpacity)`
  width: 90%;
  height: 55px;
  background-color: ${(props) => props.mainColor};

  position: absolute;
  bottom: 80px;
  left: 20px;
  border-radius: 10px;
`;

const BtnText = styled(Text)`
  font-size: 25px;
  color: #fff;
  margin: auto;
`;
export default ApplicationShare;
