import React, { useState } from "react";
import { Image, View, StyleSheet, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import styled from "styled-components";
import UseInfoHeader from "../../elements/UseInfoHeader";

const LinkInfo = ({ navigation }) => {
  const [pageIndex, setPageIndex] = useState();
  const data = [
    {
      id: 0,
      img: require("../../../assets/images/Info/linkInfo_01.png"),
    },
    {
      id: 1,
      img: require("../../../assets/images/Info/linkInfo_02.png"),
    },
  ];

  return (
    <>
      <View style={styles.wrapper}>
        <UseInfoHeader title={"프로필 연결"} navigation={navigation} />
        <Swiper
          showsButtons={false}
          activeDotColor={"#ffab48"}
          loop={false}
          onIndexChanged={(index) => setPageIndex(index)}
        >
          {data.map((i, k) => {
            return (
              <View style={styles.slide} key={k}>
                <Img source={`${i.img}`} resizeMode="cover" />
              </View>
            );
          })}
        </Swiper>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: "100%", height: "100%", backgroundColor: "#3f3f3f" },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "#000",
    fontSize: Math.floor(Dimensions.get("window").height) > 695 ? 30 : 25,
    fontWeight: "bold",
  },
  text: {
    color: "#000",
    fontSize: Math.floor(Dimensions.get("window").height) > 695 ? 18 : 16,
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
  },
});

const Img = styled(Image)`
  width: 100%;
  height: 100%;
`;

export default LinkInfo;
