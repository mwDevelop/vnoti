import React from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
} from "react-native";
import styled from "styled-components";

const ProfilImg = ({ url, onChangePhoto, size, getImg }) => {
  const [status, requestPremission] = ImagePicker.useMediaLibraryPermissions();

  const uploadImage = async () => {
    if (!status?.granted) {
      const permission = await requestPremission();
      if (!permission?.granted) {
        if (Platform.OS == "ios") {
          Alert.alert(
            "앨범 접근 허용",
            "앨범 접근이 허용되어 있지 않습니다. 허용하시겠습니까?",
            [
              {
                text: "허용하러가기",
                onPress: () => {
                  Linking.openSettings().then((res) => console.log(res));
                },
              },
              {
                text: "취소",
                onPress: () => {},
                style: "cancel",
              },
            ],
            {
              cancelable: true,
            }
          );
        }
        return null;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      quality: 0.1,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const photo = `data:image/jpg;base64,${asset.base64}`;

      onChangePhoto(photo);
      getImg(photo);
    }
  };

  return (
    <Wrap size={size}>
      {!!!url || url == "null" ? (
        <Profile
          source={require("../../../assets/images/Profil/profil_10.png")}
          size={size}
        />
      ) : (
        <Profile source={{ uri: url }} size={size} />
      )}

      <Btn onPress={uploadImage}>
        <Icon source={require("../../../assets/images/camera.png")} />
      </Btn>
    </Wrap>
  );
};

const Wrap = styled(View)`
  position: relative;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
`;

const Profile = styled(Image)`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: 100px;
`;

const Btn = styled(TouchableOpacity)`
  position: absolute;
  bottom: 0px;
  right: 0px;
`;
const Icon = styled(Image)`
  width: 30px;
  height: 30px;
`;

export default ProfilImg;
