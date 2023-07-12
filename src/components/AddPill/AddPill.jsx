import React, { useState, useContext } from "react";
import { Dimensions, ScrollView, Alert, View } from "react-native";

import TimePicker from "./TimePicker";
import apis from "../../shared/apis";
import theme from "../../shared/theme";
import moment from "moment/moment";
import { UserStore } from "../../context";
import SelectBox from "../../elements/SelectBox";
import {
  Flex,
  Wrap,
  Title,
  Input,
  Btn,
  BtnText,
  Container,
  IconImg,
  TitleWrap,
  SaveBtn,
} from "../Style/Pill";

const AddPill = ({ data, navigation }) => {
  const { setAdd, add } = useContext(UserStore);

  const subColor = `${theme.SubColor}`;
  const profile_id = data;

  const windowHeight = Dimensions.get("window").height;
  const Height = Math.floor(windowHeight);

  const [daySelected, setDaySeleted] = useState();
  const [selectedGuide, setSeletedGuide] = useState(false);
  const [selectedCount, setSelectedCount] = useState(1);
  const [inputs, setInputs] = useState({
    medicineName: "",
    medicineDose: "",
  });

  const [seletedTime, setSelectedTime] = useState();
  const [oneday, setOneday] = useState(false);
  const [cycleType, setCycleTpye] = useState("");

  const { medicineName, medicineDose } = inputs;

  const onChange = (keyvalue, e) => {
    setInputs({
      ...inputs,
      [keyvalue]: e,
    });
  };

  const dayData = ["1", "2", "3"];

  const guideData = [
    { title: "식전", value: "1" },
    { title: "식후", value: "2" },
    { title: "상관없음", value: "3" },
  ];

  const countOptions = [
    { label: "알/정", value: "1" },
    { label: "포", value: "2" },
    { label: "스푼", value: "3" },
  ];

  //일일횟수
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

  const [timeData] = useState();
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

  const addMedicine = () => {
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
      medicine_shape: `${selectedCount}`,
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
          <View style={{ width: "48%", height: 60 }}>
            <SelectBox
              data={countOptions}
              setSelectedCount={setSelectedCount}
              placeholder="복용량"
              top={"65px"}
            />
          </View>
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
            <Flex>
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
            </Flex>
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

export default AddPill;
