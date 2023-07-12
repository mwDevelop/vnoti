import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import styled from "styled-components";
export const Flex = styled(View)`
  display: flex;
  flex-direction: row;
`;

export const Wrap = styled(View)`
  width: 100%;
  height: ${(props) => props.windowHeight};
  padding: 0 20px;
  z-index: -100;
  background-color: #f5f5f5;
  margin-bottom: 30px;
`;

export const Title = styled(Text)`
  font-size: 23px;
  font-weight: 600;
  color: #444;
  margin: 15px 0;
`;

export const Input = styled(TextInput)`
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  border-radius: 10px;
  font-size: 20px;
  background-color: #fff;
  margin-bottom: 10px;
  padding: 10px 15px;
`;

export const Btn = styled(TouchableOpacity)`
  width: ${(props) => props.width};
  height: 60px;
  border-radius: 10px;
  font-size: 20px;
  background-color: ${(props) => (props.color ? props.color : "#ffffff")};
  border: ${(props) => (props.change ? "1px solid #FFAB48" : "#fff")};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

export const BtnText = styled(Text)`
  font-size: 20px;
  font-weight: ${(props) => (props.weight ? props.weight : "0")};
  color: ${(props) => props.color};
`;

export const Container = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: ${(props) => props.direction};

  justify-content: space-between;
  /* align-items: center; */
  align-content: center;
`;

export const IconImg = styled(Image)`
  width: 18px;
  height: 18px;
  margin-left: 10px;
`;

export const TitleWrap = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const SaveBtn = styled(TouchableOpacity)`
  width: ${(props) => props.width};
  height: 60px;
  border-radius: 10px;
  font-size: 20px;
  background-color: ${(props) => (props.color ? props.color : "#ffffff")};

  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
`;
