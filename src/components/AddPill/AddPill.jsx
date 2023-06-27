import React, { useState, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import styled from "styled-components";
import DropDownPicker from "react-native-dropdown-picker";
import TimePicker from "./TimePicker";
import apis from "../../shared/apis";
import theme from "../../shared/theme";
import moment from "moment/moment";
import { UserStore } from "../../context";

const AddPill = ({ data, navigation }) => {
  const { setAdd, add } = useContext(UserStore);

  const subColor = `${theme.SubColor}`;

  const profile_id = data;

  const windowHeight = Dimensions.get("window").height;
  const Height = Math.floor(windowHeight) + 100;

  const [inputs, setInputs] = useState({
    medicineName: "",
    medicineDose: "",
  });

  const { medicineName, medicineDose } = inputs;

  const onChange = (keyvalue, e) => {
    setInputs({
      ...inputs,
      [keyvalue]: e,
    });
  };

  const [daySelected, setDaySeleted] = useState();

  //가이드

  const [selectedGuide, setSeletedGuide] = useState(false);
  const [openCountBox, setOpenCountBox] = useState(false);
  const [selectedCount, setSelectedCount] = useState(null);
  const [countOptions, setCountOptions] = useState([
    { label: "알/정", value: "1" },
    { label: "포", value: "2" },
    { label: "스푼", value: "3" },
  ]);

  const [seletedTime, setSelectedTime] = useState();

  const dayData = ["1", "2", "3"];

  const guideData = [
    { title: "식전", value: "1" },
    { title: "식후", value: "2" },
    { title: "상관없음", value: "3" },
  ];

  const [oneday, setOneday] = useState(false);
  const [onedayTime, setOnedayTime] = useState(false);
  const [openGuide, setOpenGuide] = useState(false);
  const [cycleType, setCycleTpye] = useState("");

  //일일횟수
  const checkday = (e) => {
    setOneday(!oneday);
    setOnedayTime(false);
    setOpenGuide(false);
    setCycleTpye(1);
  };

  const onPressTitle = (i) => {
    setOneday(true);
    setCycleTpye(1);
    setDaySeleted(i);
    if (i == 1) {
      setSelectedTime("24");
    } else {
      setSelectedTime(null);
    }
  };

  const onPresSelectedGuide = (e) => {
    setSeletedGuide(e);
  };

  const dayArray = Array.from({ length: daySelected }, (_, i) => i + 1);

  // 자식 => 부모 (시간,날짜 DATA)

  const [timeData, setTimeData] = useState();

  const [one, setOne] = useState();
  const [two, setTwo] = useState();
  const [three, setThree] = useState();
  const getTimeData = (timeData, value) => {
    if (value == 1) {
      setOne(timeData);
    } else if (value == 2) {
      setTwo(timeData);
    } else {
      setThree(timeData);
    }
  };
  const dateData = moment().format("YYYY-MM-DD");

  const addMedicine = ({ daySelected }) => {
    const NewArray = [];
    NewArray.push(one, two, three);

    const timeArray = [];
    for (let i = 0; i <= timeArray.length; i++) {
      if (NewArray[i] !== undefined) {
        timeArray.push(NewArray[i]);
      }
    }

    if (medicineName == "") {
      Alert.alert("이름을 입력해주세요!");
    } else if (medicineDose == "") {
      Alert.alert("복용량을 입력해주세요!");
    } else if (timeArray?.length == 0) {
      Alert.alert("시간을 선택해주세요!");
    }

    const addData = {
      medicine_profile_id: `${profile_id}`,
      medicine_name: `${medicineName}`,
      medicine_shape: `${!!!selectedCount ? "1" : selectedCount}`,
      medicine_guideline: `${selectedGuide}`,
      medicine_dose: `${medicineDose}`,
      medicine_cycle_type: `${cycleType}`,
      medicine_cycle: `${seletedTime}`,
      medicine_time: timeArray,
      medicine_start_date: `${dateData}`,
    };

    apis
      .putMedicine(addData)
      .then((res) => {
        if (res.data.result === "000") {
          setAdd(add + 1);
          navigation.navigate("약");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ScrollView nestedScrollEnabled>
      <Wrap windowHeight={`${Height}px`}>
        <Title>약 정보</Title>

        <Input
          placeholder="이름"
          width="100%"
          height="60px"
          onChangeText={(e) => onChange("medicineName", e)}
          name="medicineName"
          value={medicineName}
        />
        <Container direction="row" style={{ zIndex: 2000 }}>
          <Input
            placeholder="복용량"
            width="50%"
            height="60px"
            keyboardType="number-pad"
            name="medicineDose"
            value={medicineDose}
            onChangeText={(e) => onChange("medicineDose", e)}
          />

          <SelectBox
            placeholder={"복용량"}
            open={openCountBox}
            value={selectedCount}
            items={countOptions}
            setOpen={setOpenCountBox}
            setValue={setSelectedCount}
            setItems={setCountOptions}
            containerStyle={{
              width: "48%",
              shadowColor: openCountBox == true ? "#3d3d3d" : "#fff",
              shadowOffset:
                openCountBox == true
                  ? { width: 3, height: 3 }
                  : { width: 0, height: 0 },
              shadowOpacity: openCountBox == true ? 0.2 : 0,
            }}
            textStyle={{
              fontSize: 17,
            }}
            dropDownContainerStyle={{
              zIndex: 1000,
              borderColor: "#ffffff",
              backgroundColor: "#ffffff",
              paddingLeft: "5%",
              paddingRight: "5%",
            }}
            placeholderStyle={{ fontSize: 17 }}
          />
        </Container>
        {/* 시간 정보  입력*/}
        <TitleWrap>
          <Title>일일 횟수/시간</Title>
          <IconImg
            source={require("../../../assets/images/clock.png")}
            resizeMode="contain"
          />
        </TitleWrap>

        {/* 일일 횟수 선택 */}

        <Container direction="row">
          {dayData.map((i, k) => {
            return (
              <Btn
                width="31%"
                key={i}
                onPress={(e) => {
                  onPressTitle(i);
                }}
                change={daySelected === i ? "change" : ""}
              >
                <BtnText color={daySelected === i ? subColor : "#000"}>
                  {i}회
                </BtnText>
              </Btn>
            );
          })}
        </Container>

        {oneday ? (
          <>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {dayArray.map((i, k) => {
                return (
                  <TimePicker
                    key={k}
                    timeData={timeData}
                    getTimeData={getTimeData}
                    width={"31%"}
                    data={dayArray}
                    value={i}
                  />
                );
              })}
            </View>
          </>
        ) : (
          ""
        )}

        <Title>섭취 방법</Title>
        <Container direction="row">
          {guideData.map((i, k) => {
            return (
              <Btn
                width="31%"
                key={k}
                color={"#fff"}
                onPress={(e) => {
                  onPresSelectedGuide(i.value);
                }}
                change={selectedGuide === i.value ? "change" : ""}
              >
                <BtnText color={selectedGuide === i.value ? subColor : "#000"}>
                  {i.title}
                </BtnText>
              </Btn>
            );
          })}
        </Container>

        <SaveBtn width="100%" color={subColor} onPress={addMedicine}>
          <BtnText color={"#fff"} weight={"700"}>
            저장
          </BtnText>
        </SaveBtn>
      </Wrap>
    </ScrollView>
  );
};

const Wrap = styled(View)`
  width: 100%;
  height: ${(props) => props.windowHeight};
  padding: 0 20px;
  z-index: -100;
  background-color: #f5f5f5;
  margin-bottom: 30px;
`;

const Title = styled(Text)`
  font-size: 23px;
  font-weight: 600;
  color: #444;
  margin: 15px 0;
`;

const Input = styled(TextInput)`
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  border-radius: 10px;
  font-size: 20px;
  background-color: #fff;
  margin-bottom: 10px;
  padding: 10px 15px;
`;

const Btn = styled(TouchableOpacity)`
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

const BtnText = styled(Text)`
  font-size: 20px;
  font-weight: ${(props) => (props.weight ? props.weight : "0")};
  color: ${(props) => props.color};
`;

const Container = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: ${(props) => props.direction};

  justify-content: space-between;
  align-items: center;
  align-content: center;
`;

const SelectBox = styled(DropDownPicker)`
  border: none;

  height: 60px;

  border-radius: 10px;
  font-size: 20px;
  background-color: #fff;
  margin-bottom: 10px;
  padding: 0px 15px;
`;

const IconImg = styled(Image)`
  width: 18px;
  height: 18px;
  margin-left: 10px;
`;

const TitleWrap = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SaveBtn = styled(TouchableOpacity)`
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
export default AddPill;
