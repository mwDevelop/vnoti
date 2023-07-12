import React, { useState } from "react";
import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import styled from "styled-components";
import theme from "../shared/theme";

const OnboardingScreen = ({ navigation }) => {
  const [pageIndex, setPageIndex] = useState(Number(0));

  const data = [
    {
      id: 0,
      img: require("../../assets/images/onboarding_01.png"),
      title: "이제 깜빡하는 일은 없을 거예요.",
      subTitle: "알림 설정을 통해 매 시간 복용타임을 알려드려요.",
    },
    {
      id: 1,
      img: require("../../assets/images/onboarding_02.png"),
      title: "친구, 가족들과 함께 공유해요.",
      subTitle: "프로필을 구독해서 복약을 서로 체크할 수 있어요.",
    },
    {
      id: 2,
      img: require("../../assets/images/onboarding_03.png"),
      title: "건강한 습관 만들어봐요.",
      subTitle: "바쁜 일상 속 챙기기 어려운 영양제 브이노티가 함께해요.",
    },
  ];

  return (
    <View style={styles.wrapper}>
      <Swiper
        showsButtons={false}
        showsPagination={true}
        activeDotColor={theme.MainColor}
        loop={false}
        onIndexChanged={(index) => {
          setPageIndex(index);
        }}
      >
        {data.map((i, k) => {
          return (
            <View style={styles.slide} key={k}>
              <Img resizeMode="contain" source={`${i.img}`} />
              <Text style={styles.title}>{i.title}</Text>
              <Text style={styles.text}>{i.subTitle}</Text>
            </View>
          );
        })}
      </Swiper>
      <SkipBtn
        onPress={() =>
          navigation.reset({ routes: [{ name: "MainNavigation" }] })
        }
      >
        <SubTitle size={"20px"}>건너뛰기</SubTitle>
      </SkipBtn>

      <Btn
        color={pageIndex === 2 ? "#ffab48" : "#D3D3D3 "}
        onPress={() =>
          navigation.reset({ routes: [{ name: "MainNavigation" }] })
        }
        disabled={pageIndex === 2 ? false : true}
      >
        <BtnTitle>시작하기</BtnTitle>
      </Btn>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { backgroundColor: "#fff", flex: 1 },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 900,
    paddingTop: 80,
    marginBottom: 80,
  },

  title: {
    color: "#000",
    fontSize: 25,
    fontWeight: "bold",
  },
  text: {
    color: "#000",
    fontSize: 17,
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: "#000",
  },
});

const Img = styled(Image)`
  width: 95%;
  height: 60%;
`;

const SubTitle = styled(Text)`
  font-size: ${(props) => props.size};
  color: #808080;
  margin-top: 10px;
`;

const Btn = styled(TouchableOpacity)`
  width: 90%;
  height: 55px;
  border-radius: 10px;
  background-color: ${(props) => props.color};
  margin: 10px auto 50px auto;
`;

const BtnTitle = styled(Text)`
  font-size: 18px;
  color: #fff;
  margin: auto;
`;

const SkipBtn = styled(TouchableOpacity)`
  position: absolute;
  top: 50px;
  right: 25px;
`;

export default OnboardingScreen;
