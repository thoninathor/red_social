import {
  launchImageLibraryAsync,
  MediaTypeOptions,
  launchCameraAsync,
  ImagePickerResult,
} from "expo-image-picker";
import BottomSheet from "@gorhom/bottom-sheet";
import { AntDesign } from "@expo/vector-icons";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { globalStyles } from "../pages/styles";

interface Props {
  getImage: (res: ImagePickerResult) => void;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
export const Gallery: FC<Props> = ({ getImage, visible, setVisible }) => {
  useEffect(toggleMenu, [visible]);

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%"], []);
  function toggleMenu() {
    sheetRef.current?.expand;
  }
  function openGallery() {
    setVisible(false);
    launchImageLibraryAsync({ mediaTypes: MediaTypeOptions.Images }).then(
      getImage
    );
  }
  function openCamera() {
    setVisible(false);
    launchCameraAsync({ mediaTypes: MediaTypeOptions.Images }).then(getImage);
  }
  return (
    <GestureHandlerRootView style={globalStyles.container}>
      <BottomSheet
        backgroundStyle={{ backgroundColor: "#f3f3f3" }}
        style={{ padding: 15 }}
        enablePanDownToClose={true}
        index={-1}
        ref={sheetRef}
        snapPoints={snapPoints}
      >
        <TouchableOpacity style={styles.option} onPress={openGallery}>
          <AntDesign
            name="picture"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          />
          <Text>Abrir Galleria</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={openCamera}>
          <AntDesign
            name="camera"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          />
          <Text>Abrir Camara</Text>
        </TouchableOpacity>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    margin: 15,
  },
});
