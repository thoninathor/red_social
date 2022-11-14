import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabsPages } from "../routes/TabsMenu";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  getCameraPermissionsAsync,
  requestCameraPermissionsAsync,
  ImagePickerResult,
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "expo-image-picker";
import { Pages } from "../routes";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { globalStyles } from "./styles";
import axios from "axios";
import { openCamera, openGallery } from "./functions";
interface Props {
  navigation: NativeStackNavigationProp<TabsPages & Pages, "Posts">;
}
interface IImage {
  url: string;
  id?: string;
}
interface IUser {
  id: string;
  name: string;
}
export interface IPost {
  content: string;
  id?: string;
  user?: IUser;
  images: IImage[];
}

export const Posts: FC<Props> = ({ navigation }) => {
  const [cargando, setCargando] = useState(false);
  const { width } = useWindowDimensions();
  const [posts, setPosts] = useState<IPost[]>([]);
  function getPosts() {
    setCargando(true);
    axios.get("/posts").then(({ data }) => {
      console.log(posts);
      setCargando(false);
      setPosts(data);
    });
  }
  useEffect(() => {
    getPosts();
  }, []);
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%"], []);
  useEffect(() => {
    getCameraPermissionsAsync().then(({ granted }) => {
      if (!granted) {
        requestCameraPermissionsAsync();
      }
    });
  }, []);
  function toggleMenu() {
    sheetRef.current?.expand();
  }
  function goToCreatePost(res: ImagePickerResult) {
    if (!res.cancelled) {
      navigation.navigate("CreatePost", { images: [res] });
    }
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleMenu}>
          <AntDesign
            name="plussquareo"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [sheetRef]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={posts}
        onRefresh={getPosts}
        refreshing={cargando}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <>
            <FlatList
              horizontal
              pagingEnabled
              data={item.images}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item: image }) => (
                <View>
                  <Image source={{ uri: image.url, width, height: width }} />
                </View>
              )}
            />
            <View style={{ flexDirection: "row" }}>
              <Text>{item.user?.name} </Text>
              <Text>{item.content}</Text>
            </View>
          </>
        )}
      />
      <BottomSheet
        backgroundStyle={{ backgroundColor: "#f3f3f3" }}
        style={{ padding: 15 }}
        enablePanDownToClose={true}
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
      >
        <View>
          <TouchableOpacity
            style={globalStyles.option}
            onPress={() => openGallery(goToCreatePost)}
          >
            <AntDesign
              name="picture"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text>Abrir Galleria</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.option}
            onPress={() => openCamera(goToCreatePost)}
          >
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
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
