import React from "react";
import { Platform, Linking, Alert } from "react-native";
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function setting() {
  if (Platform.OS === "ios") {
    Linking.openSettings();
    Notifications.getPermissionsAsync().then((res) =>
      console.log("😡😡😡", res)
    );
    registerForPushNotificationsAsync();
  } else {
    const pkg = Constants.manifest.releaseChannel
      ? Constants.manifest.android.package
      : "host.exp.exponent";
    await startActivityAsync(ActivityAction.APP_NOTIFICATION_SETTINGS, {
      extra: { "android.provider.extra.APP_PACKAGE": pkg },
    }).then((data) => {
      registerForPushNotificationsAsync().then((res) => {
        if (res == undefined) {
          Alert.alert("알림이 설정 되지 않았습니다!");
        }
      });
    });
  }
}

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("오류가 발생하였습니다!");
  }

  return token;
}
