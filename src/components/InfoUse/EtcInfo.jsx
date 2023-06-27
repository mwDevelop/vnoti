import React, { useState } from "react";
import { Image, View, StyleSheet, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import styled from "styled-components";
import UseInfoHeader from "../../elements/UseInfoHeader";

const EtcInfo = ({ navigation }) => {
  const [pageIndex, setPageIndex] = useState();
  const data = [
    {
      id: 0,
      img: require("../../../assets/images/Info/etcInfo_01.png"),
    },
    {
      id: 1,
      img: require("../../../assets/images/Info/etcInfo_02.png"),
    },
    {
      id: 2,
      img: require("../../../assets/images/Info/etcInfo_03.png"),
    },
  ];

  return (
    <>
      <View style={styles.wrapper}>
        <UseInfoHeader title={"기타 기능 소개"} navigation={navigation} />
        <Swiper
          showsButtons={false}
          activeDotColor={"#ffab48"}
          loop={false}
          onIndexChanged={(index) => setPageIndex(index)}
        >
          {data.map((i, k) => {
            return (
              <View style={styles.slide} key={k}>
                <Img source={`${i.img}`} resizeMode="contian" />
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

export default EtcInfo;
