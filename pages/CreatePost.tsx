import { RouteProp } from "@react-navigation/native";
import BottomSheet from "@gorhom/bottom-sheet";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import {
  ImageInfo,
  ImagePickerResult,
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "expo-image-picker";
import {
  FC,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  useWindowDimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { Pages } from "../routes";
import { AuthContext } from "../context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { globalStyles } from "./styles";
declare global {
  interface Blob {
    name: string;
    uri: string;
  }
}

interface Props {
  navigation: NativeStackNavigationProp<Pages, "CreatePost">;
  route: RouteProp<Pages, "CreatePost">;
}

export const CreatePost: FC<Props> = ({ navigation, route }) => {
  const sheetRef = useRef<BottomSheet>(null);
  function toggleMenu() {
    sheetRef.current?.expand();
  }
  const { aToken } = useContext(AuthContext);
  const snapPoints = useMemo(() => ["25%"], []);
  const [images, setImages] = useState<ImageInfo[]>(route.params.images);
  const [content, setContent] = useState("");
  const { width } = useWindowDimensions();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={crearPost} style={{ marginRight: 5 }}>
          <Text style={{ color: "#0099ff" }}>Publicar</Text>
        </TouchableOpacity>
      ),
    });
  }, [crearPost]);
  function crearPost() {
    const form = new FormData();
    form.append("content", content);
    images.forEach(({ uri, type }) => {
      let ext;
      if (Platform.OS == "web") {
        ext = uri.split(";")[0];
        ext = ext.split("/")[1];
      } else {
        ext = uri.split("ImagePicker/");
        ext = ext[ext.length - 1];
      }
      form.append("images", {
        name: `name.${ext}`,
        type: `${type}/${ext}`,
        uri,
      });
    });

    fetch(axios.defaults.baseURL + "/posts", {
      method: "post",
      body: form,
      headers: {
        ...axios.defaults.headers.common, // access token
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => res.json())
      .then((data: any) => {
        navigation.navigate("TabsMenu");
      });
  }

  const getImage = (res: ImagePickerResult) => {
    console.log(res);
    let i = res as ImageInfo;
    let ext = i.uri.split(";")[0];
    ext = ext.split("/")[1];
    console.log("ext:", ext);
    setImages([...images, res as ImageInfo]);
  };
  function openGallery() {
    launchImageLibraryAsync({ mediaTypes: MediaTypeOptions.Images }).then(
      getImage
    );
  }
  function openCamera() {
    launchCameraAsync({ mediaTypes: MediaTypeOptions.Images }).then(getImage);
  }
  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView>
        <FlatList
          horizontal
          pagingEnabled
          data={images}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View>
              <Image source={{ uri: item.uri, width, height: width }} />
            </View>
          )}
        />
        <View
          style={{
            justifyContent: "space-between",
            width,
            flexDirection: "row",
            padding: 15,
          }}
        >
          <TextInput
            style={{ minHeight: width, flexGrow: 1 }}
            multiline
            placeholder="Descripcion..."
            value={content}
            onChangeText={setContent}
          />
          <TouchableOpacity onPress={toggleMenu}>
            <AntDesign
              name="plussquareo"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        </View>
        <BottomSheet
          backgroundStyle={{ backgroundColor: "#f3f3f3" }}
          style={{ padding: 15 }}
          enablePanDownToClose={true}
          ref={sheetRef}
          index={-1}
          snapPoints={snapPoints}
        >
          <View>
            <TouchableOpacity style={globalStyles.option} onPress={openGallery}>
              <AntDesign
                name="picture"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text>Abrir Galleria</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.option} onPress={openCamera}>
              <AntDesign
                name="camera"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text>Abrir Camara</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
