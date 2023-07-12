import React, { useState, useContext } from "react";
import { View, Dimensions, ScrollView, Alert } from "react-native";
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
import apis from "../../shared/apis";
import TimePicker from "../AddPill/TimePicker";
import { UserStore } from "../../context";
import theme from "../../shared/theme";
import SelectBox from "../../elements/SelectBox";

const EditPill = ({ navigation, editData }) => {
  const subColor = `${theme.SubColor}`;
  const { setAdd, add } = useContext(UserStore);
  const windowHeight = Math.floor(Dimensions.get("window").height + 50);

  const countOptions = [
    { label: "알/정", value: "1" },
    { label: "포", value: "2" },
    { label: "스푼", value: "3" },
  ];
  const dayData = ["1", "2", "3"];

  const guideData = [
    { title: "식전", value: "1" },
    { title: "식후", value: "2" },
    { title: "상관없음", value: "3" },
  ];

  // 약물 수정
  const [edit, setEdit] = useState({
    eidtName: editData?.medicine_name,
    editDose: String(editData?.medicine_dose),
    editShape: editData?.medicine_shape,
    editType: editData?.medicine_cycle_type,
    editCycle: editData?.medicine_cycle,
    editGuide: editData?.medicine_guideline,
    editDate: editData?.medicine_start_date,
    editTime: editData?.medicine_time,
    editProfileId: editData?.medicine_profile_id,
    editMedicineId: editData?.medicine_id,
  });

  const {
    eidtName,
    editDose,
    editShape,
    editType,
    editCycle,
    editGuide,
    editTime,
    editMedicineId,
  } = edit;

  const time = JSON.parse(editTime);

  const [daySelected, setDaySeleted] = useState(time);
  const [selectedGuide, setSeletedGuide] = useState(editGuide);
  const [selectedCount, setSelectedCount] = useState();
  const [seletedTime, setSelectedTime] = useState(editCycle);
  const [cycleType, setCycleTpye] = useState(editType);
  const [one, setOne] = useState(time[0]);
  const [two, setTwo] = useState(time[1]);
  const [three, setThree] = useState(time[2]);

  const onChangeEdit = (keyvalue, e) => {
    setEdit({
      ...edit,
      [keyvalue]: e,
    });
  };

  const onPresSelectedGuide = (e) => {
    setSeletedGuide(e);
  };

  const onPressTitle = (i) => {
    const dayArray = Array.from({ length: i }, (now) => now);

    setDaySeleted(dayArray);

    if (i == 1) {
      setSelectedTime("24");
      setTwo();
      setThree();
    } else if (i == 2) {
      setThree();
    }
  };

  const getTimeData = (timeData, value, daySelected) => {
    if (value == 1) {
      setOne(timeData);
    } else if (value == 2) {
      setTwo(timeData);
    } else {
      setThree(timeData);
    }
  };

  const editMedicine = () => {
    const NewArray = [];
    NewArray.push(one, two, three);

    const timeArray = [];
    for (let i = 0; i <= timeArray.length; i++) {
      if (NewArray[i] !== undefined) {
        timeArray.push(NewArray[i]);
      }
    }

    const addData = {
      medicine_name: `${eidtName}`,
      medicine_shape: selectedCount == undefined ? editShape : selectedCount,
      medicine_guideline: `${selectedGuide}`,
      medicine_dose: `${editDose}`,
      medicine_cycle_type: `${cycleType}`,
      medicine_cycle: `${seletedTime}`,
      medicine_time: timeArray,
    };

    const medicine_id = `${editMedicineId}`;

    apis
      .editMedicine(medicine_id, addData)
      .then((res) => {
        if (res.data.result == "000") {
          setAdd(add + 1);
          navigation.navigate("MyPillScreen");
          Alert.alert("복용약이 수정되었습니다!");
        } else {
          Alert.alert("변경된 정보가 없습니다.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ScrollView nestedScrollEnabled>
      <Wrap windowHeight={`${windowHeight}px`}>
        {/* 약 정보  입력*/}

        <Title>약 정보</Title>

        <Input
          width="100%"
          height="60px"
          onChangeText={(e) => onChangeEdit("eidtName", e)}
          name="eidtName"
          value={eidtName}
        />

        <Container direction="row" style={{ zIndex: 2000 }}>
          <Input
            width="50%"
            height="60px"
            name="editDose"
            value={editDose}
            onChangeText={(e) => onChangeEdit("editDose", e)}
            keyboardType="number-pad"
          />
          <View style={{ width: "48%", height: 60 }}>
            <SelectBox
              data={countOptions}
              setSelectedCount={setSelectedCount}
              placeholder={countOptions[editShape - 1]?.label}
              top={"65px"}
            />
          </View>
        </Container>
        <TitleWrap>
          <Title>일일 횟수/시간</Title>
          <IconImg
            source={require("../../../assets/images/clock.png")}
            resizeMode="contain"
          />
        </TitleWrap>

        {cycleType == 1 ? (
          <Container direction="row">
            {dayData.map((i, k) => {
              return (
                <Btn
                  width="31%"
                  key={i}
                  onPress={(e) => {
                    onPressTitle(i);
                  }}
                  change={daySelected?.length == i ? "change" : ""}
                >
                  <BtnText color={daySelected?.length == i ? subColor : "#000"}>
                    {i}회
                  </BtnText>
                </Btn>
              );
            })}
          </Container>
        ) : (
          ""
        )}
        {
          <>
            <Flex>
              {daySelected?.map((i, k) => {
                return (
                  <TimePicker
                    key={k}
                    timeData={i}
                    getTimeData={getTimeData}
                    width={"31%"}
                    data={time}
                    time={i}
                    value={k + 1}
                  />
                );
              })}
            </Flex>
          </>
        }

        <Title>섭취 방법</Title>
        <Container direction="row">
          {guideData.map((i, k) => {
            return (
              <Btn
                width="31%"
                key={k}
                onPress={(e) => {
                  onPresSelectedGuide(i.value);
                }}
                change={selectedGuide == i.value ? "change" : ""}
              >
                <BtnText color={selectedGuide == i.value ? subColor : "#000"}>
                  {i.title}
                </BtnText>
              </Btn>
            );
          })}
        </Container>
        <SaveBtn width="100%" color={subColor} onPress={editMedicine}>
          <BtnText color={"#fff"} weight={"700"}>
            수정하기
          </BtnText>
        </SaveBtn>
      </Wrap>
    </ScrollView>
  );
};

export default EditPill;
