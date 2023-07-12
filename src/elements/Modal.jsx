import React from "react";
import styled from "styled-components";
import { Image, View, Text, TouchableOpacity, Platform } from "react-native";

const Modal = ({
  point,
  content,
  setModal,
  value,
  navigation,
  getFade,
  fade,
  setFadeModal,
}) => {
  const onPressMove = () => {
    setModal(false);
    navigation.navigate("리워드");
  };

  const onPressCheck = () => {
    if (fade === "004") {
      setModal(null);
      getFade();
    } else {
      setModal(null);
    }
  };

  const onPressClose = () => {
    setFadeModal(false);
    setModal(null);
  };

  return (
    <ModalBg>
      {point === "loading" ? (
        <Container top={"40%"}>
          <Flex>
            <>
              <Gif
                source={require("../../assets/images/loading.gif")}
                resizeMode="contain"
              />

              <Span size="20px" weight="600" color="#333">
                포인트 지급 중...
              </Span>
            </>
          </Flex>
        </Container>
      ) : (
        <Container top={Platform.OS === "ios" ? "40%" : "38%"}>
          <Flex>
            <Img
              size={content === "004" ? "85px" : "60px"}
              height={content === "004" ? "85px" : "60px"}
              resizeMode="contain"
              source={
                content == "004"
                  ? require("../../assets/images/Profil/point.gif")
                  : require("../../assets/images/Profil/smile.png")
              }
            />

            {content === "004" ? (
              <>
                <Span size="20px" weight="600" color="#333">
                  100P 다 채우셨네요!
                </Span>
                <Span size="12px" weight="400" color="#959595">
                  (지급된 포인트는 리워드 탭에서 확인 할 수 있어요.)
                </Span>
              </>
            ) : point === 0 || value === true ? (
              <Span size="20px" weight="600" color="#333">
                {content}
              </Span>
            ) : (
              <>
                <Span size="20px" weight="600" color="#333">
                  {content}
                </Span>
                <Span size="18px" weight="600" color="#333">
                  <Span size="18px" weight="500" color="#ee4343">
                    {point}P{" "}
                  </Span>
                  지급완료되었습니다.
                </Span>

                <Span size="12px" weight="400" color="#959595">
                  (지급된 리워드는 리워드 탭에서 확인 할 수 있어요.)
                </Span>
              </>
            )}
          </Flex>
          {content === "004" ? (
            <BtnWrap>
              <Btn onPress={() => onPressClose()} width="48%" color="#aaa">
                <Span size="18px" weight="600" color="#fff">
                  닫기
                </Span>
              </Btn>
              <Btn onPress={() => onPressMove()} width="48%">
                <Span size="18px" weight="600" color="#fff">
                  확인하러 가기
                </Span>
              </Btn>
            </BtnWrap>
          ) : (
            <Btn onPress={() => onPressCheck()} width="100%">
              <Span size="18px" weight="600" color="#fff">
                확인
              </Span>
            </Btn>
          )}
        </Container>
      )}
    </ModalBg>
  );
};

const Container = styled(View)`
  width: 80%;
  border-radius: 20px;
  background: #fff;

  position: absolute;
  top: ${(props) => props.top};
  left: 10%;
  padding: 30px 15px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Img = styled(Image)`
  width: ${(props) => props.size};
  height: ${(props) => props.height};

  border-radius: 100px;
  margin-left: 10px;
  margin-bottom: 20px;
`;

const Flex = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBg = styled(View)`
  position: absolute;
  right: 0px;
  bottom: 0px;
  left: 0px;
  top: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const BtnWrap = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const Btn = styled(TouchableOpacity)`
  width: ${(props) => props.width};
  height: 50px;
  border-radius: 50px;
  background: ${(props) => (props.color ? props.color : "#ffb74d")};
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Span = styled(Text)`
  font-size: ${(props) => props.size};
  color: ${(props) => props.color};
  font-weight: ${(props) => props.weight};
  line-height: 25px;
`;

const Gif = styled(Image)`
  width: 100px;
`;

export default Modal;
