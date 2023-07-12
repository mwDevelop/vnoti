import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import styled from "styled-components";
import { SimpleLineIcons } from "@expo/vector-icons";

const SelectBox = ({ data, setSelectedCount, placeholder, top }) => {
  const [selected, setSelected] = useState(placeholder);
  const [open, setOpen] = useState(false);

  const onPressOpiton = (e) => {
    setSelected(e.label);
    setSelectedCount(e.value);
    setOpen(false);
  };

  return (
    <Wrap>
      <SelectWrap onPress={() => setOpen(!open)} activeOpacity={2}>
        <Select>
          <Title>{selected}</Title>

          <SimpleLineIcons
            name={open ? "arrow-up" : "arrow-down"}
            size={17}
            color="black"
          />
        </Select>
      </SelectWrap>
      {open ? (
        <OptionList
          style={{
            shadowColor: "#3d3d3d",
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.4,
            elevation: 7,
          }}
          top={top}
        >
          {data?.map((i, k) => {
            return (
              <Option key={k} onPress={(e) => onPressOpiton(i)}>
                <Title>{i.label}</Title>
              </Option>
            );
          })}
        </OptionList>
      ) : (
        ""
      )}
    </Wrap>
  );
};

const Wrap = styled(View)`
  width: 100%;
`;

const SelectWrap = styled(TouchableOpacity)`
  position: relative;
  height: 100%;
  border-radius: 10px;
  font-size: 20px;
  background-color: #fff;

  padding: 0px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Select = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: 16px;
  color: #333;
  margin-right: 5px;
`;

const Option = styled(TouchableOpacity)`
  font-size: 16px;
  padding: 0px 15px;
  height: 40px;
  display: flex;
  justify-content: center;
`;

const OptionList = styled(View)`
  position: absolute;
  top: ${(props) => props.top};
  background-color: #fcfcfc;
  width: 100%;
  border-radius: 10px;
  font-size: 20px;
  display: flex;
  padding: 10px 0px;
`;

export default SelectBox;
