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
import apis from "../../shared/apis";
import TimePicker from "../AddPill/TimePicker";
import { UserStore } from "../../context";
import theme from "../../shared/theme";

const EditPill = ({ navigation, editData, value }) => {
  const subColor = `${theme.SubColor}`;
  const { user, setAdd, add } = useContext(UserStore);

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
    editDate,
    editTime,
    editProfileId,
    editMedicineId,
  } = edit;

  const time = JSON.parse(editTime);

  const onChangeEdit = (keyvalue, e) => {
    setEdit({
      ...edit,
      [keyvalue]: e,
    });
  };

  const [daySelected, setDaySeleted] = useState(time);

  const windowHeight = Math.floor(Dimensions.get("window").height + 50);

  //가이드

  const [selectedGuide, setSeletedGuide] = useState(editGuide);
  const [openCountBox, setOpenCountBox] = useState(false);
  const [selectedCount, setSelectedCount] = useState();
  const [countOptions, setCountOptions] = useState([
    { label: "알/정", value: "1" },
    { label: "포", value: "2" },
    { label: "스푼", value: "3" },
  ]);

  const [seletedTime, setSelectedTime] = useState(editCycle);
  const [timeSelected, setTimeSeleted] = useState(false);

  const dayData = ["1", "2", "3"];

  const guideData = [
    { title: "식전", value: "1" },
    { title: "식후", value: "2" },
    { title: "상관없음", value: "3" },
  ];
  const testData = [{ title: "일일횟수", value: "1" }];

  const [cycleType, setCycleTpye] = useState(editType);

  const onPresSelectedGuide = (e) => {
    setSeletedGuide(e);
  };

  const onPresSelecteType = (e) => {
    setCycleTpye(e);
  };

  // 자식 => 부모 (시간,날짜 DATA)

  const [timeData, setTimeData] = useState();

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

  const [one, setOne] = useState(time[0]);
  const [two, setTwo] = useState(time[1]);
  const [three, setThree] = useState(time[2]);

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

          <SelectBox
            style={{ zIndex: 1000 }}
            placeholder={countOptions[editShape - 1]?.label}
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
        {cycleType == 1 ? (
          <>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
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
            </View>
          </>
        ) : (
          ""
        )}

        {cycleType == 2 ? (
          <Container direction="row" style={{ zIndex: 2000 }}>
            <TimePicker
              width="35%"
              timeData={timeData}
              getTimeData={getTimeData}
              data={dayArray}
            />
            <SelectBox
              placeholder={`${editCycle} 시간마다`}
              open={timeSelected}
              value={seletedTime}
              items={timeOptions}
              setOpen={setTimeSeleted}
              setValue={setSelectedTime}
              setItems={setTimeOptions}
              containerStyle={{
                width: "62%",
              }}
              labelStyle={{ fontSize: 16 }}
              dropDownContainerStyle={{
                zIndex: 1000,
                borderColor: "#fff",
                backgroundColor: "#fff",
                marginTop: "3%",
              }}
            />
          </Container>
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

const Wrap = styled(View)`
  width: 100%;
  height: ${(props) => props.windowHeight};
  padding: 0px 20px;
  z-index: -100;
  background-color: #f5f5f5;
  margin-bottom: 50px;
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

const BtnText = styled(Text)`
  font-size: 20px;
  font-weight: ${(props) => (props.weight ? props.weight : "0")};
  color: ${(props) => props.color};
  text-align: center;
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
  text-align: center;
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
export default EditPill;
